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
  try {
    const productExists = wishlist.products.some(
      (product) => product._id == _id
    );
    if (productExists) {
      res.status(409).json({
        success: false,
        data: null,
        message: "Item is already there in the wishlist",
      });
      throw Error("Item is already there in the wishlist");
    } else {
      wishlist.products.push({ _id, active: true });
      let updatedWishlist = await wishlist.save();
      let wishlistItems = await getWishlistItems(updatedWishlist);
      res.status(200).json({ success: true, data: wishlistItems });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errorMessage: error.message });
  }
};

const deleteItemFromWishList = async (req, res) => {
  try {
    const { wishlist } = req;
    const { _id } = req.body;
    if (wishlist) {
      await wishlist.products.id(_id).remove();
      await wishlist.save();
      res
        .status(200)
        .json({ success: true, message: "Product removed from wishlist" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.meesage });
  }
};

module.exports = {
  getWishLists,
  fetchUserWishList,
  getWishListByUserId,
  updateUserWishList,
  deleteItemFromWishList
};
