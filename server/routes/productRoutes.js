const express = require("express");
const products = require("../data/products");

const router = express.Router();

// GET/Fetch All
router.get("/", (req, res) => {
  res.send("Welcome to my first Express server!");
});

// GET/Fetch All the Product
router.get("/products", (req, res) => {
  res.send(products);
});

// GET/Fetch single product
router.get("/products/:id", (req, res) => {
  const product = products.find((product) => {
    return product.id == req.params.id;
  });

  res.send(product);
});

//POST/Create new prodct
router.post("/products", (req, res) => {
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
  }
  
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
});

// PUT/Update product
router.put("/products/:id", (req, res) => {
  // Find product
  const product = products.find((product) => {
    return product.id == req.params.id;
  });

  // If not found
  if (!product || product == null) {
    return res.status(404).json("update Failed, Product not Found!");
  }

  // Update name if sent
  if (req.body.name) {
    product.name = req.body.name;
  }

  // Update price if sent
  if (req.body.price) {
    product.price = req.body.price;
  }
  // Send success response
  return res.status(200).json({
    message: "product updated successfull",
    product,
  });
});

// DELETE/remove product
router.delete("/products/:id", (req, res) => {
  const index = products.findIndex((product) => {
    return product.id == req.params.id;
  });

  if (index === -1) {
    return res.status(404).json({
      message: "Product Not Found",
    });
  } 
    products.splice(index, 1);

    res.status(200).json({
      message: "Product deleted successfully",
      products,
    });
  
});

module.exports = router;
