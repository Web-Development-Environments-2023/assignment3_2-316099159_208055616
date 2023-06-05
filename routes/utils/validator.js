const axios = require("axios")
const DButils = require("./DButils");
const constSearchValidationOptions = {
    cuisine: ["African", "Asian", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European", "European", 
    "French", "German", "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean", 
    "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"],
    diet: ["Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", 
    "Primal", "Low FODMAP", "Whole30"],
    intolerance: ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"]
};
const api_domain = "https://api.spoonacular.com/recipes";

function validateSearchLimit(searchLimit){
    if (typeof searchLimit === 'number'){
        if ([5, 10, 15].includes(searchLimit)){
            return true
        }
    }
    return false
}

function validateParamsForSearch(params){
    if(
        params != null &&
        params != undefined &&
        params.query != undefined &&
        params.query.length > 0 &&
        [5, 10, 15].includes(params.limit) &&
        params.cuisines.every(cuisine => constSearchValidationOptions.cuisine.includes(cuisine)) &&
        params.diets.every(diet => constSearchValidationOptions.diet.includes(diet)) &&
        params.intolerances.every(intolerance => constSearchValidationOptions.intolerance.includes(intolerance))
    ){
        return true
    }
    return false
}

const argumentsValidation = (req, res, next) => {
    try{
        return (req != null && 
            req != undefined && 
            res != null && 
            next != null && 
            req.body != null && 
            req.body != undefined &&
            req.body.length != 0);
    }
    catch (error){
        return false
    }
}

function validateUserLogedIn(user_id){
    if (user_id === undefined || user_id === null){
        return false;
    }
    return true
}

function validateIfRecipeIdIsDBType(recipe_id){
    const pattern = /^000\d+$/;
    if (typeof recipe_id === 'string'){
        if (pattern.test(recipe_id)){
            return true
        }
    }
    return false
}

function validateRecipeIdIsApiType(recipe_id){
    if (typeof recipe_id === 'number'){
        if (recipe_id > 0){
            return true
        }
    }
    return false
}

async function validateRecipeIdExistsInApi(recipe_id){
    try{
        const recipe = await axios.get(`${api_domain}/${recipe_id}/information`, {
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

async function validateRecipeIdExistsInDB(recipe_id)
{
    try{
        const recipeIds = await DButils.execQuery("SELECT id FROM recipes");
        if (recipeIds.find((x) => x.id === recipe_id)){
            return true
        }
    }
    catch (error){
        return false
    }
    return false
}

function validateRecipeArgumentAreValid(params){
    try{
        if (params == null || params == undefined){
            return false
        }
        if (params.title == null || params.title == undefined || 
            params.title.length == 0 || typeof params.title != 'string'){
            return false
        }
        if (params.image == null || params.image == undefined || 
            params.image.length == 0 || typeof params.image != 'string'){
            return false
        }
        if (params.readyInMinutes == null || params.readyInMinutes == undefined || 
            params.readyInMinutes < 0 || typeof params.readyInMinutes != 'number'){
            return false
        }
        if (params.vegetarian == null || params.vegetarian == undefined || typeof params.vegetarian != 'boolean'){
            return false
        }
        if (params.vegan == null || params.vegan == undefined || typeof params.vegan != 'boolean'){
            return false
        }
        if (params.glutenFree == null || params.glutenFree == undefined || typeof params.glutenFree != 'boolean'){
            return false
        }
        return true
    } catch (error){
        return false
    }
}

exports.validateRecipeArgumentAreValid = validateRecipeArgumentAreValid
exports.validateSearchLimit = validateSearchLimit
exports.validateParamsForSearch = validateParamsForSearch
exports.validateUserLogedIn = validateUserLogedIn
exports.argumentsValidation = argumentsValidation
exports.validateIfRecipeIdIsDBType = validateIfRecipeIdIsDBType;
exports.validateRecipeIdIsApiType = validateRecipeIdIsApiType;
exports.validateRecipeIdExistsInApi = validateRecipeIdExistsInApi;
exports.validateRecipeIdExistsInDB = validateRecipeIdExistsInDB;
