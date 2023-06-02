const DButils = require("./DButils");

/**
 * returns all object recepiesData of the logged-in user
 * recepiesData format -> {'lastWatched':[], 'favorites':[], 'myRecepies':[]}
 */
async function getUserRecepiesData(user_id){
    const result = await DButils.execQuery(`SELECT recepiesData FROM users WHERE user_id='${user_id}'`);
    return JSON.parse(result[0].recepiesData);
}

// returns array of favorites recipes that were saved by the logged-in user
async function getFavoriteRecipes(user_id){
    const recepiesData = await getUserRecepiesData(user_id);
    const favoriteRecepies = recepiesData.favorites;
    return favoriteRecepies;
}

 // updates array of favorites recipes that were saved by the logged-in user
async function markAsFavorite(user_id, recipe_id){
    const recepiesData = await getUserRecepiesData(user_id);
    recepiesData.favorites.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recepiesData='${JSON.stringify(recepiesData)}' WHERE user_id='${user_id}'`);
}

// returns sorted by time array of last watched recipes that were saved by the logged-in user
async function getLastWatched(user_id) {
    const recepiesData = await getUserRecepiesData(user_id);
    const lastWatched = recepiesData.lastWatched;
    return lastWatched;
}

// updates sorted by time array of last watched recipes that were saved by the logged-in user
async function addToLastWatched(user_id, recipe_id) {
    const recepiesData = await getUserRecepiesData(user_id);
    recepiesData.lastWatched.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recepiesData='${JSON.stringify(recepiesData)}' WHERE user_id='${user_id}'`);
}

// returns array of users recepies recipes that were saved by the logged-in user
async function getMyRecepies(user_id) {
  const recepiesData = await getUserRecepiesData(user_id);
  const myRecepies = recepiesData.myRecepies;
  return myRecepies;
}

// updates array of users recepies recipes that were saved by the logged-in user
async function addToMyRecepies(user_id, recipe_id) {
    const recepiesData = await getUserRecepiesData(user_id);
    recepiesData.myRecepies.push(recipe_id);
    await DButils.execQuery(`UPDATE users SET recepiesData='${JSON.stringify(recepiesData)}' WHERE user_id='${user_id}'`);
}

// returns SerachLimit of logged-in user
async function getSearchLimit(user_id) {
    const result = await DButils.execQuery(`SELECT searchLimit FROM users WHERE user_id='${user_id}'`);
    return result[0].searchLimit
}
  
// updates SerachLimit that were saved by the logged-in user
async function updateSerachLimit(user_id, userSerachLimit) {
    await DButils.execQuery(`UPDATE users SET searchLimit='${userSerachLimit}' WHERE user_id='${user_id}'`);
}

exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsFavorite = markAsFavorite;
exports.getLastWatched = getLastWatched;
exports.addToLastWatched = addToLastWatched;
exports.getMyRecepies = getMyRecepies;
exports.addToMyRecepies = addToMyRecepies;
exports.getSearchLimit = getSearchLimit;
exports.updateSerachLimit = updateSerachLimit;
