const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: {
        name: String,
        street: String,
        city: String,
        postalCode: String,
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    total: Number,
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);
