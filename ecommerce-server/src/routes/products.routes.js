const express = require("express");
const ProductManager = require("../productManager");

const router = express.Router();
const productManager = new ProductManager("products.json");

// Obtener todos los productos
router.get("/", (req, res) => {
    const products = productManager.getProducts();
    console.log("Productos obtenidos en /api/products:", products);
    res.json(products); 
  });
  

// Obtener producto por ID
router.get("/:pid", (req, res) => {
  const product = productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).send({ error: "Producto no encontrado" });
  res.json(product);
});

// Agregar un producto
router.post("/", (req, res) => {
  const newProduct = req.body;
  if (typeof newProduct.status === "string") {
    newProduct.status = newProduct.status.toLowerCase() === "true";
  }

  const addedProduct = productManager.addProduct(newProduct);
  if (!addedProduct) return res.status(400).send({ message: "Error al agregar el producto." });

  res.status(201).send({ message: "Producto agregado con éxito", product: addedProduct });
});

// Actualizar un producto
router.put("/:pid", (req, res) => {
  const updatedProduct = req.body;
  productManager.updateProduct(req.params.pid, updatedProduct);
  res.send({ message: "Producto actualizado con éxito" });
});

// Eliminar un producto
router.delete("/:pid", (req, res) => {
  const deleted = productManager.deleteProduct(req.params.pid);
  if (!deleted) return res.status(404).send({ error: "Producto no encontrado" });
  res.send({ message: "Producto eliminado con éxito" });
});

module.exports = router;
