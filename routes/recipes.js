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
  if (req.session.username == undefined)
  {
    res.status(401).send("Unauthorized");
  }
  if (req.body == undefined)
  {
    res.status(400).send("Bad request");
  }
  try {
    const params = {
      query: req.header('text').trim(),
      limit: user_utils.getSearchLimit(req.session.username) | 5,
      cuisines: req.header('cuisines') != undefined ? req.header('cuisines').split(',') : [],
      diets: req.header('diets') != undefined ? req.header('diets').split(',') : [],
      intolerances: req.header('intolerances') != undefined ? req.header('intolerances').split(',') : [], 
    };
    if (        
      params.query != undefined && 
      params.query.length > 0 &&
      [5, 10, 15].includes(params.limit) &&
      params.cuisines.every(cuisine => recipes_utils.constSearchValidationOptions.cuisine.includes(cuisine)) &&
      params.diets.every(diet => recipes_utils.constSearchValidationOptions.diet.includes(diet)) &&
      params.intolerances.every(intolerance => recipes_utils.constSearchValidationOptions.intolerance.includes(intolerance)))
    {
      const recipes = await recipes_utils.searchByLimit(params);
      if (recipes.length == 0)
      {
        res.status(204).send("No content");
      }
      res.status(200).send(recipes);
    }
    else
    {
      res.status(405).send("Forbidden");
    }
  } catch (error) {
    res.status(500).send("Internal server error, please make sure you are logged in");
    next(error);
  }
});

/**
 * GET - 3 random recipes
 * @returns {JSON} - 3 random recipes
 * @example http://localhost:3000/recipes/random
 */
router.get("/random", async (req, res, next) => {
  if (req.session.username == undefined)
  {
    res.status(401).send("Unauthorized");
  }
  if (req.body == undefined)
  {
    res.status(400).send("Bad request");
  }
  try {
    const random_recipes = await recipes_utils.getRandomRecipes();
    if (random_recipes.length == 0)
    {
      res.status(404).send("Not found");
    }
    res.status(200).send(random_recipes);
  } catch (error) {
    res.status(500).send("Internal server error, please make sure you are logged in");
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
  if (req.params.recipeId == undefined)
  {
    res.status(400).send("Bad request");
  }
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    if (recipe.length == 0)
    {
      res.status(404).send("Not found");
    }
    res.status(200).send(recipe);
  } catch (error) {
    res.status(500).send("Internal server error, please make sure you are logged in");
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
  try {
    if (req.body == undefined)
    {
      res.status(400).send("Bad request");
    }
    const recipe = await recipes_utils.addNewRecipe(req.body);
    if (recipe.length == 0)
    {
      res.status(403).send("Forbidden");
    }
    res.status(201).send(recipe);
  } catch (error) {
    res.status(405).send("Method not allowed");
    next(error);
  }
});

module.exports = router;
