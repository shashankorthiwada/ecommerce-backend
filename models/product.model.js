const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: "Name is Required",
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
  quantity: {
    type: Number,
  },
  description: {
    type: String,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };
