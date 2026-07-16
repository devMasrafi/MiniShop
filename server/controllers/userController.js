const userService = require("../services/userServices");

const registerUser = async (req, res, next) => {
    try {
        const newUser = await userService.createUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            newUser,
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

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
};
