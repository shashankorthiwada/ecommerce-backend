const express = require("express");
const router = express.Router();
const {
  getProducts,
  saveProducts,
  findProduct,
  getProductById,
} = require("../controllers/product.controller");

router.route("/").get(getProducts).post(saveProducts);

router.param("productId", findProduct);

router.route("/:productId").get(getProductById);

module.exports = router;
