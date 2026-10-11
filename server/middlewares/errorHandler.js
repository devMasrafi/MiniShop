const errorHandler = (error, req, res, next) => {
    // console.log(error.name);

    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    if (error.code === 11000 && error.keyPattern?.email) {
        return res.status(409).json({
            success: false,
            message: "this email is already registered",
        });
    }

    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
    });
};

module.exports = errorHandler;
