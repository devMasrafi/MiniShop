const Product = require("../models/Product");

// Find a product helper.

const findOwnedProduct = async (productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        return {
            success: false,
            reason: "NOT FOUND",
        };
    }

    return product;
};

// Fields that can be used for sorting.
const allowedFields = ["name", "price"];

// Validate the requested sort field and determine its direction.
const getSort = (sort) => {
    if (!sort) {
        return null;
    }

    let field = sort;
    let direction = 1;

    if (sort.startsWith("-")) {
        field = sort.slice(1);
        direction = -1;
    }

    if (!allowedFields.includes(field)) {
        const error = new Error("Invalid sorting field");
        error.statusCode = 400;
        throw error;
    }

    return { field, direction };
};

// Get products with filtering, sorting, and pagination.
const getProducts = async (
    page,
    limit,
    search,
    sort,
    minPrice,
    maxPrice,
    category,
) => {
    const skip = limit * (page - 1);

    // Build the product filter.
    const filter = {
        name: {
            $regex: search,
            $options: "i",
        },
    };

    // Validate and apply price filters.
    if (minPrice !== null || maxPrice !== null) {
        if (minPrice !== null && (isNaN(minPrice) || minPrice < 0)) {
            const error = new Error("Invalid minimum price");
            error.statusCode = 400;
            throw error;
        }

        if (maxPrice !== null && (isNaN(maxPrice) || maxPrice < 0)) {
            const error = new Error("Invalid maximum price");
            error.statusCode = 400;
            throw error;
        }

        if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
            const error = new Error(
                "Minimum price cannot be higher than maximum price",
            );
            error.statusCode = 400;
            throw error;
        }

        filter.price = {};

        if (minPrice !== null) {
            filter.price.$gte = minPrice;
        }

        if (maxPrice !== null) {
            filter.price.$lte = maxPrice;
        }
    }

    if (category) {
        filter.category = category;
    }

    // Prepare the sort options.
    const sortResult = getSort(sort);

    // Build and execute the database query.
    let query = Product.find(filter);

    if (sortResult) {
        query.sort({
            [sortResult.field]: sortResult.direction,
        });
    }

    query.skip(skip);
    query.limit(limit);

    const products = await query.populate("owner", "-password");

    // Count matching products for pagination.
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    return {
        products,
        totalProducts,
        totalPages,
    };
};

// Get one product by its ID.
const getProductById = async (id) => {
    const product = await Product.findById(id);

    if (!product) {
        return null;
    }

    return product.populate("owner", "-password");
};

// Get products belonging to a specific user.
const getMyProducts = async (userId) => {
    const products = await Product.find({
        owner: userId,
    });

    return products.populate("owner", "-password");
};

// Create a product for the requesting user.
const createProduct = async (body, userId) => {
    const newProduct = {
        name: body.name,
        price: body.price,
        description: body.description,
        category: body.category,
        owner: userId,
    };

    return Product.create(newProduct);
};

// Update a product after finding.
const updateProduct = async (productId, body) => {
    const product = await findOwnedProduct(productId);

    if (product.success === false) {
        return product;
    }

    return Product.findByIdAndUpdate(productId, body, {
        returnDocument: "after",
    });
};

// Delete a product after finding.
const deleteProduct = async (productId) => {
    const product = await findOwnedProduct(productId);

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
