require("dotenv").config();
const { User } = require("../models/user.model");
const { extend } = require("lodash");
const { hash, genSalt, compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const secret = process.env.secret;

const getUsers = async (req, res) => {
  try {
    let users = await User.find({});
    users = users.map((user) => {
      user.password = undefined;
      return user;
    });
    res.json({ success: true, data: users });
  } catch (err) {
    res.json({
      success: false,
      message: "error fetching user details",
      errorMessage: err.message,
    });
  }
};

const findUser = async (req, res) => {
  const { username, password } = req.body;
  let user = await User.findOne({ username });
  if (user) {
    const validPassword = await compare(password, user.password);
    if (validPassword) {
      const token = sign({ _id: user._id }, secret, { expiresIn: "24h" });
      res.json({
        success: true,
        user: { _id: user._id, name: user.username },
        token,
      });
    } else {
      res.status(401).json({
        success: false,
        user: null,
        message: "Invalid Password Please Try again",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      user: null,
      message: "Username does not exist",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const usernameExists = await User.exists({ username: userData.username });
    const emailExists = await User.exists({ email: userData.email });
    if (usernameExists) {
      res.status(409).json({ success: false, message: "Username is taken." });
      return usernameExists;
    }
    if (emailExists) {
      res
        .status(409)
        .json({ success: false, message: "Email is already registered." });
      return emailExists;
    }
    let newUser = new User(userData);
    // newUser = await newUser.save();
    const salt = await genSalt(10);
    newUser.password = await hash(newUser.password, salt);
    newUser = await newUser.save();
    const token = sign({ _id: newUser._id }, secret, { expiresIn: "24h" });
    const user = { _id: newUser._id, name: newUser.username };
    res.status(201).json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to add new user",
      errMessage: err.message,
    });
  }
};

const findUserById = async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw Error("Unable to fetch the user details");
    }
    req.user = user;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Unable to retrive the user details" });
  }
};

const getUserById = async (req, res) => {
  const { user } = req;
  user.password = undefined;
  res.json({ success: true, user });
};

const updateUser = async (req, res) => {
  let { user } = req;
  const userUpdates = req.body;
  user = extend(user, userUpdates);
  user = await user.save();
  user.password = undefined;
  res.json({ success: true, user });
};

module.exports = {
  getUsers,
  findUser,
  registerUser,
  findUserById,
  getUserById,
  updateUser,
};
