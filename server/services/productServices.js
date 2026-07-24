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

// allowed field
const allowedFields = ["name", "price"];

const getSort = (sort) => {
    let field = sort;
    let direction = 1;

    if (!sort) {
        return null;
    }

    if (sort.startsWith("-")) {
        field = sort.slice(1);
        direction = -1;
    }

    if (!allowedFields.includes(field)) {
        const error = new Error("Invalid sorting field");
        error.statusCode = 400;

        throw error;
    }

    return {
        field,
        direction,
    };
};

// actual get request
const getProducts = async (page, limit, search, sort) => {
    const skip = limit * (page - 1);

    // filter
    const filter = {
        name: {
            $regex: search,
            $options: "i",
        },
    };

    // run sorting helper
    const sortResult = getSort(sort);

    // create mongoose query
    let query = Product.find(filter);

    // apply soritng if requested
    if (sortResult) {
        query.sort({
            [sortResult.field]: sortResult.direction,
        });
    }

    query.skip(skip);
    query.limit(limit);

    const products = await query.populate("owner", "-password");

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    return {
        products,
        totalProducts,
        totalPages,
    };
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
