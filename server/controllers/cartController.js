
const cartServices = require("../services/cartServices");

const errorResponses = {
    INVALID_ID: [400, "One or more IDs are invalid"],
    INVALID_QUANTITY: [400, "Quantity must be a positive integer"],
    PRODUCT_NOT_FOUND: [404, "Product not found"],
    VARIANT_NOT_FOUND: [404, "Product variant not found"],
    CART_NOT_FOUND: [404, "Cart not found"],
    CART_ITEM_NOT_FOUND: [404, "Cart item not found"],
    INSUFFICIENT_STOCK: [409, "Insufficient stock available"],
};

const sendResult = (
    res,
    result,
    successMessage,
    successStatus = 200
) => {
    if (result.error) {
        const [status, message] =
            errorResponses[result.error] ||
            [400, "Unable to process cart request"];

        return res.status(status).json({
            success: false,
            code: result.error,
            message,
        });
    }

    return res.status(successStatus).json({
        success: true,
        message: successMessage,
        ...result,
    });
};

const addToCart = async (req, res, next) => {
    try {
        const { productId, variantId, quantity } = req.body;

        const result = await cartServices.addToCart(
            req.user.userId,
            productId,
            variantId,
            quantity
        );

        return sendResult(res, result, "Item added to cart");
    } catch (error) {
        next(error);
    }
};

const getCart = async (req, res, next) => {
    try {
        const result = await cartServices.getCart(req.user.userId);

        return sendResult(res, result, "Cart retrieved successfully");
    } catch (error) {
        next(error);
    }
};

const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;

        const result = await cartServices.updateCartItem(
            req.user.userId,
            req.params.itemId,
            quantity
        );

        return sendResult(res, result, "Cart item updated");
    } catch (error) {
        next(error);
    }
};

const removeCartItem = async (req, res, next) => {
    try {
        const result = await cartServices.removeCartItem(
            req.user.userId,
            req.params.itemId
        );

        return sendResult(res, result, "Cart item removed");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
};
