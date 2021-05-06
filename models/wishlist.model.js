const mongoose = require("mongoose");
const { Schema } = mongoose;

const WishListSchema = new Schema({
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
    },
  ],
});

const WishList = mongoose.model("WishList", WishListSchema);

module.exports = { WishList };
