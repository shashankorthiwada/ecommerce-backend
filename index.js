require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());

const { initializeDbConnection } = require("./db/db.connect");

initializeDbConnection();

const productRouter = require("./routes/product.router");

app.use("/products", productRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Ecommerce backend");
});

app.listen(3000, () => {
  console.log("server started");
});
