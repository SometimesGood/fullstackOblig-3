const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const app = express();
const port = 3000;

require("./auth/auth");
const routes = require("./routes/routes");
const secureRoute = require("./routes/secure-routes");

app.use(express.json());

// ------------- NON AUTH ENDPOINTS -----------

/* Here is all the routes that does not need authentication. The routes are:
 - /signup = signing up a user account
 - /login = logging in with email and password information 
 - /forgotPassword = retriving password and updating it with a new one*/
app.use("/", routes);

// ------- AUTH ENDPOINTS --------------

/* simple check to see if authenticated 
Complete endpoint is /user/profile = show your own profile */
app.use(
  "/user",
  passport.authenticate("jwt-checkAuth", { session: false }),
  secureRoute
);

/* Here is all the routes that needs authentication.
Authentication is done inside the secureRoute. the routes are:
 - /user/profiles = read other user profiles while authorized as teacher or students
 - /user/profiles/delete = delete users while authorized as teacher 
 - /user/profiles/update = update or modify a single user while authorized as teacher*/
app.use("/user", secureRoute);

//---- The part below is 100% taken from the work we did in the last lecture (17.03) ----

//Database connection
mongoose.connect("mongodb://localhost:27017/users-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

// Handling errors.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

db.on("error", () => {
  "Error connecting to the database!!!!";
});
db.on("open", () => {
  console.log("We have connection to the database =)");
});
app.listen(port, () =>
  console.log(`Express server listening on port ${port}...`)
);
