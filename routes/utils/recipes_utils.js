const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://api.spoonacular.com/recipes";

async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeDetails(recipe_id) {
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
    vegan = boolIntConverter(r.vegan);
    vegetarian = boolIntConverter(r.vegetarian);
    glutenFree = boolIntConverter(r.glutenFree);
    console.log("addNewRecipe");
    await DButils.execQuery(
        `INSERT INTO recipes VALUES ('${r.id}', '${r.title}', '${r.image}', 
        '${r.readyInMinutes}', '${r.popularity}', '${vegetarian}', '${vegan}', '${glutenFree}')`
    );
    return r;
}

async function getRandomRecipes(){
    let result = await axios.get(`${api_domain}/random`,
    {   
        params:
        {
            number: 3, 
            apiKey:process.env.spooncular_apiKey,
        }
    });
    return result.data["recipes"];
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

exports.getRecipeDetails = getRecipeDetails;
exports.addNewRecipe = addNewRecipe;
exports.getRandomRecipes = getRandomRecipes;
