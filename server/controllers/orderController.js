
const orderServices = require("../services/orderServices");

const errorResponses = {
  INVALID_ID: [400, "One or more IDs are invalid"],
  INVALID_DELIVERY_DETAILS: [400, "Valid name, phone and delivery address are required"],
  CART_EMPTY: [400, "Your cart is empty"],
  PRODUCT_NOT_FOUND: [404, "A product in your cart no longer exists"],
  VARIANT_NOT_FOUND: [404, "A product variant in your cart no longer exists"],
  INVALID_QUANTITY: [400, "Cart contains an invalid quantity"],
  INSUFFICIENT_STOCK: [409, "A product does not have enough stock"],
  ORDER_NOT_FOUND: [404, "Order not found"],
  INVALID_ORDER_STATUS: [400, "Invalid order status"],
  INVALID_STATUS_TRANSITION: [409, "This order status transition is not allowed"],
  CANCELLATION_NOT_IMPLEMENTED: [409, "Order cancellation is not yet available"],
};

const sendResult = (res, result, message, status = 200) => {
  if (result.error) {
    const [httpStatus, errorMessage] =
      errorResponses[result.error] ||
      [400, "Unable to process order request"];

    return res.status(httpStatus).json({
      success: false,
      code: result.error,
      message: errorMessage,
    });
  }

  return res.status(status).json({
    success: true,
    message,
    ...result,
  });
};

const checkout = async (req, res, next) => {
  try {
    const result = await orderServices.checkout(
      req.user.userId,
      req.body
    );

    return sendResult(
      res,
      result,
      "Order placed successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const result = await orderServices.getMyOrders(
      req.user.userId
    );

    return sendResult(res, result, "Orders retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getMyOrderById = async (req, res, next) => {
  try {
    const result = await orderServices.getMyOrderById(
      req.user.userId,
      req.params.orderId
    );

    return sendResult(res, result, "Order retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const result = await orderServices.getAllOrders();

    return sendResult(res, result, "Orders retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const result = await orderServices.updateOrderStatus(
      req.params.orderId,
      req.body.status
    );

    return sendResult(res, result, "Order status updated");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkout,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
};
