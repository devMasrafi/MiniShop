// const products = require("../data/products");
const Product = require("../models/Product");

const getProducts = async () => {
    return await Product.find();
};

const getProductById = async (id) => {
    const product = await Product.findById(id);

    return product;
};

const createProduct = async (body, userId) => {
    const newProduct = {
        name: body.name,
        price: body.price,
        description: body.description,
        owner: userId,
    };

    const product = await Product.create(newProduct);
    return product;
};

const updateProduct = async (productId, body, userId) => {
    // Find product
    const product = await Product.findById(productId);

    if (!product) {
        return {
            success: false,
            reason: "NOT_FOUND",
        };
    }

    const owner = product.owner.toString();
    if (owner !== userId) {
        return {
            success: false,
            reason: "NOT_OWNER",
        };
    }

    const newProduct = await Product.findByIdAndUpdate(productId, body, {
        new: true,
    });

    return newProduct;
};

const deleteProduct = async (productId, userId) => {
    const product = await Product.findById(productId);

    if (!product) {
        return {
            success: false,
            reason: "NOT_FOUND",
        };
    }

    const owner = product.owner.toString();

    if (owner !== userId) {
        return {
            success: false,
            reason: "NOT_OWNER",
        };
    }

    await Product.findByIdAndDelete(productId);

    return product;
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
