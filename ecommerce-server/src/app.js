const express = require('express');
const { engine } = require('express-handlebars');
const { Server } = require("socket.io");
const path = require("path");
const morgan = require('morgan');
const fs = require('fs'); 

const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");
const viewsRouter = require("./routes/views.routes");
const ProductManager = require("./productManager");

const app = express();
const PORT = 8080;

const productManager = new ProductManager("products.json");

app.use(morgan('dev'));

app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials') 
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 💡(AQUÍ SE AGREGÓ) Verificamos que las carpetas y archivos existen
console.log("Carpeta views configurada en:", path.join(__dirname, 'views'));
console.log("Carpeta layouts configurada en:", path.join(__dirname, 'views', 'layouts'));

// Verificar si el directorio layouts existe
if (fs.existsSync(path.join(__dirname, 'views', 'layouts'))) {
    console.log("Contenido de layouts:", fs.readdirSync(path.join(__dirname, 'views', 'layouts')));
} else {
    console.log(" La carpeta 'views/layouts' no existe.");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  socket.emit("productos", productManager.getProducts());

  socket.on("nuevoProducto", (producto) => {
      productManager.addProduct(producto);
      io.emit("productos", productManager.getProducts());
  });

  socket.on("eliminarProducto", (id) => {
      const success = productManager.deleteProduct(id);
      if (success) {
      io.emit("productos", productManager.getProducts());
      } else {
        socket.emit("error", "Producto no encontrado o no se pudo eliminar.");
      }
      });

  socket.on("disconnect", () => {
      console.log("Un usuario se ha desconectado");
  });
});

module.exports = { app, io };
