const User = require("../models/user");
const bcrypt = require("bcrypt");

const createUser = async (body) => {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = {
        name: body.name,
        email: body.email,
        password: hashedPassword,
    };

    const user = await User.create(newUser);

    return user;
};

const loginUser = async (body) => {
    const foundUser = await User.findOne({ email: body.email });

    if (!foundUser) {
        return undefined;
    }

    const isMatch = await bcrypt.compare(body.password, foundUser.password);

    if (!isMatch) {
        return undefined;
    }
    return foundUser;
};

const getProfile = async (userId) => {
    const user = await User.findById(userId).select("-password");

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

const updateProfile = async (userId, body) => {
    const allowedFields = [
        "name",
        "email",
        "phone",
        "address",
        "country",
        "dateOfBirth",
    ];

    const updates = {};

    for (const field of allowedFields) {
        if (!Object.hasOwn(body, field)) continue;

        const value = body[field];

        if (field === "dateOfBirth") {
            if (value === "" || value === null) {
                updates.dateOfBirth = null;
            } else {
                const date = new Date(value);

                if (Number.isNaN(date.getTime())) {
                    const error = new Error("Invalid date of birth.");
                    error.statusCode = 400;
                    throw error;
                }

                updates.dateOfBirth = date;
            }

            continue;
        }

        if (typeof value !== "string") {
            const error = new Error(`${field} must be a string.`);
            error.statusCode = 400;
            throw error;
        }

        updates[field] = value.trim();

        if (field === "email") {
            updates.email = updates.email.toLowerCase();
        }
    }

    if (Object.keys(updates).length === 0) {
        const error = new Error("No profile changes provided.");
        error.statusCode = 400;
        throw error;
    }

    if ("name" in updates && !updates.name) {
        const error = new Error("Name is required.");
        error.statusCode = 400;
        throw error;
    }

    if (
        "email" in updates &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)
    ) {
        const error = new Error("Please provide a valid email address.");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
    }).select("-password");

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
    if (typeof currentPassword !== "string" || !currentPassword) {
        const error = new Error("Current password is required.");
        error.statusCode = 400;
        throw error;
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
        const error = new Error("New password must be at least 8 characters.");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    const passwordMatches = await bcrypt.compare(
        currentPassword,
        user.password,
    );

    if (!passwordMatches) {
        const error = new Error("Current password is incorrect.");
        error.statusCode = 400;
        throw error;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
};

module.exports = {
    createUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
};
