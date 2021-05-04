const express = require("express");
const router = express.Router();
const { User } = require("../models/user.model");
const { extend } = require("lodash");

router.route("/").get(async (req, res) => {
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
});

router.route("/login").post(async (req, res) => {
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
        message: "Username and password does not match",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Username does not exsist",
    });
  }
});

router.route("/signup").post(async (req, res) => {
  try {
    const userData = req.body;
    const usernameExsists = await User.exists({ username: userData.username });
    const emailExsists = await User.exists({ email: userData.email });
    if (usernameExsists) {
      res.status(409).json({ success: false, message: "Username is taken." });
      return usernameExsists;
    }
    if (emailExsists) {
      res
        .status(409)
        .json({ success: false, message: "Email is already registered." });
      return emailExsists;
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
});

router.param("userId", async (req, res, next, userId) => {
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
});

router
  .route("/:userId")
  .get(async (req, res) => {
    const { user } = req;
    user.password = undefined;
    res.json({ success: true, user });
  })
  .post(async (req, res) => {
    let { user } = req;
    const userUpdates = req.body;
    user = extend(user, userUpdates);
    user = await user.save();
    user.password = undefined;
    res.json({ success: true, user });
  });

module.exports = router;
