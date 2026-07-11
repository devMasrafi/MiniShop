const express = require("express");
const products = require("./products");

const app = express();
app.use(express.json());

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

// post prodct
app.post("/products", (req, res) => {
  const newId = () => {
    if (products.length === 0) {
      return 1;
    }

    const lastProduct = products[products.length - 1];
    return lastProduct.id + 1;
  };

  if (
    req.body.name == "" ||
    !req.body.name ||
    req.body.price == "" ||
    !req.body.price
  ) {
    return res.status(400).json({
      message: "product has empty field",
    });
  } else {
    const newProduct = {
      id: newId(),
      name: req.body.name,
      price: req.body.price,
    };

    products.push(newProduct);

    res.status(201).json({
      message: " Product Created Successfully",
      newProduct,
    });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
