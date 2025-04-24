const express = require("express");
const router = express.Router();
const authController = require("../controller/auth-controller");
const signupSchema = require("../validators/auth-validator");
const loginSchema = require("../validators/auth-validator");
const authMiddleware = require("../middlewares/auth-middleware");


router.route("/").get(authController.home);
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/user").get(authMiddleware, authController.user);

module.exports = router;