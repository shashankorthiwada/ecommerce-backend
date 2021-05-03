const mongoose = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: "username is required",
      unique: "There is already a user with this user name",
    },
    password: {
      type: String,
      required: "password is required",
    },
    email: {
      type: String,
      required: "email is required",
      unique: "There is already a user with this mail",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
