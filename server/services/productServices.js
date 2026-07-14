const products = require("../data/products");

const getProducts = () => {
    return products;
};

const getProductById = (id) => {
    const product = products.find((product) => {
        return product.id == id;
    });

    return product;
};

const createProduct = (body) => {
    const newId = () => {
        if (products.length === 0) {
            return 1;
        }

        const lastProduct = products[products.length - 1];
        return lastProduct.id + 1;
    };

    if (body.name == "" || !body.name || body.price == "" || !body.price) {
        return undefined;
    }

    const newProduct = {
        id: newId(),
        name: body.name,
        price: body.price,
    };

    products.push(newProduct);

    return newProduct;
};

const updateProduct = (id, body) => {
    // Find product
    const product = products.find((product) => {
        return product.id == id;
    });

    // If not found
    if (!product || product == null) {
        return undefined;
    }

    // Update name if sent
    if (body.name) {
        product.name = body.name;
    }

    // Update price if sent
    if (body.price) {
        product.price = body.price;
    }

    return product;
};

const deleteProduct = (id) => {
    const index = products.findIndex((product) => {
        return product.id == id;
    });

    const deletedProduct = products[index]

    if (index === -1) {
        return undefined
    }
    products.splice(index, 1);

    return deletedProduct
};

module.exports = { getProducts, getProductById, createProduct, updateProduct };
