const productService = require("../services/productServices");

// get products
const getProducts = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";

        const result = await productService.getProducts(page, limit, search);

        return res.status(200).json({
            success: true,
            data: result.products,
            pagination: {
                page,
                limit,
                totalProducts: result.totalProducts,
                totalPages: result.totalPages,
            },
        });
    } catch (error) {
        next(error);
    }
};

// get Product By using the Id
const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// get my proudct route
const getMyProducts = async (req, res, next) => {
    try {
        const products = await productService.getMyProducts(req.user.userId);

        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

// create new product
const createProduct = async (req, res, next) => {
    try {
        const newProduct = await productService.createProduct(
            req.body,
            req.user.userId,
        );

        return res.status(201).json({
            success: true,
            message: "Product Created Successfully",
            newProduct,
        });
    } catch (error) {
        next(error);
    }
};

// Update a single product
const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body,
            req.user.userId,
        );

        if (product.reason === "NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Update failed, Product not found",
            });
        }
        if (product.reason === "NOT_OWNER") {
            return res.status(403).json({
                success: false,
                message: "Update Failed, You are not the owner",
            });
        }
        // Send success response
        return res.status(200).json({
            success: true,
            message: "Product updated successfull",
            product,
        });
    } catch (error) {
        next(error);
    }
};

// delete a product
const deleteProduct = async (req, res, next) => {
    try {
        const product = await productService.deleteProduct(
            req.params.id,
            req.user.userId,
        );

        if (product.reason === "NOT_FOUND") {
            return res.status(404).json({
                message: "Product Not Found!",
            });
        }

        if (product.reason === "NOT_OWNER") {
            return res.status(403).json({
                message: "Forbidden! not product owner",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
};
