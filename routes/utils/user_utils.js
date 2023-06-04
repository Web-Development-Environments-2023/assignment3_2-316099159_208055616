const { Int } = require("mssql");
const DButils = require("./DButils");
const recipes_utils = require("./recipes_utils");

/**
 * returns all object recipesData of the logged-in user
 * recipesData format -> {'lastWatched':[], 'favorites':[], 'myRecipes':[]}
 */
async function getUserRecipesData(user_id){
    if (user_id === undefined || user_id === null){
        throw { status: 400, message: `user_id is undefined or null` };
    }
    const result = await DButils.execQuery(`SELECT recipesData FROM users WHERE username='${user_id}'`);
    recipesData = result[0].recipesData
    console.log(recipesData)
    return recipesData
}

// returns array of favorites recipes that were saved by the logged-in user
async function getFavoriteRecipes(user_id){
    if (user_id === undefined || user_id === null){
        throw { status: 400, message: `user_id is undefined or null` };
    }
    const recipesData = await getUserRecipesData(user_id);
    const favoriteRecipes = recipesData.favorites;
    console.log(`favoriteRecipes = ${favoriteRecipes}`)
    return favoriteRecipes;
}

 // updates array of favorites recipes that were saved by the logged-in user
async function markAsFavorite(user_id, recipe_id){
    if (recipe_id === undefined || recipe_id === null){
        throw { status: 400, message: `recipe_id is undefined or null` };
    }
    if (!recipes_utils.validateRecipeIdExists(recipe_id)){
        throw { status: 404, message: `recipe_id ${recipe_id} not found` };
    }
    const recipesData = await getUserRecipesData(user_id);
    if (recipesData.favorites.includes(recipe_id)) {
        throw { status: 409, message: `${recipe_id} already in ${user_id}'s favorites` };
    }
    recipesData.favorites.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recipesData='${JSON.stringify(recipesData)}' WHERE username='${user_id}'`);
}

// returns sorted by time array of last watched recipes that were saved by the logged-in user
async function getLastWatched(user_id) {
    if (user_id === undefined || user_id === null){
        throw { status: 400, message: `user_id is undefined or null` };
    }
    const recipesData = await getUserRecipesData(user_id);
    const lastWatched = recipesData.lastWatched;
    console.log(`lastWatched = ${lastWatched}`)
    return lastWatched;
}

// updates sorted by time array of last watched recipes that were saved by the logged-in user
async function addToLastWatched(user_id, recipe_id) {
    if (recipe_id === undefined || recipe_id === null){
        throw { status: 400, message: `recipe_id is undefined or null` };
    }
    if (user_id === undefined || user_id === null){
        throw { status: 400, message: `user_id is undefined or null` };
    }
    if (!recipes_utils.validateRecipeIdExists(recipe_id)){
        throw { status: 404, message: `recipe_id ${recipe_id} not found` };
    }
    const recipesData = await getUserRecipesData(user_id);
    if (recipesData.lastWatched.includes(recipe_id)) {
        throw { status: 409, message: `already in ${user_id}'s lastWatched` };
    }
    recipesData.lastWatched.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recipesData='${JSON.stringify(recipesData)}' WHERE username='${user_id}'`);
}

// returns array of users recipes recipes that were saved by the logged-in user
async function getMyRecipes(user_id) {
    if (user_id === undefined || user_id === null){
        throw { status: 400, message: `user_id is undefined or null` };
    }
  const recipesData = await getUserRecipesData(user_id);
  const myRecipes = recipesData.myRecipes;
  console.log(`myRecipes = ${myRecipes}`)
  return myRecipes;
}

// updates array of users recipes recipes that were saved by the logged-in user
async function addToMyRecipes(user_id, recipe_id) {
    if (recipe_id === undefined || recipe_id === null){
        throw { status: 400, message: `recipe_id is undefined or null` };
    }
    if (user_id === undefined || user_id === null){
        throw { status: 400, message: `user_id is undefined or null` };
    }
    if (!recipes_utils.validateRecipeIdExists(recipe_id)){
        throw { status: 404, message: `recipe_id ${recipe_id} not found` };
    }
    const recipesData = await getUserRecipesData(user_id);
    if (recipesData.myRecipes.includes(recipe_id)) {
        throw { status: 409, message: `${recipe_id} already in ${user_id}'s myRecipes` };
    }
    recipesData.myRecipes.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recipesData='${JSON.stringify(recipesData)}' WHERE username='${user_id}'`);
}

// returns SerachLimit of logged-in user
async function getSearchLimit(user_id) {
    if (user_id === undefined || user_id === null){
        throw { status: 400, message: `user_id is undefined or null` };
    }
    const result = await DButils.execQuery(`SELECT searchLimit FROM users WHERE username='${user_id}'`);
    const searchLimit = result[0].searchLimit
    console.log(`searchLimit = ${searchLimit}`)
    return searchLimit
}
  
// updates SerachLimit that were saved by the logged-in user
async function updateSerachLimit(user_id, userSerachLimit) {
    if (user_id === undefined || user_id === null){
        throw { status: 400, message: `user_id is undefined or null` };
    }
    if (typeof(userSerachLimit) !==  Number){
        throw { status: 401, message: `userSerachLimit is undefined or null` };
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
