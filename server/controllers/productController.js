const productService = require("../services/productServices");

// get products
const getProducts = async (req, res, next) => {
    try {
        const products = await productService.getProducts();

        return res.status(200).send({
            success: true,
            data: products,
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

// create new product
const createProduct = async (req, res, next) => {
    try {
        const newProduct = await productService.createProduct(req.body);

        if (!newProduct) {
            return res.status(400).json({
                success: false,
                message: "Field is missing",
            });
        }

        return res.status(201).json({
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
        const updateProduct = await productService.updateProduct(
            req.params.id,
            req.body,
        );

        if (!updateProduct) {
            return res.status(404).json({
                success: false,
                message: "Update failed, Product not found",
            });
        }
        // Send success response
        return res.status(200).json({
            message: "Product updated successfull",
            updateProduct,
        });
    } catch (error) {
        next(error);
    }
};

// delete a product
const deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await productService.deleteProduct(
            req.params.id,
        );

        if (!deletedProduct) {
            return res.status(404).json({
                message: "delete unsuccessfull",
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully",
            deletedProduct,
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
};
