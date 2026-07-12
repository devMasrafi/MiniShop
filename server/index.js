const express = require("express");
const productRoutes = require("./routes/productRoutes")


const app = express();
app.use(express.json());

app.use(productRoutes)

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
