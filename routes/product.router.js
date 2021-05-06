const express = require("express");
const router = express.Router();
const { Product } = require("../models/product.model");

// router.use(bodyParser.json());

router
  .route("/")
  .get(async (req, res) => {
    try {
      const products = await Product.find({});
      res.json({ success: true, products: products });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "error fetching products",
        errorMessage: err.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const product = req.body;
      const newProduct = new Product(product);
      const savedProduct = await newProduct.save();
      res.status(200).json({ success: true, data: savedProduct });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error while saving products",
        errorMessage: err.message,
      });
    }
  });

router.param("productId", async (req, res, next, productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw Error("No Product Found");
    }
    req.product = product;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "Error Fetching Product" });
  }
});

router.route("/:productId").get(async (req, res) => {
  const { product } = req;
  product.__v = undefined;
  res.json({ success: true, product });
});

module.exports = router;
