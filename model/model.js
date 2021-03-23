const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },
  place: {
    type: String,
    enum: ["on-campus", "home-office"],
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "busy"],
    required: true,
  },

  // used to retrieve password in forgot password
  secretQuestion: {
    type: String,
    required: true,
  },
});

// hash password after saving user to db
UserSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

// helpful link https://stackoverflow.com/questions/49113910/issue-with-mongoose-findbyidandupdate-and-pre-update-hook
//pre middleware used for forgot password to hash the newly updated password
UserSchema.pre("findOneAndUpdate", async function (next) {
  // if not updating password then just skip code
  if (!this._update.password) {
    next();
  }
  // if updating password as in forgot password then execute hashing
  else {
    // this is the new password
    this._update.password = await bcrypt.hash(this._update.password, 10);
    next();
  }
});

// compare hashed passwords
UserSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
