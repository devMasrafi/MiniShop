const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "User in not logged in",
        });
    }

    const token = authHeader.split(" ")[1];

    // check for JWT----verify jwt token
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: decodedToken.userId,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or Expired token ",
        });
    }
};

module.exports = authMiddleware;
