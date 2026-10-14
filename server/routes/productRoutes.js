const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

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

router.post("/products", authMiddleware, ownerMiddleware, createProduct);

router.put("/products/:id", authMiddleware, ownerMiddleware, updateProduct);

router.delete("/products/:id", authMiddleware, ownerMiddleware, deleteProduct);

router.get("/my-products", authMiddleware, ownerMiddleware, getMyProducts);

module.exports = router;
