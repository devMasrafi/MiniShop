const Product = require("../models/Product");

const findOwnedProduct = async (productId, userId) => {
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
    return product;
};

const getProducts = async () => {
    return await Product.find().populate("owner", "-password");
};

const getProductById = async (id) => {
    const product = await Product.findById(id);

    if (!product) {
        return null;
    }

    return product.populate("owner", "-password");
};

const getMyProducts = async (userId) => {
    const products = await Product.find({
        owner: userId,
    });

    return products.populate("owner", "-password");
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
    const product = await findOwnedProduct(productId, userId);

    if (product.success === false) {
        return product;
    }

    const newProduct = await Product.findByIdAndUpdate(productId, body, {
        new: true,
    });

    return newProduct;
};

const deleteProduct = async (productId, userId) => {
    const product = await findOwnedProduct(productId, userId);

    if (product.success === false) {
        return product;
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
    getMyProducts,
};
