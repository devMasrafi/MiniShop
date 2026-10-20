const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
} = require("../controllers/productController");
const ownerMiddleware = require("../middlewares/ownerMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to MiniShop Express server!");
});

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

router.post(
    "/products",
    authMiddleware,
    authorizeRoles("admin", "employee"),
    createProduct,
);
router.put(
    "/products/:id",
    authMiddleware,
    authorizeRoles("admin", "employee"),
    updateProduct,
);
router.delete(
    "/products/:id",
    authMiddleware,
    authorizeRoles("admin", "employee"),
    deleteProduct,
);
router.get(
    "/my-products",
    authMiddleware,
    authorizeRoles("admin", "employee"),
    getMyProducts,
);
module.exports = router;
