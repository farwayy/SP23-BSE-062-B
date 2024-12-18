const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");

// API to retrieve all orders for admin panel
router.get("/admin/orders", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("items") // Populate product details
            .sort({ date: -1 }); // Sort by date (latest first)
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Internal Server Error");
    }
});

// API to create a new order (for checkout)
router.post("/orders", async (req, res) => {
    try {
        const { customer, items, total } = req.body;

        // Validate input
        if (!customer || !items || total == null) {
            return res.status(400).send("Invalid order data.");
        }

        // Save order to database
        const newOrder = new Order({
            customer,
            items,
            total,
        });
        await newOrder.save();

        res.status(201).send("Order created successfully.");
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
