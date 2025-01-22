const fs = require("fs");
const path = require("path");

class CartManager {
  constructor(filePath) {
    if (!filePath) {
      console.error("Se debe proporcionar una ruta válida para el archivo.");
      return;
    }

    this.path = filePath;
    this.carts = [];

    if (!fs.existsSync(this.path)) {
      try {
        fs.writeFileSync(this.path, JSON.stringify([], null, 2));
      } catch (error) {
        console.error(`Error al crear el archivo: ${error.message}`);
      }
    } else {
      try {
        const data = fs.readFileSync(this.path, "utf-8");
        this.carts = data ? JSON.parse(data) : []; // Verifica si el archivo no está vacío
      } catch (error) {
        console.error(`Error al leer o parsear el archivo: ${error.message}`);
        this.carts = []; // Inicializa como array vacío en caso de error
      }
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error(`Error al guardar en el archivo: ${error.message}`);
    }
  }

  createCart() {
    const newCart = {
      id: this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1,
      products: [],
    };
    this.carts.push(newCart);
    this.saveToFile();
    console.log(`Carrito con ID ${newCart.id} creado.`);
    return newCart.id;
  }

  getCartById(cartId) {
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) {
      console.error(`Carrito con ID ${cartId} no encontrado.`);
      return null;
    }
    return cart;
  }

  addProductToCart(cartId, productId, quantity) {
    if (!cartId || typeof cartId !== "number") {
      console.error("El ID del carrito debe ser un número válido.");
      return;
    }
    if (!productId || typeof productId !== "number") {
      console.error("El ID del producto debe ser un número válido.");
      return;
    }
    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      console.error("La cantidad debe ser un número mayor a 0.");
      return;
    }

    const cart = this.getCartById(cartId);
    if (!cart) return;

    const productInCart = cart.products.find((p) => p.productId === productId);
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
    this.saveToFile();
    console.log(
      `Producto con ID ${productId} agregado al carrito con ID ${cartId}.`
    );
  }

  getCarts() {
    return this.carts;
  }
}

const cartManager = new CartManager(path.resolve(__dirname, "carts.json"));

const cartId = cartManager.createCart();

cartManager.addProductToCart(cartId, 1, 2);
cartManager.addProductToCart(cartId, 2, 1);

const cart = cartManager.getCartById(cartId);
console.log("Carrito obtenido:", cart);

console.log("Todos los carritos:", cartManager.getCarts());
