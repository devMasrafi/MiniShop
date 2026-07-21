const errorHandler = (error, req, res, next) => {
    // console.log(error.name);

    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: error.message,
    });
};

module.exports = errorHandler;
