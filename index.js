require("dotenv").config();
const port = process.env.PORT || 3000;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());

const { initializeDbConnection } = require("./db/db.connect");

initializeDbConnection();

const productRouter = require("./routes/product.router");
const cartRouter = require("./routes/cart.router");
const userRouter = require("./routes/user.router");
const wishlistRouter = require("./routes/wishlist.router");
const { errorHandler } = require("./middlewares/error-handler.middleware");
const {
  routeNotFound,
} = require("./middlewares/routenotfound-handler.middleware");

app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/users", userRouter);
app.use("/wishlist", wishlistRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Ecommerce backend");
});

app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("server started", port);
});
