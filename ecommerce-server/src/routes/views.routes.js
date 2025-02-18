const express = require("express");
const ProductManager = require("../productManager");
const path = require("path");

const router = express.Router();
const productManager = new ProductManager("products.json");

router.get("/products", (req, res) => {
    const products = productManager.getProducts();
    res.render("index", { products });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

module.exports = router;
