const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishListSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: "no wishlist found for this user",
  },
  products: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      active: Boolean,
    },
  ],
});

const WishList = mongoose.model("WishList", wishListSchema);

module.exports = { WishList };
