const fs = require("fs");
const { faker } = require("@faker-js/faker");

class ProductManager {
  constructor(filePath) {
    this.products = [];
    if (!filePath) {
      console.error("Se debe proporcionar una ruta válida para el archivo.");
      return;
    }

    this.path = filePath;

    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([], null, 2));
    } else {
      const data = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(data);
    }
  }

  saveToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }

  addProduct({ title, description, price, thumbnail, stock }) {
    if (
      !title ||
      typeof title !== "string" ||
      title.trim() === "" ||
      !description ||
      typeof description !== "string" ||
      description.trim() === "" ||
      typeof price !== "number" ||
      price <= 0 ||
      !thumbnail ||
      typeof thumbnail !== "string" ||
      thumbnail.trim() === "" ||
      typeof stock !== "number" ||
      stock <= 0
    ) {
      console.error("Producto no agregado: Todos los campos son obligatorios y deben ser válidos.");
      return;
    }

    const exists = this.products.some(
      (product) => product.title === title && product.description === description
    );
    if (exists) {
      console.error("Error: Producto duplicado.");
      return;
    }

    const newProduct = {
      id: faker.string.uuid(),
      title,
      description,
      price,
      thumbnail,
      stock,
    };

    this.products.push(newProduct);
    this.saveToFile();
    console.log("Producto agregado:", newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.error("Estatus del producto: Not found");
      return null;
    }
    return product;
  }

  updateProduct(id, updates) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      console.error(`Producto con ID ${id} no encontrado.`);
      return;
    }

    const product = this.products[productIndex];
    const updatedProduct = { ...product, ...updates };

    if (updatedProduct.id !== id) {
      console.error("El ID del producto no puede ser modificado.");
      return;
    }

    this.products[productIndex] = updatedProduct;
    this.saveToFile();
    console.log(`Producto con ID ${id} actualizado.`);
  }
}

module.exports = ProductManager;
