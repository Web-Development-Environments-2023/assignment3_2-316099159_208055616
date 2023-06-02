const DButils = require("./DButils");

/**
 * returns all object recipesData of the logged-in user
 * recipesData format -> {'lastWatched':[], 'favorites':[], 'myRecipes':[]}
 */
async function getUserRecipesData(user_id){
    const result = await DButils.execQuery(`SELECT recipesData FROM users WHERE username='${user_id}'`);
    recipesData = result[0].recipesData
    console.log(recipesData)
    return recipesData
}

// returns array of favorites recipes that were saved by the logged-in user
async function getFavoriteRecipes(user_id){
    const recipesData = await getUserRecipesData(user_id);
    const favoriteRecipes = recipesData.favorites;
    console.log(`favoriteRecipes = ${favoriteRecipes}`)
    return favoriteRecipes;
}

 // updates array of favorites recipes that were saved by the logged-in user
async function markAsFavorite(user_id, recipe_id){
    const recipesData = await getUserRecipesData(user_id);
    if (recipesData.favorites.includes(recipe_id)) {
        throw { status: 409, message: `${recipe_id} already in ${user_id}'s favorites` };
    }
    recipesData.favorites.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recipesData='${JSON.stringify(recipesData)}' WHERE username='${user_id}'`);
}

// returns sorted by time array of last watched recipes that were saved by the logged-in user
async function getLastWatched(user_id) {
    const recipesData = await getUserRecipesData(user_id);
    const lastWatched = recipesData.lastWatched;
    console.log(`lastWatched = ${lastWatched}`)
    return lastWatched;
}

// updates sorted by time array of last watched recipes that were saved by the logged-in user
async function addToLastWatched(user_id, recipe_id) {
    const recipesData = await getUserRecipesData(user_id);
    if (recipesData.lastWatched.includes(recipe_id)) {
        throw { status: 409, message: `already in ${user_id}'s lastWatched` };
    }
    recipesData.lastWatched.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recipesData='${JSON.stringify(recipesData)}' WHERE username='${user_id}'`);
}

// returns array of users recipes recipes that were saved by the logged-in user
async function getMyRecipes(user_id) {
  const recipesData = await getUserRecipesData(user_id);
  const myRecipes = recipesData.myRecipes;
  console.log(`myRecipes = ${myRecipes}`)
  return myRecipes;
}

// updates array of users recipes recipes that were saved by the logged-in user
async function addToMyRecipes(user_id, recipe_id) {
    const recipesData = await getUserRecipesData(user_id);
    if (recipesData.myRecipes.includes(recipe_id)) {
        throw { status: 409, message: `${recipe_id} already in ${user_id}'s myRecipes` };
    }
    recipesData.myRecipes.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recipesData='${JSON.stringify(recipesData)}' WHERE username='${user_id}'`);
}

// returns SerachLimit of logged-in user
async function getSearchLimit(user_id) {
    const result = await DButils.execQuery(`SELECT searchLimit FROM users WHERE username='${user_id}'`);
    const searchLimit = result[0].searchLimit
    console.log(`searchLimit = ${searchLimit}`)
    return searchLimit
}
  
// updates SerachLimit that were saved by the logged-in user
async function updateSerachLimit(user_id, userSerachLimit) {
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
