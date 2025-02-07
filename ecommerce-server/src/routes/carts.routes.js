const express = require("express");
const CartManager = require("../cartManager");
const path = require("path");

const router = express.Router();
const cartManager = new CartManager(path.join("carts.json"));

// Crear un carrito
router.post("/", (req, res) => {
  const cartId = cartManager.createCart();
  res.status(201).send({ message: `Carrito creado con ID: ${cartId}` });
});

// Obtener un carrito por ID
router.get("/:cid", (req, res) => {
  const cart = cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });
  res.json(cart);
});

// Agregar un producto a un carrito
router.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  cartManager.addProductToCart(cid, Number(pid), 1);
  res.send({ message: "Producto agregado al carrito con éxito" });
});

module.exports = router;
