// const products = require("../data/products");
const Product = require("../models/Product");

const getProducts = async () => {
    return await Product.find();
};

const getProductById = async (id) => {
    const product = await Product.findById(id);

    return product;
};

const createProduct = async (body) => {

    const newProduct = {
        name: body.name,
        price: body.price,
    };

    const product = await Product.create(newProduct);
    return product;
};

const updateProduct = async (id, body) => {
    // Find product
    const product = await Product.findByIdAndUpdate(id, body, {
        new: true,
    });

    // If not found
    if (!product) {
        return undefined;
    }

    return product;
};

const deleteProduct = async (id) => {
    const deletedProduct = await Product.findByIdAndDelete(id);

    return deletedProduct;
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
