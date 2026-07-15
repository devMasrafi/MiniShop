const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(express.json());
app.use(productRoutes);


// lastPart
app.use(errorHandler)

// mongoose.connect("mongodb://localhost:27017/miniShop");
mongoose
    .connect("mongodb://127.0.0.1:27017/miniShop")
    .then(() => {
        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        });
    })
    .catch((err) => {
        console.log("MongoDB Connection Failed")
        console.log(err);
    });
