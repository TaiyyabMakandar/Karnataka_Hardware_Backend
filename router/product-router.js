const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/product-model");

const fs = require('fs');
// const path = require('path');
// const Product = require('../models/Product');

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// POST - Create new product
router.post("/", upload.array("images", 5), async (req, res) => {
    try {
        const { name, price } = req.body;
        const images = req.files.map(file => file.path);
        const product = new Product({ name, price, images });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - All products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Update product
// router.put("/:id", upload.array("images", 5), async (req, res) => {
//     try {
//         const { name, price } = req.body;
//         const images = req.files.map(file => file.path);
//         const updated = await Product.findByIdAndUpdate(req.params.id, { name, price, images }, { new: true });
//         res.json(updated);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

router.put("/:id", upload.array("images", 5), async (req, res) => {
    try {
        const { name, price } = req.body;

        // Check if images were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No images uploaded" });
        }

        // Map the uploaded images to their paths
        const images = req.files.map(file => file.path);

        // Update the product in the database
        const updated = await Product.findByIdAndUpdate(req.params.id, { name, price, images }, { new: true });

        if (!updated) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// // DELETE - Remove product
// router.delete("/:id", async (req, res) => {
//     try {
//         await Product.findByIdAndDelete(req.params.id);
//         res.json({ message: "Product deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Log images paths for debugging
        console.log("Images to delete:", product.images);

        // Delete images
        product.images.forEach((imgPath) => {
            // Normalize the path to use forward slashes
            const normalizedPath = imgPath.replace(/\\/g, '/');  // Replace backslashes with forward slashes

            // Ensure path starts with "uploads/"
            const cleanPath = normalizedPath.startsWith("uploads/")
                ? normalizedPath
                : path.join("uploads", normalizedPath);

            const fullPath = path.join(__dirname, '..', cleanPath);

            // Log the full path for debugging
            console.log("Deleting file at:", fullPath);

            // Check if the file exists before deleting
            fs.access(fullPath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error("File does not exist:", fullPath);
                    return;
                }

                // Delete the file if it exists
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error("Failed to delete image:", fullPath, err);
                    } else {
                        console.log("Image deleted:", fullPath);
                    }
                });
            });
        });

        // Delete product from DB
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product and images deleted successfully" });

    } catch (err) {
        console.error("Delete route error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
