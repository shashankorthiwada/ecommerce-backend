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

module.exports = router;
