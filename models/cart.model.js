const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: Number,
  active: Boolean
});

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  products: [CartItemSchema],
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = { Cart };
