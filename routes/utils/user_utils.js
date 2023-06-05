const { Int } = require("mssql");
const DButils = require("./DButils");
const recipes_utils = require("./recipes_utils");
const validator = require("./validator");

/**
 * returns all object recipesData of the logged-in user
 * recipesData format -> {'lastWatched':[], 'favorites':[], 'myRecipes':[]}
 */
async function getUserRecipesData(user_id){
    if (!validator.validateUserLogedIn(user_id)){
        throw { status: 401, message: `user_id is undefined or null` };
    }
    const result = await DButils.execQuery(`SELECT recipesData FROM users WHERE username='${user_id}'`);
    recipesData = result[0].recipesData
    console.log(recipesData)
    return recipesData
}

 // updates array of favorites recipes that were saved by the logged-in user
async function markAsFavorite(user_id, recipe_id){
    const idIsDBType = validator.validateIfRecipeIdIsDBType(recipe_id)
    const idIsApiType = validator.validateRecipeIdIsApiType(recipe_id)
    if (idIsDBType){
        const existsInDB = await validator.validateRecipeIdExistsInDB(recipe_id)
        if (!existsInDB){
            throw { status: 404, message: `recipeId ${recipe_id} does not exist` };
        }
    }
    else if (idIsApiType){
        const existsInApi = await validator.validateRecipeIdExistsInApi(recipe_id)
        if (!existsInApi){
            throw { status: 404, message: `recipeId ${recipe_id} does not exist` };
        }
    }
    else{
        throw { status: 400, message: `recipeId is not according to format` };
    }
    const recipesData = await getUserRecipesData(user_id);
    if (recipesData.favorites.includes(recipe_id)) {
        throw { status: 409, message: `${recipe_id} already in ${user_id}'s favorites` };
    }
    recipesData.favorites.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recipesData='${JSON.stringify(recipesData)}' WHERE username='${user_id}'`);
}

// returns array of favorites recipes that were saved by the logged-in user
async function getFavoriteRecipes(user_id){
    const recipesData = await getUserRecipesData(user_id);
    const favoriteRecipesIds = recipesData.favorites;
    console.log(`favoriteRecipes = ${favoriteRecipesIds}`)
    const favoriteRecipesDetails = []
    for (let i = 0; i < favoriteRecipesIds.length; i++) {
        let recipe_info;
        recipe_id = favoriteRecipesIds[i]
        if (validator.validateIfRecipeIdIsDBType(recipe_id)){
            recipe_info = await recipes_utils.getRecipeInformationFromDB(recipe_id)
        }
        else if (validator.validateRecipeIdIsApiType(recipe_id)){
            recipe_info = await recipes_utils.getRecipeInformationFromApi(recipe_id)
        }
        if (!recipe_info){
            throw { status: 404, message: "Not found" };
        }
        favoriteRecipesDetails.push(recipe_info)
    }
    return favoriteRecipesDetails;
}

// updates sorted by time array of last watched recipes that were saved by the logged-in user
async function addToLastWatched(user_id, recipe_id) {
    const idIsDBType = validator.validateIfRecipeIdIsDBType(recipe_id)
    const idIsApiType = validator.validateRecipeIdIsApiType(recipe_id)
    if (idIsDBType){
        const existsInDB = await validator.validateRecipeIdExistsInDB(recipe_id)
        if (!existsInDB){
            throw { status: 404, message: `recipeId ${recipe_id} does not exist` };
        }
    }
    else if (idIsApiType){
        const existsInApi = await validator.validateRecipeIdExistsInApi(recipe_id)
        if (!existsInApi){
            throw { status: 404, message: `recipeId ${recipe_id} does not exist` };
        }
    }
    else{
        throw { status: 400, message: `recipeId is not according to format` };
    }
    const recipesData = await getUserRecipesData(user_id);
    if (recipesData.lastWatched.includes(recipe_id)) {
        throw { status: 409, message: `${recipe_id} already in ${user_id}'s lastWatched` };
    }
    recipesData.lastWatched.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recipesData='${JSON.stringify(recipesData)}' WHERE username='${user_id}'`);
}


// returns sorted by time array of last watched recipes that were saved by the logged-in user
async function getLastWatched(user_id) {
    const recipesData = await getUserRecipesData(user_id);
    const lastWatchedIds = recipesData.lastWatched;
    console.log(`lastWatched = ${lastWatchedIds}`)
    const lastWatchedRecipes = []
    for (let i = 0; i < lastWatchedIds.length; i++) {
        let recipe_info;
        recipe_id = lastWatchedIds[i]
        if (validator.validateIfRecipeIdIsDBType(recipe_id)){
            recipe_info = await recipes_utils.getRecipeInformationFromDB(recipe_id)
        }
        else if (validator.validateRecipeIdIsApiType(recipe_id)){
            recipe_info = await recipes_utils.getRecipeInformationFromApi(recipe_id)
        }
        if (!recipe_info){
            throw { status: 404, message: "Not found" };
        }
        lastWatchedRecipes.push(recipe_info)
    }
    return lastWatchedRecipes;
}

// updates array of users recipes recipes that were saved by the logged-in user
async function addToMyRecipes(user_id, recipe_id) {
    const idIsDBType = validator.validateIfRecipeIdIsDBType(recipe_id)
    if (!idIsDBType){
        throw { status: 400, message: `recipeId is not according to format` };
    }
    const recipesData = await getUserRecipesData(user_id);
    if (recipesData.myRecipes.includes(recipe_id)) {
        throw { status: 409, message: `${recipe_id} already in ${user_id}'s myRecipes` };
    }
    recipesData.myRecipes.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recipesData='${JSON.stringify(recipesData)}' WHERE username='${user_id}'`);
}

// returns array of users recipes recipes that were saved by the logged-in user
async function getMyRecipes(user_id) {
    const recipesData = await getUserRecipesData(user_id);
    const myRecipesIds = recipesData.myRecipes;
    console.log(`myRecipes = ${myRecipesIds}`)
    const myRecipes = []
    for (let i = 0; i < myRecipesIds.length; i++) {
        let recipe_info;
        recipe_id = myRecipesIds[i]
        if (validator.validateIfRecipeIdIsDBType(recipe_id)){
            recipe_info = await recipes_utils.getRecipeInformationFromDB(recipe_id)
        }
        if (!recipe_info){
            throw { status: 404, message: "Not found" };
        }
        myRecipes.push(recipe_info)
    }
    return myRecipes;
  }

// returns SerachLimit of logged-in user
async function getSearchLimit(user_id) {
    if (!validator.validateUserLogedIn(user_id)){
        throw { status: 401, message: `user_id is undefined or null` };
    }
    const result = await DButils.execQuery(`SELECT searchLimit FROM users WHERE username='${user_id}'`);
    const searchLimit = result[0].searchLimit
    console.log(`searchLimit = ${searchLimit}`)
    return searchLimit
}
  
// updates SerachLimit that were saved by the logged-in user
async function updateSerachLimit(user_id, userSerachLimit) {
    if (!validator.validateUserLogedIn(user_id)){
        throw { status: 401, message: `user_id is undefined or null` };
    }
    if (!validator.validateSearchLimit(userSerachLimit)){
        throw { status: 400, message: `searchLimit must be int 5|10|15` };
    }
    await DButils.execQuery(`UPDATE users SET searchLimit='${userSerachLimit}' WHERE username='${user_id}'`);
}

exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsFavorite = markAsFavorite;
exports.getLastWatched = getLastWatched;
exports.addToLastWatched = addToLastWatched;
exports.getMyRecipes = getMyRecipes;
exports.addToMyRecipes = addToMyRecipes;
exports.getSearchLimit = getSearchLimit;
exports.updateSerachLimit = updateSerachLimit;
