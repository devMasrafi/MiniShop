const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

// All order routes require authentication.
router.use(authMiddleware);

// Customer routes.
router.post(
    "/orders/checkout",
    authorizeRoles("customer"),
    orderController.checkout,
);

router.get(
    "/orders/my",
    authorizeRoles("customer"),
    orderController.getMyOrders,
);

router.get(
    "/orders/my/:orderId",
    authorizeRoles("customer"),
    orderController.getMyOrderById,
);

// Staff routes: employee and admin.
router.get(
    "/orders",
    (req, res, next) => {
        next();
    },
    authorizeRoles("employee", "admin"),
    orderController.getAllOrders,
);

router.patch(
    "/orders/:orderId/status",
    authorizeRoles("employee", "admin"),
    orderController.updateOrderStatus,
);

module.exports = router;
