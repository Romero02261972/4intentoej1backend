const fs = require("fs");
const { faker } = require("@faker-js/faker");

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
        this.carts = data ? JSON.parse(data) : [];
      } catch (error) {
        console.error(`Error al leer o parsear el archivo: ${error.message}`);
        this.carts = [];
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
      id: faker.string.uuid(),
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

module.exports = CartManager;
