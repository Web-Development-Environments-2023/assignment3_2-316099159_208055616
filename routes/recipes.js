var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");

/**
 * GET request to get x recipes by user's limit
 * @returns {JSON} - x recipes
 * @example http://localhost:3000/recipes/3
 */
router.get("/:limit", async (req, res, next) => {
  try {
    const limit = user_utils.getUserLimit(req.session.username);
    const recipes = await recipes_utils.getRecipesByLimit(limit);
    res.status(200).send(recipes);
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
