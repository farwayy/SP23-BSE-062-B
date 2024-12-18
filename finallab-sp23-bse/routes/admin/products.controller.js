const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
let router = express.Router();
let multer = require("multer");
let Admin = require("../../models/admin.model");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage: storage });
let Product = require("../../models/product.model");

// route to handle Delete of product
router.get("/admin/products/delete/:id", async (req, res) => {
  let params = req.params;
  let product = await Product.findByIdAndDelete(req.params.id);
  // let query = req.query;
  // return res.send({ query, params });
  // return res.send(product);
  return res.redirect("/admin/products");
});

//route to render edit product form
router.get("/admin/products/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  return res.render("admin/product-edit-form", {
    layout: "adminlayout",
    product,
  });
});
router.post("/admin/products/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  product.title = req.body.title;
  product.description = req.body.description;
  product.price = req.body.price;
  await product.save();
  return res.redirect("/admin/products");
});

// route to render create product form
router.get("/admin/products/create", (req, res) => {
  return res.render("admin/product-form", { layout: "adminlayout" });
});

//route to handle create product form submission
// demonstrates PRG Design Pattern (Post Redirect GET)
router.post(
  "/admin/products/create",
  upload.single("file"),
  async (req, res) => {
    // return res.send(req.file);
    let data = req.body;
    let newProduct = new Product(data);
    newProduct.title = data.title;
    if (req.file) {
      newProduct.picture = req.file.filename;
    }
    await newProduct.save();
    return res.redirect("/admin/products");
    // we will send data to model to save in db

    // return res.send(newProduct);
    // return res.render("admin/product-form", { layout: "adminlayout" });
  }
);
router.use(
  session({
    secret: "hi i am farwa", // Replace with a strong, unique secret
    resave: false,          // Do not save the session if it hasn't been modified
    saveUninitialized: true
  })
); 

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect("/admin/login");
}

// ROUTE: Admin Registration (only for setup, disable after registering)
router.get("/admin/register", (req, res) => {
  res.render("admin/register", { layout: false }); // Create a register.ejs
});

router.post("/admin/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  let existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    return res.send("Admin already exists. Please login.");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save new admin
  let newAdmin = new Admin({ username, password: hashedPassword });
  await newAdmin.save();

  res.redirect("/admin/login");
});

// ROUTE: Admin Login
router.get("/admin/login", (req, res) => {
  res.render("admin/login", { layout: false }); // Create a login.ejs
});

router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  let admin = await Admin.findOne({ username });
  if (!admin) {
    return res.send("Invalid username or password");
  }

  // Compare password
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.send("Invalid username or password");
  }

  // Save session
  req.session.isAdmin = true;

  res.redirect("/admin/products");
});

// ROUTE: Admin Logout
router.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

router.get("/admin/products/:page?", async (req, res) => {
  try {
    const page = req.params.page ? parseInt(req.params.page) : 1; // Current page
    const pageSize = 20; // Items per page
    const { search, sort } = req.query;

    // Filtering
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    const sortOptions = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      title_asc: { title: 1 },
      title_desc: { title: -1 },
    };
    const sortCriteria = sortOptions[sort] || {}; // Default to no sorting

    // Count total records for pagination
    const totalRecords = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Fetch filtered and sorted data with pagination
    const products = await Product.find(filter)
      .sort(sortCriteria)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    // Render the page with necessary data
    res.render("admin/products", {
      layout: "adminlayout",
      pageTitle: "Manage Your Products",
      products,
      page,
      totalPages,
      search: search || "",
      sort: sort || "",
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
