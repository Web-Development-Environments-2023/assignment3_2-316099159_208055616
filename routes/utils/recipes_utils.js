const axios = require("axios");
const e = require("express");
const DButils = require("./DButils");
const user_utils = require("./user_utils");
const validator = require("./validator");
const api_domain = "https://api.spoonacular.com/recipes";

async function addNewRecipe(req) {
    user_id = req.session.user_id;
    if (!validator.validateUserLogedIn(user_id))
    {
        throw { status: 401, message: "user is unauthorized"};
    }
    req = req.body;
    const recipe_id = await generateNewId();
    const vegan = boolIntConverter(req.vegan);
    const vegetarian = boolIntConverter(req.vegetarian);
    const glutenFree = boolIntConverter(req.glutenFree);
    await DButils.execQuery(
        `INSERT INTO recipes VALUES ('${recipe_id}', '${req.title}', '${req.image}', '${req.readyInMinutes}', '${parseInt(0)}', '${vegetarian}', '${vegan}', '${glutenFree}')`
    );
    await user_utils.addToMyRecipes(user_id, recipe_id);
    return req;
}

async function getRandomRecipes(){
    try{
        const rawRandomRecipes = await axios.get(`${api_domain}/random`,
        {   
            params:
            {
                number: 3, 
                apiKey:process.env.spooncular_apiKey,
            }
        });
        const recipes = [];
        rawRandomRecipes.data.recipes.forEach((recipe_info) => {
            schemedRecipe = transformRecipeBySchemePreview(recipe_info)
            recipes.push(schemedRecipe) 
        });
        return recipes;
    }
    catch (error) {
        throw { status: 500, message: "error in getRandomRecipes"};
    }
}

async function searchByLimit(params){
    if (params.cuisines != '') {params.cuisines = params.cuisines.join(",");}
    else {params.cuisines = '';}
    if (params.diets != '') {params.diets = params.diets.join(",");}
    else {params.diets = '';}
    if (params.intolerances != '') {params.intolerances = params.intolerances.join(",");}
    else {params.intolerances = '';}    
    const rawRecipes = await axios.get(`${api_domain}/complexSearch`,
    {
        params:
        {
            query: params.query,
            cuisine: params.cuisines,
            diet: params.diets,
            intolerances: params.intolerances,
            number: params.limit,
            apiKey:process.env.spooncular_apiKey,
            addRecipeInformation: true,
        }
    });
    const recipes = [];
    rawRecipes.data.results.forEach((recipe) => {
        const schemedRecipe = transformRecipeBySchemePreview(recipe)
        recipes.push(schemedRecipe);
    });
    return recipes;
}

function boolIntConverter(value)
{
    if (value == true) {
        return 1;
    }
    else if (value == false) {
        return 0;
    }
    else {
        return value;
    }
}

async function generateNewId()
{
    let result = await DButils.execQuery("SELECT MAX(id) as id FROM latestindex");
    newId = result[0].id + 1;
    newId = "000" + newId;
    console.log("Recipe new Id is: " + newId);
    await DButils.execQuery(`INSERT INTO latestindex VALUES ('${newId}')`);
    return newId;
}

async function getRecipeInformationFromApi(recipe_id, getPreviewScheme = true) {
    if (!validator.validateRecipeIdIsApiType(recipe_id)){
        throw {status: 400, message: `recipe_id: ${recipe_id} not according to format`}
    }
    const exists = await validator.validateRecipeIdExistsInApi(recipe_id)
    if (!exists){
        throw { status: 404, message: `recipe_id: ${recipe_id} does not exist`};
    }
    const recipe_info = await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
    let schemed_recipe;
    if (getPreviewScheme) {
        schemed_recipe = transformRecipeBySchemePreview(recipe_info.data)
    }
    else {
        schemed_recipe = transformRecipeBySchemeFull(recipe_info.data)
    }
    return schemed_recipe
}

async function getRecipeInformationFromDB(recipe_id) {
    if (!validator.validateIfRecipeIdIsDBType(recipe_id)){
        throw {status: 400, message: `recipe_id: ${recipe_id} not according to format`}
    }
    const exists = await validator.validateRecipeIdExistsInDB(recipe_id)
    if (!exists){
        throw { status: 404, message: `recipe_id: ${recipe_id} does not exist`};
    }
    const recipe_info = await DButils.execQuery(`SELECT * FROM recipes WHERE id = '${recipe_id}'`);
    return recipe_info[0]
}

function transformRecipeBySchemePreview(recipe_info){
    const { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info;
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
    }
}

function transformRecipeBySchemeFull(recipe_info){
    const { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree ,extendedIngredients, analyzedInstructions, instructions, servings } = recipe_info;
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        extendedIngredients: extendedIngredients,
        analyzedInstructions: analyzedInstructions,
        instructions: instructions,
        servings: servings
    }
} 

exports.getRecipeInformationFromApi = getRecipeInformationFromApi;
exports.getRecipeInformationFromDB = getRecipeInformationFromDB;
exports.addNewRecipe = addNewRecipe;
exports.getRandomRecipes = getRandomRecipes;
exports.searchByLimit = searchByLimit;
