const userService = require("../services/userServices");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
    try {
        await userService.createUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const loggedInUser = await userService.loginUser(req.body);

        if (!loggedInUser) {
            return res.status(401).json({
                success: false,
                message: "invalid email or password",
            });
        }

        // jwt token
        const jwtToken = jwt.sign(
            { userId: loggedInUser._id, role: loggedInUser.role, name: loggedInUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            jwtToken,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
};
