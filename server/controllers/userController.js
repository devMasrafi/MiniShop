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
            {
                userId: loggedInUser._id,
                role: loggedInUser.role,
                name: loggedInUser.name,
            },
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

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user.userId);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const updateCurrentUser = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user.userId, req.body);

        // Update the JWT name so the dashboard displays the new name.
        const jwtToken = jwt.sign(
            {
                userId: user._id,
                role: user.role,
                name: user.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: user,
            jwtToken,
        });
    } catch (error) {
        next(error);
    }
};

const updateCurrentUserPassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        await userService.changePassword(
            req.user.userId,
            currentPassword,
            newPassword,
        );

        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateCurrentUser,
    updateCurrentUserPassword,
};
