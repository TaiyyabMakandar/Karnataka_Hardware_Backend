const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    images: [String], // array of image paths
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
