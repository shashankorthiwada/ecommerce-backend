const express = require("express");
const router = express.Router();
const { Cart } = require("../models/cart.model");
const { User } = require("../models/user.model");

router.route("/").get(async (req, res, next, userId) => {
  try {
    let user = await User.findOne({ _id: userId });
    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
      throw Error("user not found");
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
      cart = await cart.save();
    }
    req.cart = cart;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "error fetching cart items",
      errorMessage: err.message,
    });
  }
});
