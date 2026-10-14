const User = require("../models/user");

const ownerMiddleware = async (req, res, next) => {
    try {
        const userObj = await User.findById(req.user.userId);

        if (!userObj) {
            return res.status(404).json({
                success: false,
                message: "Could not find Account",
            });
        }

        if (userObj.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "you are not the owner",
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = ownerMiddleware;
