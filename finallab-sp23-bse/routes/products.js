let express = require("express");
let router = express.Router();
let Product = require("../models/product.model");

// Route to display products by category
router.get("/category/:name", async (req, res) => {
  let categoryName = req.params.name; // Extract category name from URL
  try {
    // Fetch products where the category matches the URL parameter
    let products = await Product.find({ category: categoryName });

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
router.post("/add-to-cart/:id", (req, res) => {
  const productId = req.params.id;
  let cart = req.cookies.cart || []; // Cart ko get ya initialize karein

  // Check if product is already in cart
  if (!cart.includes(productId)) {
    cart.push(productId);
  }
  // Cart ko cookies mein save karein
  res.cookie("cart", cart, { httpOnly: true });
  res.redirect("/cart"); // Cart page par redirect karein
});
router.get("/cart", async (req, res) => {
  let cart = req.cookies.cart || []; // Cart IDs ko cookies se fetch karein
  try {
    // Fetch products from database based on cart IDs
    const products = await Product.find({ _id: { $in: cart } });
    res.render("pages/cart", { products }); // Render cart page
  } catch (err) {
    console.error("Error loading cart:", err);
    res.status(500).send("Server Error");
  }
}); 

module.exports = router;


