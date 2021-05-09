const { User } = require("../models/user.model");
const { extend } = require("lodash");

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
  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    let user = await User.findOne({ username, password });
    console.log(user);
    if (user) {
      res.json({ success: true, user: { _id: user._id, name: user.username } });
    } else {
      res.status(401).json({
        success: false,
        user: null,
        message: "Username and password does not match",
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
    newUser = await newUser.save();
    const user = { _id: newUser._id, name: newUser.username };
    res.status(201).json({ success: true, user });
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
