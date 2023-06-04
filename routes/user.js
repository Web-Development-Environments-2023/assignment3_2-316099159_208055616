var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * AUTH - Authenticate all incoming requests by middleware
 * 
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
      else
        throw { status: 401, message: "Unauthorized" };
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * PUT - This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 * @param {String} recipeId - the id of the recipe to save as favorite
 * @returns {String} - message that the recipe successfully saved as favorite
 * @example http://localhost:3000/user/favorites
 */
router.put('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
  } catch(error){
    next(error);
  }
})


/**
 * GET - This path returns the favorites recipes that were saved by the logged-in user
 * @returns {JSON} - the favorites recipes that were saved by the logged-in user
 * @example http://localhost:3000/user/favorites
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_ids = await user_utils.getFavoriteRecipes(user_id);
    favoriteRecipesDetails = []
    for (let i = 0; i < recipes_ids.length; i++) {
      const result = await recipe_utils.getRecipeDetails(recipes_ids[i]);
      favoriteRecipesDetails.push(result)
    }
    if (favoriteRecipesDetails.length === 0){
      throw { status: 204, message: `no favorites` };
    } 
    res.status(200).send(favoriteRecipesDetails);
  } catch(error){
    next(error); 
  }
});


/**
 * PUT - This path gets body with recipeId and save this recipe in the lastWatched list of the logged-in user
 * @param {String} recipeId - the id of the recipe to save as lastWatched
 * @returns {String} - message that the recipe successfully saved as lastWatched
 * @example http://localhost:3000/user/lastWatched
 */
router.put('/lastWatched', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.addToLastWatched(user_id, recipe_id);
    res.status(200).send("The Recipe successfully added to last watched");
  } catch (error) {
    next(error);
  }
});


/**
 * GET - This path returns the lastWatched recipes that were saved by the logged-in user
 * @returns {JSON} - the lastWatched recipes that were saved by the logged-in user
 * @example http://localhost:3000/user/lastWatched
 */
router.get('/lastWatched', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const lastWatched = await user_utils.getLastWatched(user_id);
    lastWatchedRecipesDetails = []
    for (let i = 0; i < lastWatched.length; i++) {
      const result = await recipe_utils.getRecipeDetails(lastWatched[i]);
      lastWatchedRecipesDetails.push(result)
    }
    if (lastWatchedRecipesDetails.length === 0){
      throw { status: 204, message: `no lastWatched` };
    } 
    res.status(200).send(lastWatchedRecipesDetails);
  } catch (error) {
    next(error);
  }
});


/**
 * PUT - This path gets body with recipeId and save this recipe in the myRecipes list of the logged-in user
 * @param {String} recipeId - the id of the recipe to save as myRecipes
 * @returns {String} - message that the recipe successfully saved as myRecipes
 * @example http://localhost:3000/user/myRecipes
 */
router.put('/myRecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.addToMyRecipes(user_id, recipe_id);
    res.status(200).send("The Recipe successfully added to my recipes");
  } catch (error) {
    next(error);
  }
});


/**
 * GET - This path returns the myRecipes recipes that were saved by the logged-in user
 * @returns {JSON} - the myRecipes recipes that were saved by the logged-in user
 * @example http://localhost:3000/user/myRecipes
 */
router.get('/myRecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const myRecipes = await user_utils.getMyRecipes(user_id);
    myRecipesDetails = []
    for (let i = 0; i < myRecipes.length; i++) {
      const result = await recipe_utils.getRecipeDetails(myRecipes[i]);
      myRecipesDetails.push(result)
    }
    if (myRecipesDetails.length === 0){
      throw { status: 204, message: `no myRecipes` };
    }
    res.status(200).send(myRecipesDetails);
  } catch (error) {
    next(error);
  }
});


/**
 * PUT - This path updates the search limit for the logged-in user
 * @param {String} searchLimit - the new search limit
 * @returns {String} - message that the search limit successfully updated
 * @throws {Error} - if the search limit is not valid
 * @example http://localhost:3000/user/searchLimit
 */
 router.put('/searchLimit', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const searchLimit = req.body.searchLimit;
    await user_utils.updateSerachLimit(user_id, searchLimit);
    res.status(200).send("Search limit successfully updated");
  } catch (error) {
    next(error);
  }
});


/**
 * GET - This path returns the search limit of the logged-in user
 * @returns {JSON} - the search limit of the logged-in user
 * @example http://localhost:3000/user/searchLimit
 */
 router.get('/searchLimit', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const searchLimit = await user_utils.getSearchLimit(user_id);
    res.status(200).json({ searchLimit });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
