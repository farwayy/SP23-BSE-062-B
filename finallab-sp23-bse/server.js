// server.js

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating unique Order IDs
const moment = require('moment'); // For formatting date and time
const path = require('path');

const server = express();
const PORT = 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:stylo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Order = mongoose.model('Order', orderSchema);

// Middleware
server.use(express.static(path.join(__dirname, 'public'))); // Serve static files
server.use(bodyParser.urlencoded({ extended: true })); // Parse form data
server.use(
    session({
        secret: 'hey i am farwa',
        resave: false,
        saveUninitialized: true,
    })
);

// Set EJS as the template engine
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

// Sample Products for Cart
const sampleProducts = [
    { id: 1, title: 'Product 1', price: 25, image: '/images/product1.jpg' },
    { id: 2, title: 'Product 2', price: 45, image: '/images/product2.jpg' },
];

// Home Route
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

// Cart Route
server.get('/cart', (req, res) => {
    if (!req.session.cart) {
        req.session.cart = []; // Initialize cart if not present
    }
    res.render('cart', { products: req.session.cart });
});

// Add to Cart Route (For Demonstration)
server.get('/add-to-cart/:id', (req, res) => {
    const product = sampleProducts.find((p) => p.id === parseInt(req.params.id));
    if (product) {
        if (!req.session.cart) {
            req.session.cart = [];
        }
        req.session.cart.push(product);
    }
    res.redirect('/cart');
});

// Checkout Route
server.post('/checkout', (req, res) => {
    const products = req.session.cart || [];
    if (products.length === 0) {
        return res.redirect('/cart'); // Redirect if cart is empty
    }
    res.render('checkout', {
        products,
        total: products.reduce((total, product) => total + product.price, 0),
    });
});

// Place Order Route
server.post('/place-order', async (req, res) => {
    const { name, street, city, postalCode } = req.body;
    if (!name || !street || !city || !postalCode) {
        return res.status(400).send('All fields are required.');
    }

    const order = new Order({
        orderId: uuidv4(),
        customer: { name, street, city, postalCode },
        items: req.session.cart,
        total: req.session.cart.reduce((total, product) => total + product.price, 0),
    });

    try {
        await order.save();
        req.session.cart = []; // Clear the cart
        res.render('order-success', { order });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error placing order.');
    }
});

// API Endpoint to Get All Orders
server.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving orders.');
    }
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
