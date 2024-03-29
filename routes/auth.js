var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    let user_details = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email,
    }

    let users = [];
    users = await DButils.execQuery("SELECT username from users");

    // validate username exists
    if (users.find((x) => x.username === user_details.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );

    // create default consts to add to new user
    const searchLimit = 5
    const recipesData = {'lastWatched':[], 'favorites':[], 'myRecipes':[]}

    await DButils.execQuery(
      `INSERT INTO users VALUES 
      ('${user_details.username}', 
      '${user_details.firstname}', 
      '${user_details.lastname}',
      '${user_details.country}', 
      '${hash_password}', 
      '${user_details.email}', 
      '${searchLimit}', 
      '${JSON.stringify(recipesData)}')`
    );
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    // check if already logged in
    if (req.body.username === req.session.user_id)
      throw { status: 403, message: `Username "${req.body.username}" already connected` };

    // check that username exists
    const users = await DButils.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.userName;

    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", async (req, res, next) => {
  try {
    if (req.session.user_id === undefined)
      throw { status: 403, message: "cannot logout with no connected session" };
    req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
    res.send({ success: true, message: "logout succeeded" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;