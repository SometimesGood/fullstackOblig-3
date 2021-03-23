const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../model/model");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

// signup authorization used in the endpoint /signup from routes.js
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        // destructuring req query parameters
        const {
          name,
          surname,
          role,
          place,
          status,
          secretQuestion,
        } = req.query;
        /* code is working but, should i maybe have used req.body? instead of query parameters? */
        const user = await UserModel.create({
          email,
          password,
          name,
          surname,
          role,
          place,
          status,
          secretQuestion,
        });
        // send the user back to callback
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// login authorization used in endpoint /login from routes.js
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        /* if user with the email you were looking for does not exist
        then return warning message */
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        /* using the method written in model.js to validate that
        password match even while hashed */
        const validate = await user.isValidPassword(password);

        // if passwords do not match, send warning message
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        // if both password and email is good, then return user
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

/* check if authorized by checking token. this is used in endpoint user/profile from index.js through the secrue-routes.js*/
passport.use(
  "jwt-checkAuth",
  new JWTstrategy(
    {
      secretOrKey: "supersecret",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        // return user
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// -------------- ROLE BASED AUTH ------------------------

/*See other profiles if authorized as either student or teacher 
used in endpoint user/profiles inside secure-routes.js*/
passport.use(
  "jwt-readOthersAuth",
  new JWTstrategy(
    {
      secretOrKey: "supersecret",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      console.log("From read others auth");
      try {
        // check user role, if teacher
        if (token.user.role === "teacher" || token.user.role === "student") {
          return done(null, token.user);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

/* Update or delete auth. Checks if role is teacher before giving permission to
delete or modify a user. This is used in endpoint user/profiles/delete */
passport.use(
  "jwt-updateAndDelete",
  new JWTstrategy(
    {
      secretOrKey: "supersecret",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        // check user role, if teacher
        if (token.user.role === "teacher") {
          return done(null, token.user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
