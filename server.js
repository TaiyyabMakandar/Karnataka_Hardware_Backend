// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const connectDb = require("./utils/db");

// // Routes
// const authRoutes = require("./router/auth-router");
// const contactRoute = require("./router/contact-router");
// const adminRoute = require("./router/admin-routes");
// const productRoute = require("./router/product-router");

// const app = express();

// const allowedOrigins = [
//     "http://localhost:5173",
//     "http://localhost:5174"
// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
//     credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(express.json());
// app.use("/uploads", express.static("uploads")); // static folder to serve images

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/form", contactRoute);
// app.use("/api/admin", adminRoute);
// app.use("/api/products", productRoute); // ✅ new route for product CRUD

// const PORT = process.env.PORT || 5000;
// connectDb().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server is running at port: ${PORT}`);
//     });
// });


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDb = require("../utils/db"); // move one level up because inside /api

// Routes
const authRoutes = require("../router/auth-router");
const contactRoute = require("../router/contact-router");
const adminRoute = require("../router/admin-routes");
const productRoute = require("../router/product-router");

const app = express();

// CORS Setup
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174"
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads")); // static folder to serve images

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/form", contactRoute);
app.use("/api/admin", adminRoute);
app.use("/api/products", productRoute);

// ✅ Connect DB before exporting
connectDb().then(() => {
    console.log("DB connected successfully");
}).catch((err) => {
    console.error("DB connection failed:", err);
});

// ✅ Export the app for Vercel Serverless
module.exports = app;
