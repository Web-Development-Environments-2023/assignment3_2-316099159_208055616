[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=11263623&assignment_repo_type=AssignmentRepo)

Omer Hanan 316099159 \
Amit Chen 208055616

# Recipe API

This repository contains an Express.js application that provides a Recipe API. The API allows users to search for recipes, retrieve recipe details, get random recipes, and add new recipes.

## Installation

To run the Recipe API locally, follow these steps:

1. Clone the repository:

   ```
   git clone <repository_url>
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Start the server:

   ```
   node main.js
   ```

   The API will be accessible at `http://localhost:3000`.

## DB creation
```
CREATE TABLE recepieApp.recipes
 (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255),
  image VARCHAR(255),   
  readyInMinutes INT,
  popularity INT,
  vegetarian BOOLEAN,
  vegan BOOLEAN,
  glutenFree BOOLEAN
);

CREATE TABLE recepieApp.users (
  userName VARCHAR(255) PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  country VARCHAR(255),
  password VARCHAR(255),
  email VARCHAR(255),
  searchLimit INT,
  recepiesData JSON
);
```

## API Endpoints

### Search Recipes

```
GET /recipes/search
```

This endpoint allows you to search for recipes based on various criteria, such as query, limit, cuisines, diets, and intolerances.

#### Request

- Headers:
  - `text`: The search query (required)
  - `cuisines`: Comma-separated list of cuisines (optional)
  - `diets`: Comma-separated list of diets (optional)
  - `intolerances`: Comma-separated list of intolerances (optional)

#### Response

- Status: 200 OK
- Body: JSON array containing the search results (recipes)

### Get Random Recipes

```
GET /recipes/random
```

This endpoint retrieves three random recipes.

#### Response

- Status: 200 OK
- Body: JSON array containing three random recipes

### Get Recipe Details

```
GET /recipes/:recipeId/information
```

This endpoint retrieves the details of a specific recipe.

#### Parameters

- `recipeId`: The ID of the recipe to retrieve (required)

#### Response

- Status: 200 OK
- Body: JSON object containing the recipe details

### Add New Recipe

```
POST /recipes/
```

This endpoint allows you to add a new recipe.

# User API

This repository contains an Express.js application that provides a User API. The API allows users to manage their favorite recipes, last watched recipes, and personal recipes. It also provides endpoints to update the search limit for the user.

## Installation

To run the User API locally, follow these steps:

1. Clone the repository:

   ```
   git clone <repository_url>
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Start the server:

   ```
   npm start
   ```

   The API will be accessible at `http://localhost:3000`.

## API Endpoints

### Authentication Middleware

The User API uses authentication middleware to authenticate all incoming requests. If a request is not authenticated, it will be rejected with a 401 Unauthorized status code.

### Save Recipe as Favorite

```
PUT /user/favorites
```

This endpoint allows the logged-in user to save a recipe as a favorite.

#### Request

- Body:
  - `recipeId`: The ID of the recipe to save as a favorite (required)

#### Response

- Status: 200 OK
- Body: "The Recipe successfully saved as favorite"

### Get Favorite Recipes

```
GET /user/favorites
```

This endpoint retrieves the favorite recipes saved by the logged-in user.

#### Response

- Status: 200 OK
- Body: JSON array containing the favorite recipes

### Save Recipe as Last Watched

```
PUT /user/lastWatched
```

This endpoint allows the logged-in user to save a recipe as last watched.

#### Request

- Body:
  - `recipeId`: The ID of the recipe to save as last watched (required)

#### Response

- Status: 200 OK
- Body: "The Recipe successfully added to last watched"

### Get Last Watched Recipes

```
GET /user/lastWatched
```

This endpoint retrieves the last watched recipes saved by the logged-in user.

#### Response

- Status: 200 OK
- Body: JSON array containing the last watched recipes

### Save Recipe as My Recipes

```
PUT /user/myRecipes
```

This endpoint allows the logged-in user to save a recipe as their own recipe.

#### Request

- Body:
  - `recipeId`: The ID of the recipe to save as my recipe (required)

#### Response

- Status: 200 OK
- Body: "The Recipe successfully added to my recipes"

### Get My Recipes

```
GET /user/myRecipes
```

This endpoint retrieves the recipes saved by the logged-in user as their own recipes.

#### Response

- Status: 200 OK
- Body: JSON array containing the user's recipes

### Update Search Limit

```
PUT /user/searchLimit
```

This endpoint allows the logged-in user to update their search limit.

#### Request

- Body:
  - `searchLimit`: The new search limit (required)

#### Response

- Status: 200 OK
- Body: "Search limit successfully updated"

### Get Search Limit

```
GET /user/searchLimit
```

This endpoint retrieves the search limit of the logged-in user.

#### Request

- Body: JSON object representing the recipe (required)

#### Response

- Status: 201 Created
- Body: JSON object representing the added recipe

## Error Handling

If any errors occur during the API requests, appropriate error responses are returned along with corresponding status codes. The possible error responses include:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error

Please make sure to handle these responses accordingly in your application.

## Contributing

Contributions to the Recipe API are welcome! If you find any issues or would like to suggest improvements, please open an issue or submit a pull request.

Happy cooking!