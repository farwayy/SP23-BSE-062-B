const mongoose = require("mongoose");

let productSchema = mongoose.Schema({
  title: String,
  category: String,
  description: String,
  picture: String,
  price: Number,
  color: String
});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;