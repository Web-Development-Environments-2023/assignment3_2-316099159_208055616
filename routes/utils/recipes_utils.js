const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://api.spoonacular.com/recipes";

const constSearchValidationOptions = {
    cuisine: ["African", "Asian", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European", "European", 
    "French", "German", "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean", 
    "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"],
    diet: ["Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", 
    "Primal", "Low FODMAP", "Whole30"],
    intolerance: ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"]
  };

  async function searchByLimit(params)
  {
    if (params == undefined || params == null)
    {
        throw { status: 400, message: "params is null"};
    }
      params.cuisines = params.cuisines.join(",");
      params.diets = params.diets.join(",");
      params.intolerances = params.intolerances.join(",");
  
      let result = await axios.get(`${api_domain}/complexSearch`,
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
      let recipes = [];
        result.data.results.forEach((recipe) => {
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe;
            recipes.push({
                id: id,
                title: title,
                readyInMinutes: readyInMinutes,
                image: image,
                popularity: aggregateLikes,
                vegan: vegan,
                vegetarian: vegetarian,
                glutenFree: glutenFree,
            });
        });
        return recipes;
  }

async function getRecipeInformation(recipe_id) {
    if (recipe_id == undefined || recipe_id == null)
    {
        throw { status: 400, message: "recipe_id is null"};
    }
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeDetails(recipe_id) {
    if (recipe_id == undefined || recipe_id == null)
    {
        throw { status: 400, message: "recipe_id is null"};
    }
    console.log("recipe_id: " + recipe_id);
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;
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

async function addNewRecipe(r) {
    if (r == undefined || r == null)
    {
        throw { status: 400, message: "recipe is null"};
    }
    let id = await generateNewId();
    vegan = boolIntConverter(r.vegan);
    vegetarian = boolIntConverter(r.vegetarian);
    glutenFree = boolIntConverter(r.glutenFree);
    console.log("addNewRecipe");
    await DButils.execQuery(
        `INSERT INTO recipes VALUES ('${id}', '${r.title}', '${r.image}', 
        '${r.readyInMinutes}', '${r.popularity}', '${vegetarian}', '${vegan}', '${glutenFree}')`
    );
    return r;
}

async function getRandomRecipes(){
    try{
        let result = await axios.get(`${api_domain}/random`,
        {   
            params:
            {
                number: 3, 
                apiKey:process.env.spooncular_apiKey,
            }
        });
        let recipes = [];
        result.data.recipes.forEach((recipe) => {
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe;
            recipes.push({
                id: id,
                title: title,
                readyInMinutes: readyInMinutes,
                image: image,
                popularity: aggregateLikes,
                vegan: vegan,
                vegetarian: vegetarian,
                glutenFree: glutenFree,
            });
        }
        );
        return recipes;
    }
    catch (error) {
        throw { status: 500, message: "error in getRandomRecipes"};
    }
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

async function validateRecipeIdExists(recipeId)
{
    if (recipeId == undefined || recipeId == null)
    {
        throw { status: 400, message: "recipeId is null"};
    }
    const recipes = await DButils.execQuery("SELECT id FROM recipes");
    if (!recipes.find((x) => x.id === recipeId)){
        if(!validateRecipeIdExistsInApi(recipeId)){
            throw { status: 404, message: `recipeId ${recipeId} does not exist` };
        }
    }
    return true
}

async function validateRecipeIdExistsInApi(recipeId)
{
    if (recipeId == undefined || recipeId == null){
        throw { status: 400, message: "recipeId is null"};
    }
    try{
    const recipe = await axios.get(`${api_domain}/${recipeId}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
    if (!recipe){
        return false;
    }
    } catch (error) {
        return false;
    }
    return true;
}

const argumentsValidation = (req, res, next) => {
    return (req != null && req.body != null && res != null && next != null);
}

async function generateNewId()
{
    let result = await DButils.execQuery("SELECT MAX(id) as id FROM latestindex");
    newId = result[0].id + 1;
    console.log("Recipe new Id is: " + newId);
    await DButils.execQuery(`INSERT INTO latestindex VALUES ('${newId}')`);
    return newId;
}

exports.constSearchValidationOptions = constSearchValidationOptions;
exports.argumentsValidation = argumentsValidation;
exports.generateNewId = generateNewId;
exports.getRecipeDetails = getRecipeDetails;
exports.addNewRecipe = addNewRecipe;
exports.getRandomRecipes = getRandomRecipes;
exports.searchByLimit = searchByLimit;
exports.validateRecipeIdExists = validateRecipeIdExists;
exports.validateRecipeIdExistsInApi = validateRecipeIdExistsInApi;
