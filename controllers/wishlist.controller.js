const { WishList } = require("../models/wishlist.model");
const { User } = require("../models/user.model");

const getWishLists = async (req, res) => {
  const wishlists = await WishList.find({});
  res.json({ success: true, data: wishlists });
};

const fetchUserWishList = async (req, res, next, userId) => {
  try {
    let user = await User.findOne({ _id: userId });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Invalid user! Kindly register to continue",
      });
      throw Error("Invalid User");
    }
    let wishlist = await WishList.findOne({ userId });

    if (!wishlist) {
      wishlist = new WishList({ userId, products: [] });
      wishlist = await wishlist.save();
    }
    req.wishlist = wishlist;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrive wishlist details",
      errorMessage: error.message,
    });
  }
};

const getWishlistItems = async (wishlist) => {
  wishlist.products = wishlist.products.filter((product) => product.active);
  wishlist = await wishlist.populate("products._id").execPopulate();
  return wishlist.products.map((product) => product._id);
};

const getWishListByUserId = async (req, res) => {
  try {
    let { wishlist } = req;
    let wishlistItems = await getWishlistItems(wishlist);
    res.status(200).json({ success: true, data: wishlistItems });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to retrive the wishlist",
      errMessage: err.message,
    });
  }
};

const updateUserWishList = async (req, res) => {
  const { _id } = req.body;
  const { wishlist } = req;
  let resStatus;
  const productExists = wishlist.products.some((product) => product._id == _id);
  if (productExists) {
    resStatus = 200;
    for (let product of wishlist.products) {
      if (product._id == _id) {
        product.active = !product.active;
        break;
      }
    }
  } else {
    resStatus = 201;
    wishlist.products.push({ _id, active: true });
  }

  let updatedWishlist = await wishlist.save();
  let wishlistItems = await getWishlistItems(updatedWishlist);
  res.status(resStatus).json({ success: true, data: wishlistItems });
};

module.exports = {
  getWishLists,
  fetchUserWishList,
  getWishListByUserId,
  updateUserWishList,
};
