const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const validateID = require("../utils/vallidId");


const checkout = async (userId, { customerName, phone, deliveryAddress }) => {
    validateID(userId);

    if (
        typeof customerName !== "string" ||
        !customerName.trim() ||
        typeof phone !== "string" ||
        !phone.trim() ||
        typeof deliveryAddress !== "string" ||
        !deliveryAddress.trim()
    ) {
        return { error: "INVALID_DELIVERY_DETAILS" };
    }

    const session = await mongoose.startSession();

    try {
        let createdOrder;

        await session.withTransaction(async () => {
            const cart = await Cart.findOne({ user: userId }).session(session);

            if (!cart || cart.items.length === 0) {
                throw new Error("CART_EMPTY");
            }

            const orderItems = [];
            let subtotal = 0;

            for (const cartItem of cart.items) {
                const product = await Product.findById(
                    cartItem.product,
                ).session(session);

                if (!product) {
                    throw new Error("PRODUCT_NOT_FOUND");
                }

                const variant = product.variants.id(cartItem.variantId);

                if (!variant) {
                    throw new Error("VARIANT_NOT_FOUND");
                }

                if (
                    !Number.isInteger(cartItem.quantity) ||
                    cartItem.quantity < 1
                ) {
                    throw new Error("INVALID_QUANTITY");
                }

                // Atomically deduct stock only if enough remains.
                const stockUpdate = await Product.updateOne(
                    {
                        _id: product._id,
                        variants: {
                            $elemMatch: {
                                _id: cartItem.variantId,
                                stock: { $gte: cartItem.quantity },
                            },
                        },
                    },
                    {
                        $inc: {
                            "variants.$.stock": -cartItem.quantity,
                        },
                    },
                    { session },
                );

                if (stockUpdate.modifiedCount !== 1) {
                    throw new Error("INSUFFICIENT_STOCK");
                }

                const unitPrice = product.price;
                const itemSubtotal = unitPrice * cartItem.quantity;

                subtotal += itemSubtotal;

                orderItems.push({
                    product: product._id,
                    productName: product.name,
                    variantId: variant._id,
                    color: variant.color,
                    size: variant.size,
                    unitPrice,
                    quantity: cartItem.quantity,
                    subtotal: itemSubtotal,
                });
            }

            // Configure the store's actual delivery fee here.
            const deliveryFee = 0;

            createdOrder = new Order({
                user: userId,
                items: orderItems,
                customerName: customerName.trim(),
                phone: phone.trim(),
                deliveryAddress: deliveryAddress.trim(),
                subtotal,
                deliveryFee,
                totalAmount: subtotal + deliveryFee,
                paymentMethod: "COD",
                paymentStatus: "pending",
                status: "pending",
            });

            await createdOrder.save({ session });

            await Cart.deleteOne({ user: userId }, { session });
        });

        return { order: createdOrder };
    } catch (error) {
        const knownErrors = [
            "CART_EMPTY",
            "PRODUCT_NOT_FOUND",
            "VARIANT_NOT_FOUND",
            "INVALID_QUANTITY",
            "INSUFFICIENT_STOCK",
        ];

        if (knownErrors.includes(error.message)) {
            return { error: error.message };
        }

        throw error;
    } finally {
        await session.endSession();
    }
};

const getMyOrders = async (userId) => {
    validateID(userId);
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return { orders };
};

const getMyOrderById = async (userId, orderId) => {
    validateID(userId);
    validateID(orderId);

    const order = await Order.findOne({
        _id: orderId,
        user: userId,
    });

    if (!order) {
        return { error: "ORDER_NOT_FOUND" };
    }

    return { order };
};

const getAllOrders = async () => {
    const orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    return { orders };
};

const updateOrderStatus = async (orderId, status) => {
    validateID(orderId);
    
    const allowedStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
        return { error: "INVALID_ORDER_STATUS" };
    }

    const order = await Order.findById(orderId);

    if (!order) {
        return { error: "ORDER_NOT_FOUND" };
    }

    // Cancellation needs a separate inventory-restoration workflow.
    if (status === "cancelled") {
        return { error: "CANCELLATION_NOT_IMPLEMENTED" };
    }

    const transitions = {
        pending: ["confirmed"],
        confirmed: ["processing"],
        processing: ["shipped"],
        shipped: ["delivered"],
        delivered: [],
        cancelled: [],
    };

    if (!transitions[order.status].includes(status)) {
        return { error: "INVALID_STATUS_TRANSITION" };
    }

    order.status = status;

    await order.save();

    return { order };
};

module.exports = {
    checkout,
    getMyOrders,
    getMyOrderById,
    getAllOrders,
    updateOrderStatus,
};
