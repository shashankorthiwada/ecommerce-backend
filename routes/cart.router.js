const express = require("express");
const router = express.Router();
const {
  getCart,
  findUserCart,
  getUserCart,
  updateUserCart,
  deleteItemFromCart,
} = require("../controllers/cart.controller");


router.route("/").get(getCart);

router.param("userId", findUserCart);

router
  .route("/:userId")
  .get(getUserCart)
  .post(updateUserCart)
  .delete(deleteItemFromCart);

module.exports = router;
