const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const Order = require("../models/order.model");

// Display Cart Page
router.get("/cart", async (req, res) => {
    const cart = req.cookies.cart || [];
    const products = await Product.find({ _id: { $in: cart } });
    res.render("pages/cart", { products });
});

// Proceed to Checkout Page
router.get("/checkout", (req, res) => {
    res.render("pages/checkout");
});

// Handle Checkout Form Submission
router.post("/checkout", async (req, res) => {
    try {
        const { name, street, city, postalCode } = req.body;
        const cart = req.cookies.cart || [];

        // Validate Input
        if (!name || !street || !city || !postalCode) {
            return res.status(400).send("All fields are required.");
        }

        // Fetch Cart Items
        const cartItems = await Product.find({ _id: { $in: cart } });

        // Calculate Total
        const total = cartItems.reduce((sum, item) => sum + item.price, 0);

        // Create and Save New Order
        const newOrder = new Order({
            customer: { name, street, city, postalCode },
            items: cartItems,
            total,
            date: new Date(),
        });

        await newOrder.save();

        // Clear the Cart
        res.clearCookie("cart");

        // Redirect to Confirmation Page
        res.redirect("/order-confirmation");
    } catch (error) {
        console.error("Checkout error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Order Confirmation Page
router.get("/order-confirmation", (req, res) => {
    res.render("pages/order-confirmation", { message: "Your order has been placed successfully!" });
});
const { v4: uuidv4 } = require('uuid'); // For generating unique Order IDs
const moment = require('moment'); // For formatting date and time

// Mock Database
const orders = [];

router.post('/checkout', (req, res) => {
    const products = req.session.cart || []; // Assuming cart is stored in session
    if (products.length === 0) {
        return res.redirect('/cart'); // Redirect if cart is empty
    }
    res.render('checkout', { products, total: products.reduce((total, product) => total + product.price, 0) });
});

router.post('/place-order', (req, res) => {
    const { name, street, city, postalCode } = req.body;
    if (!name || !street || !city || !postalCode) {
        return res.status(400).send('All fields are required.');
    }

    const order = {
        id: uuidv4(),
        customer: { name, street, city, postalCode },
        items: req.session.cart,
        total: req.session.cart.reduce((total, product) => total + product.price, 0),
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    orders.push(order); // Store the order in your database
    req.session.cart = []; // Clear the cart
    res.render('order-success', { order });
});

module.exports = router;


