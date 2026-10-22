const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Product = require("../models/Product");

const isValidId = (id) => mongoose.isValidObjectId(id);

const addToCart = async (userId, productId, variantId, quantity) => {
    if (!isValidId(userId) || !isValidId(productId) || !isValidId(variantId)) {
        return { error: "INVALID_ID" };
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        return { error: "INVALID_QUANTITY" };
    }

    const product = await Product.findById(productId);

    if (!product) {
        return { error: "PRODUCT_NOT_FOUND" };
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
        return { error: "VARIANT_NOT_FOUND" };
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
        (item) =>
            item.product.toString() === productId &&
            item.variantId.toString() === variantId,
    );

    const newQuantity = existingItem
        ? existingItem.quantity + quantity
        : quantity;

    if (newQuantity > variant.stock) {
        return { error: "INSUFFICIENT_STOCK" };
    }

    if (existingItem) {
        existingItem.quantity = newQuantity;
    } else {
        cart.items.push({
            product: productId,
            variantId,
            quantity,
        });
    }

    await cart.save();

    return { cart };
};

const getCart = async (userId) => {
    if (!isValidId(userId)) {
        return { error: "INVALID_ID" };
    }

    const cart = await Cart.findOne({ user: userId }).populate({
        path: "items.product",
        select: "name price brand category variants",
    });

    if (!cart) {
        return {
            cart: {
                user: userId,
                items: [],
            },
        };
    }

    return { cart };
};

const updateCartItem = async (userId, itemId, quantity) => {
    if (!isValidId(userId) || !isValidId(itemId)) {
        return { error: "INVALID_ID" };
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        return { error: "INVALID_QUANTITY" };
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return { error: "CART_NOT_FOUND" };
    }

    const item = cart.items.find((item) => item._id.toString() === itemId);

    if (!item) {
        return { error: "CART_ITEM_NOT_FOUND" };
    }

    const product = await Product.findById(item.product);

    if (!product) {
        return { error: "PRODUCT_NOT_FOUND" };
    }

    const variant = product.variants.id(item.variantId);

    if (!variant) {
        return { error: "VARIANT_NOT_FOUND" };
    }

    if (quantity > variant.stock) {
        return { error: "INSUFFICIENT_STOCK" };
    }

    item.quantity = quantity;

    await cart.save();

    return { cart };
};

const removeCartItem = async (userId, itemId) => {
    if (!isValidId(userId) || !isValidId(itemId)) {
        return { error: "INVALID_ID" };
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return { error: "CART_NOT_FOUND" };
    }

    const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === itemId,
    );

    if (itemIndex === -1) {
        return { error: "CART_ITEM_NOT_FOUND" };
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    return { cart };
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
};
