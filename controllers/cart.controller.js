const { Cart } = require("../models/cart.model");
const { User } = require("../models/user.model");
const { verify } = require("jsonwebtoken");

const secret = process.env.secret;

const getCart = async (req, res) => {
  try {
    const carts = await Cart.find({});
    res.status(200).json({ success: true, data: carts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, data: null, errorMessage: error.message });
  }
};

const getCartItems = async (cart) => {
  cart.products = cart.products.filter((product) => product.active);
  cart = await cart
    .populate({
      path: "products._id",
      select: "name image price inStock fastDelivery ratings offer",
    })
    .execPopulate();
  return cart.products.map((product) => {
    let cartItem = JSON.parse(JSON.stringify(product._id));
    Object.assign(cartItem, { quantity: product.quantity });
    return cartItem;
  });
};

const verifyUser = (req, userId) => {
  const token = req?.headers?.authorization;
  try {
    if (token) {
      const decodedValue = verify(token, secret);
      if (userId === decodedValue._id) {
        return true;
      }
    }
  } catch (error) {
    console.log("Error verifying JWT token");
  }
  return false;
};

const findUserCart = async (req, res, next, userId) => {
  try {
    if (verifyUser(req, userId)) {
      let user = await User.findOne({ _id: userId });
      if (!user) {
        res
          .status(404)
          .json({ success: false, data: null, message: "user not found" });
        throw Error("user not found");
      }
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, products: [] });
        cart = await cart.save();
      }
      req.cart = cart;
      next();
    } else {
      res.status(401).json({
        success: false,
        data: null,
        message: "UnAuthorized user or user token expired..",
      });
      throw Error("UnAuthorized user or user token expired..");
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "error fetching cart details of the user",
      errorMessage: err.message,
    });
  }
};

const getUserCart = async (req, res) => {
  try {
    let { cart } = req;
    let cartItems = await getCartItems(cart);
    res.status(200).json({ success: true, data: cartItems });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "error fetching user cart",
      errorMessage: err.message,
    });
  }
};

const updateUserCart = async (req, res) => {
  try {
    const { _id, action } = req.body;
    const { cart } = req;
    let resStatus;
    const productExists = cart.products.some((product) => product._id == _id);
    if (productExists) {
      resStatus = 200;
      for (let product of cart.products) {
        if (product._id == _id) {
          switch (action.toUpperCase()) {
            case "ADD":
              product.quantity = product.quantity + 1;
              break;
            case "REMOVE":
              product.quantity = product.quantity - 1;
              break;
          }
          product.quantity > 0
            ? (product.active = true)
            : (product.active = false);
          break;
        }
      }
    } else {
      resStatus = 201;
      cart.products.push({ _id, quantity: 1, active: true });
    }

    let updatedCart = await cart.save();
    updatedCart = await getCartItems(updatedCart);
    res.status(resStatus).json({ success: true, data: updatedCart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, data: null, errorMessage: error.message });
  }
};

const deleteItemFromCart = async (req, res) => {
  try {
    const { cart } = req;
    const { _id } = req.body;
    if (cart) {
      await cart.products.id(_id).remove();
      await cart.save();
      res
        .status(200)
        .json({ success: true, message: "Product removed successfully" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, data: null, errorMessage: error.message });
  }
};

module.exports = {
  getCart,
  findUserCart,
  getUserCart,
  updateUserCart,
  deleteItemFromCart,
};
