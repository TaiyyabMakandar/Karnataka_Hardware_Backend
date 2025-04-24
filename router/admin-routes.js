const express = require("express");
const adminController = require("../controller/admin-controller");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");


router.route("/users").get(adminController.getAllUsers);

router.route("/users/:id").get(authMiddleware, adminMiddleware, adminController.getUserById);

router.route("/users/update/:id").patch(authMiddleware, adminMiddleware, adminController.updateUserById);

router.route("/users/delete/:id").delete(authMiddleware, adminMiddleware, adminController.deleteUserById);

router.route("/contacts").get(authMiddleware, adminMiddleware, adminController.getAllContacts);

module.exports = router;
