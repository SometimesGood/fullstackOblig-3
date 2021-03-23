const express = require("express");
const passport = require("passport");
const UserModel = require("../model/model");
const router = express.Router();

// check if authorized, response is your own user
router.get("/profile", (req, res) => {
  res.status(200).json({
    message: "You are now in the secret place",
    user: req.user,
    token: req.query.secret_token,
  });
});

// read single or all other profiles while autorized, response is other user(s)
router.get(
  "/profiles",
  passport.authenticate("jwt-readOthersAuth", { session: false }),
  (req, res) => {
    let nameToFind = req.query.name;

    // if query parameter is present, find by name
    if (nameToFind) {
      UserModel.find({ name: nameToFind })
        .select("email name surname role place status")
        .then((user) => {
          // if no user is found show error msg
          if (user.length == 0) {
            res.status(404).json({
              message: "No users found",
              token: req.query.secret_token,
            });
          }
          // if user is found then show it and a confirmation msg
          else {
            res.status(200).json({
              message: "Here is the user you were looking for",
              user: user,
              token: req.query.secret_token,
            });
          }
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
    // if no query parameter then find all users in db
    else {
      UserModel.find({})
        .select("email name surname role place status")

        .then((users) => {
          res.status(200).json(users);
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
  }
);

// delete a single user while if authorized as teacher , response is the deleted user
router.delete(
  "/profiles/delete",
  passport.authenticate("jwt-updateAndDelete", { session: false }),
  (req, res) => {
    // emails are unique
    let emailToFind = req.query.email;

    // if no email is present , then show a 400 error
    if (!emailToFind) {
      res.status(404).json("You need to enter a email");
    }
    // else find the user with that email and delete it
    else {
      UserModel.findOneAndDelete({ email: emailToFind })
        .then((user) => {
          res.status(200).json({
            message: `user ${user.name} with email : ${emailToFind} is now deleted`,
            user: user,
            token: req.query.secret_token,
          });
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
  }
);

// modify a users data, response is the user with the previous data
router.patch(
  "/profiles/update",
  passport.authenticate("jwt-updateAndDelete", { session: false }),
  (req, res) => {
    // emails are unique, find the user with email
    let emailToFind = req.query.email;

    // destructuring the body and putting it into a object variable
    let bodyparams = ({ name, surname, role, place, status } = req.body);

    // awesome oneliner found at https://stackoverflow.com/questions/53551390/mongodb-query-update-specific-field-if-value-is-not-null
    // this removes the properties that has undefined or null as a value from the body bodyparams
    for (let prop in bodyparams) if (!bodyparams[prop]) delete bodyparams[prop];

    // if no email is present , then show a 400 error
    if (!emailToFind) {
      res.status(400).json("You need to enter a email");
    }
    // else find the user with that email and delete it
    else {
      UserModel.findOneAndUpdate({ email: emailToFind }, bodyparams)
        .then((user) => {
          // if user found show user that got updated and confirmation msg
          res.status(200).json({
            message: `user ${user.name} with email : ${emailToFind} is now updated`,
            user: user,
            token: req.query.secret_token,
          });
        })
        .catch((error) => {
          res.status(500).json({ message: "no user with that email" });
        });
    }
  }
);

module.exports = router;
