const express = require("express");
const { faker } = require("@faker-js/faker");
const ProductManager = require("./productManager");
const CartManager = require("./cartManager");
const app = express();
const PORT = 8080;
const path = require("path");

// Instanciar los manejadores
const productManager = new ProductManager("products.json");
const cartManager = new CartManager(path.join("carts.json"));
//console.log("Directorio actual:", __dirname);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router para productos
const productsRouter = express.Router();

productsRouter.get("/", (req, res) => {
  res.json(productManager.getProducts());
});

productsRouter.get("/:pid", (req, res) => {
  const product = productManager.getProductById(req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send({ error: "Producto no encontrado" });
  }
});

productsRouter.post("/", (req, res) => {
  const newProduct = req.body;
  console.log("Producto recibido:", newProduct);
  
  if (typeof newProduct.status === "string") {
    newProduct.status = newProduct.status.toLowerCase() === "true";
  }

  // Generar un ID único con Faker
  newProduct.id = faker.string.uuid();

  // Agregar el producto usando ProductManager
  productManager.addProduct(newProduct);
  console.log("Productos después de agregar:", productManager.getProducts());

  res.status(201).send({
    message: "Producto agregado con éxito",
    product: newProduct,
  });
});

productsRouter.put("/:pid", (req, res) => {
  const updatedProduct = req.body;
  productManager.updateProduct(req.params.pid, updatedProduct);
  res.send({ message: "Producto actualizado con éxito" });
});

productsRouter.delete("/:pid", (req, res) => {
  productManager.deleteProduct(req.params.pid);
  res.send({ message: "Producto eliminado con éxito" });
});

// Router para carritos
const cartsRouter = express.Router();

cartsRouter.post("/", (req, res) => {
  const cartId = cartManager.createCart();
  res.status(201).send({ message: `Carrito creado con ID: ${cartId}` });
});

//cartsRouter.get("/", (req, res) => {
  //res.json(cartManager.getCarts());
//});

cartsRouter.get("/:cid", (req, res) => {
  const cart = cartManager.getCartById(req.params.cid);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).send({ error: "Carrito no encontrado" });
  }
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  cartManager.addProductToCart(cid, Number(pid), 1);
  res.send({ message: "Producto agregado al carrito con éxito" });
});

// Usar los routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
