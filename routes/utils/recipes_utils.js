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

async function searchByLimit(limit) {
    return null;
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

async function searchByLimit(limit)
{
    return null;
}

function searchParamsValidation(params)
{
    return
        params.query != undefined && 
        params.query.length > 0 &&
        [5, 10, 15].includes(params.limit) &&
        params.cuisines.every(cuisine => constSearchValidationOptions.cuisine.includes(cuisine)) &&
        params.diets.every(diet => constSearchValidationOptions.diet.includes(diet)) &&
        params.intolerances.every(intolerance => constSearchValidationOptions.intolerance.includes(intolerance))
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
