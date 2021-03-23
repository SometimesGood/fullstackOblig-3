const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/model");

const router = express.Router();

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    console.log(req.user);
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

/* forgot password part 1/2. (Wanted to use the next() function)
 Check if email exist and if secret question is answered correctly.
 Also needs a newpassword to replace the old one as a query parameter.
 if all info is valid then go to part 2 */
router.patch("/forgotPassword", (req, res, next) => {
  // filter
  let emailToFind = req.query.email;

  let newPassword = req.query.newPassword;

  // secret question to answer. This is like a real world example of adding a secret question when you register
  let secretQuestion = req.query.secretQuestion;

  // if no email is present , then show a 400 error
  if (!emailToFind) {
    res.status(400).json("You need to enter a email");
  }
  // if no newpassword is present , then show a 400 error
  else if (!newPassword) {
    res.status(400).json("You need to enter a newPassword");
  } else {
    /* if everything needed is present, find the email of the user 
  that you are looking for*/
    UserModel.findOne({ email: emailToFind }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        /* if the secretquestion is answered with the users secretQuestion
      then run the next part of the endpoint */

        // if no user was found then send error msg
        if (result == null) {
          res
            .status(404)
            .json({ message: "User with that email was not found" });
        } else {
          /* if answering the secret question correctly then go to next part 
          of request*/
          if (secretQuestion == result.secretQuestion) {
            next();
          } else {
            res.status(401).json({
              message: "the secret answer is wrong",
            });
          }
        }
      }
    });
  }
});

/*forgot password part 2/2.
 change user password with the query parameter entered */
router.patch("/forgotPassword", async (req, res) => {
  console.log("inside update forgot password route");

  // emails are unique, find the user with email
  let emailToFind = req.query.email;

  // new password to replace the old one
  let newPassword = req.query.newPassword;

  await UserModel.findOneAndUpdate(
    { email: emailToFind },
    { password: newPassword }
  )
    .then((user) => {
      res.status(200).json({
        message: `Here is the user linked to that email. User ${user.name} with email : ${emailToFind} now has updated password to ${newPassword}`,
        user: user,
      });
    })
    .catch((error) => {
      res.status(500).json(error);
      console.log("here is the erros");
    });
});

// login - This is more or less the same as the code we did in the lecutre (17.03)
router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      /* if error occured or user parameter is not true then
      run next callback with the infomation from here */
      if (err || !user) {
        return next(info);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        // if no error create the body and token which will be used as response
        const body = { _id: user._id, email: user.email, role: user.role };
        const token = jwt.sign({ user: body }, "supersecret");

        return res.status(200).json({ body, token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;
