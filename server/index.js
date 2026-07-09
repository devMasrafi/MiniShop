const express = require("express");
const products = require("./products");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to my first Express server!");
});

app.get("/products", (req, res) => {
  res.send(products);
});

app.get("/products/:id", (req, res) => {
  const product = products.find((product) => {
    return product.id == req.params.id;
  });

  res.send(product);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
