const express = require("express");
const ProductManager = require("./productManager");
const CartManager = require("./cartManager");
const app = express();

app.use(express.urlencoded({extended:true}))
app.use(express.json()); // Middleware para interpretar JSON

// Instanciar manejadores
const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./carts.json");

// Router para productos
const productsRouter = express.Router();
productsRouter.get("/", (req, res) => {
  res.json(productManager.getProducts());
});

productsRouter.get("/:pid", (req, res) => {
  const product = productManager.getProductById(Number(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).send({ error: "Producto no encontrado" });
  }
});

productsRouter.post("/", (req, res) => {
  const newProduct = req.body;
  productManager.addProduct(newProduct);
  res.status(201).send({ message: "Producto agregado con éxito" });
});

productsRouter.put("/:pid", (req, res) => {
  const updatedProduct = req.body;
  productManager.updateProduct(Number(req.params.pid), updatedProduct);
  res.send({ message: "Producto actualizado con éxito" });
});

productsRouter.delete("/:pid", (req, res) => {
  productManager.deleteProduct(Number(req.params.pid));
  res.send({ message: "Producto eliminado con éxito" });
});

// Router para carritos
const cartsRouter = express.Router();
cartsRouter.post("/", (req, res) => {
  const cartId = cartManager.createCart();
  res.status(201).send({ message: `Carrito creado con ID: ${cartId}` });
});

cartsRouter.get("/:cid", (req, res) => {
  const cart = cartManager.getCartById(Number(req.params.cid));
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).send({ error: "Carrito no encontrado" });
  }
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  cartManager.addProductToCart(Number(cid), Number(pid), 1);
  res.send({ message: "Producto agregado al carrito con éxito" });
});

// Registrar routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Iniciar servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
