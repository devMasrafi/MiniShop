const User = require("../models/user");

const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.userId).select("role");

            console.log({
                tokenUserId: req.user.userId,
                databaseUserId: user?._id?.toString(),
                databaseRole: user?.role,
                allowedRoles,
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Account not found",
                });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You do not have permission to perform this action",
                });
            }

            req.user.userRole = user.role;
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = authorizeRoles;
