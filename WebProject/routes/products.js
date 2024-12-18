let express = require("express");
let router = express.Router();
let Product = require("../models/product.model");

// Route to display products by category
router.get("/category/:name", async (req, res) => {
  let categoryName = req.params.name; // Extract category name from URL
  try {
    // Fetch products where the category matches the URL parameter
    let products = await Product.find({ category: categoryName })
      .skip(skip)
      .limit(limit);

    // Render the category page with products and category name
    return res.render("pages/category", {
      products,
      categoryName
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/product/:title", async (req, res) => {
  try {
    // Extract product title from the URL params and decode it
    const productTitle = decodeURIComponent(req.params.title);

    // Fetch the product from the database using the title (case-insensitive)
    const product = await Product.findOne({ title: { $regex: new RegExp("^" + productTitle + "$", "i") } });

    // If the product does not exist, return a 404 error
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Render the product details page and pass the product data
    return res.render("pages/details", { product });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error: Unable to load product details");
  }
});

// Add to Cart Route
router.get("/cart", async (req, res) => {
  let cart = req.cookies.cart || [];
  let products = await Product.find({ _id: { $in: cart } });

  return res.render("cart", { products });
});


module.exports = router;


