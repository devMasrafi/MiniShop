const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// GET/Fetch All
router.get("/", (req, res) => {
    res.send("Welcome to my first Express server!");
});

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

router.post("/products", authMiddleware, createProduct);

router.put("/products/:id", authMiddleware, updateProduct);

router.delete("/products/:id", authMiddleware, deleteProduct);

module.exports = router;
