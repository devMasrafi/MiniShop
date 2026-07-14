const productService = require("../services/productServices");

// get products
const getProducts =async (req, res) => {
    const products = await productService.getProducts();

    res.send(products);
};

// get Product By using the Id
const getProductById = async (req, res) => {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }

    res.send(product);
};

// create new product
const createProduct = async (req, res) => {
    const newProduct = await productService.createProduct(req.body);

    if (!newProduct) {
        return res.status(400).json("Field is missing");
    }

    res.status(201).json({
        message: "Product Created Successfully",
        newProduct,
    });
};

// Update a single product
const updateProduct = async (req, res) => {
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
        message: "product updated successfull",
        updateProduct,
    });
};

// delete a product
const deleteProduct = async (req, res) => {
    const deletedProduct = await productService.deleteProduct(req.params.id);

    if (!deletedProduct) {
        return res.status(404).json({
            message: "delete unsuccessfull",
        });
    }

    res.status(200).json({
        message: "Product deleted successfully",
        deletedProduct,
    });
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
