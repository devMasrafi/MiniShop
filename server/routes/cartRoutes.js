const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
    "/cart",
    authMiddleware,
    authorizeRoles("customer"),
    cartController.getCart,
);

router.post(
    "/cart/items",
    authMiddleware,
    authorizeRoles("customer"),
    cartController.addToCart,
);

router.patch(
    "/cart/items/:itemId",
    authMiddleware,
    authorizeRoles("customer"),
    cartController.updateCartItem,
);

router.delete(
    "/cart/items/:itemId",
    authMiddleware,
    authorizeRoles("customer"),
    cartController.removeCartItem,
);

module.exports = router;
