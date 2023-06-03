var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
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
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
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
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_ids = await user_utils.getFavoriteRecipes(user_id);
    const results = await recipe_utils.getRecipeDetails(recipes_ids);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


/**
 * This path gets body with recipeId and save this recipe in the lastWatched list of the logged-in user
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
 * This path returns the lastWatched recipes that were saved by the logged-in user
 */
router.get('/lastWatched', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const lastWatched = await user_utils.getLastWatched(user_id);
    const results = await recipe_utils.getRecipeDetails(lastWatched);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the myRecipes list of the logged-in user
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
 * This path returns the myRecipes recipes that were saved by the logged-in user
 */
router.get('/myRecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const myRecipes = await user_utils.getMyRecipes(user_id);
    const results = await recipe_utils.getRecipeDetails(myRecipes);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});


/**
 * This path updates the search limit for the logged-in user
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
 * This path returns the search limit of the logged-in user
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
