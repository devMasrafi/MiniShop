const mongoose = require("mongoose");

const validateID = (id) => {
    if (mongoose.isValidObjectId(id)) {
        const error = new Error("Invalid ID");
        error.statusCode = 400;

        throw error;
    }

};

module.exports = validateID;
