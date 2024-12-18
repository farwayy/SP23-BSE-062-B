const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');

var expressLayouts = require("express-ejs-layouts");
const server = express();
server.use(session({ secret: "hi i am farwa" }));
const productsRoute = require('./routes/products');
const path = require('path');
server.use(express.static(path.join(__dirname, "public")));

// setup ejs as view engine
server.set("view engine", "ejs");
// add middleware for layouts
server.use(expressLayouts);

//expose public folder for publically accessible static files
server.use(express.static("public"));
server.use(express.static("uploads"));
// add support for fetching data from request body
server.use(express.urlencoded());

// make as manu routers (mini express applications) as you want and add them to express
let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

server.use(productsRoute);


server.get("/", async (req, res) => {
  let Product = require("./models/product.model");
  let products = await Product.find();
  return res.render("pages/homepage");
});
server.get("/category/:name", async (req, res) => {
  let Product = require("./models/product.model");
  let categoryName = req.params.name;
  try {
    let products = await Product.find({ category: categoryName });
    return res.render("pages/category", { products, categoryName });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

server.get("/cart", async (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  let products = await Product.find({ _id: { $in: cart } });
  return res.render("cart", { products });
});
server.get("/add-to-cart/:id", (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  return res.redirect("/");
});

// Route to display the cart
server.get("/cart", (req, res) => {
  const cart = req.session.cart || [];
  res.render("cart", { cart });
});

// Route to update product quantity in the cart
server.post("/update-cart/:title", (req, res) => {
  const productTitle = req.params.title;
  const newQuantity = parseInt(req.body.quantity);

  if (req.session.cart) {
      const product = req.session.cart.find(item => item.title === productTitle);

      if (product && newQuantity > 0) {
          product.quantity = newQuantity;
      }
  }

  res.redirect("/cart");
});

// Route to remove a product from the cart
server.post("/remove-from-cart/:title", (req, res) => {
  const productTitle = req.params.title;

  if (req.session.cart) {
      req.session.cart = req.session.cart.filter(item => item.title !== productTitle);
  }

  res.redirect("/cart");
});


let connectionString = "mongodb://localhost/stylo";
mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));
// fire up the server software at port
server.listen(9870, () => {
  console.log(`Server Started at localhost:9870`);
});
