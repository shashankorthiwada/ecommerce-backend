const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: "name is required",
      unique: "name should be unique",
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    inStock: {
      type: Boolean,
    },
    fastDelivery: {
      type: Boolean,
    },
    ratings: {
      type: Number,
    },
    offer: {
      type: Array,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };
