const express = require("express");
const router = express.Router();
const {
  getWishLists,
  fetchUserWishList,
  getWishListByUserId,
  updateUserWishList,
} = require("../controllers/wishlist.controller");

router.route("/").get(getWishLists);

router.param("userId", fetchUserWishList);

router.route("/:userId").get(getWishListByUserId).post(updateUserWishList);

module.exports = router;
