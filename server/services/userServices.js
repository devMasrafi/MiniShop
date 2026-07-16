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

module.exports = { createUser, loginUser };
