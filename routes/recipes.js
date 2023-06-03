var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");

/**
 * GET request to get x recipes by user's limit
 * @returns {JSON} - x recipes
 * @example http://localhost:3000/recipes/search
 */
router.get("/search", async (req, res, next) => {
  try {
    const params = {
      query: req.header('text').trim(),
      limit: user_utils.getSearchLimit(req.session.username),
      cuisines: req.header('cuisines') != undefined ? req.header('cuisines').split(',') : [],
      diets: req.header('diets') != undefined ? req.header('diets').split(',') : [],
      intolerances: req.header('intolerances') != undefined ? req.header('intolerances').split(',') : [], 
    }
    const user_id = req.session.username;
    if (recipes_utils.searchParamsValidation(params))
    {
      const recipes = await recipes_utils.searchByLimit(params, user_id);
      res.status(200).send(recipes);
    }
    else
    {
      res.status(400).send("Bad request");
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET 3 random recipes
 * @returns {JSON} - 3 random recipes
 * @example http://localhost:3000/recipes/random
 */
router.get("/random", async (req, res, next) => {
  try {
    const random_recipes = await recipes_utils.getRandomRecipes();
    res.status(200).send(random_recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * GET request to get recipe details
 * @param {int} recipeId - the id of the recipe
 * @returns {JSON} - the recipe details
 * @example http://localhost:3000/recipes/123/information
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.status(200).send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * POST request to create a new recipe
 * @param {JSON} recipe - the recipe to add
 * @returns {JSON} - the recipe that was added
 * @example http://localhost:3000/recipes/
 */
router.post("/", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.addNewRecipe(req.body);
    res.status(201).send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
