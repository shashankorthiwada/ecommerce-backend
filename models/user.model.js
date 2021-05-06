const mongoose = require("mongoose");
const { Schema } = mongoose;

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
    phonenumber: {
      type: Number,
      required: "phone number is required",
      unique: "A member with this phone number already exists",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
