var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");
const validator = require("./utils/validator");

/**
 * GET request to get x recipes by user's limit
 * @returns {JSON} - x recipes
 * @example http://localhost:3000/recipes/search
 */
router.get("/search", async (req, res, next) => {
  try {
    if (!validator.argumentsValidation(req, res, next)){
      throw { status: 400, message: "Bad request" };
    }
    const params = {
      query: req.header('text'), //.trim(),
      limit: await user_utils.getSearchLimit(req.session.user_id), //| 5,
      cuisines: req.header('cuisines') != undefined ? req.header('cuisines').split(',') : [],
      diets: req.header('diets') != undefined ? req.header('diets').split(',') : [],
      intolerances: req.header('intolerances') != undefined ? req.header('intolerances').split(',') : [], 
    };
    console.log("The params are: \n" + params);
    if (!validator.validateParamsForSearch(params)){
      throw { status: 400, message: "Bad request" };
    }
    const recipes = await recipes_utils.searchByLimit(params);
    if (recipes.length == 0){
      throw { status: 204, message: "No content" };
    }
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * GET - 3 random recipes
 * @returns {JSON} - 3 random recipes
 * @example http://localhost:3000/recipes/random
 */
router.get("/random", async (req, res, next) => {
  if (!validator.argumentsValidation(req, res, next)){
    throw { status: 400, message: "Bad request" };
  }
  try {
    const random_recipes = await recipes_utils.getRandomRecipes();
    if (random_recipes.length == 0)
    {
      throw { status: 500, message: "Problem occured" };
    }
    res.status(200).send(random_recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * GET - get recipe details
 * @param {int} recipeId - the id of the recipe
 * @returns {JSON} - the recipe details
 * @example http://localhost:3000/recipes/123/information
 */
router.get("/:recipeId", async (req, res, next) => {
  if (!validator.argumentsValidation(req, res, next)){
    throw { status: 400, message: "Bad request" };
  }
  try{
    const recipe_id = parseInt(req.params.recipeId);
    if (isNaN(recipe_id))
    {
      throw { status: 400, message: "recipeId must be int" };
    }
  } catch (error) {
    next(error);
  }
  try {
    let recipe;
    if (validator.validateIfRecipeIdIsDBType(req.params.recipeId)){
      recipe = await recipes_utils.getRecipeInformationFromDB(req.params.recipeId)
    }
    else{
      const recipeId = parseInt(req.params.recipeId)
      if (validator.validateRecipeIdIsApiType(recipeId)){
        recipe = await recipes_utils.getRecipeInformationFromApi(recipeId)
      }
    }
    if (!recipe){
      throw { status: 404, message: "Not found" };
    }
    res.status(200).send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * POST - create a new recipe
 * @param {JSON} recipe - the recipe to add
 * @returns {JSON} - the recipe that was added
 * @example http://localhost:3000/recipes/
 */
router.post("/", async (req, res, next) => {
  if (!validator.argumentsValidation(req, res, next))
  {
    throw { status: 400, message: "Bad request" };
  }
  try {
    const recipe = await recipes_utils.addNewRecipe(req);
    res.status(201).send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
