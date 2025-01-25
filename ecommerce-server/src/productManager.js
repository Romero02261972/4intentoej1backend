const fs = require("fs");
const { faker } = require(`@faker-js/faker`);
const path = require("path");

class ProductManager {
  constructor(filePath) {
    
    if (!filePath) {
      console.error("Se debe proporcionar una ruta válida para el archivo.");
      return;
    }

    this.path = path.resolve(filePath);
    console.log("Ruta del archivo product.json", this.path);
    this.products = [];

    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([], null, 2));
    } else {
      const data = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(data);
    }
  }

  saveToFile() {
    try{
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  console.log("Archivo actualizado correctamente.");
  } catch (error){
    console.error(`Error al guardar el archivo: ${error.message}`);
  }
  }

  addProduct({ title, description, price, status, thumbnail, stock, category }) {
    if (
      !title ||
      typeof title !== "string" ||
      title.trim() === "" ||
      !description ||
      typeof description !== "string" ||
      description.trim() === "" ||
      typeof price !== "number" ||
      price <= 0 ||
      typeof status !== "boolean" ||
      !thumbnail ||
      typeof thumbnail !== "string" ||
      thumbnail.trim() === "" ||
      typeof stock !== "number" ||
      stock <= 0 ||
      !category ||
      typeof category !== "string" ||
      category.trim() ===""
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
    const id = faker.string.uuid();
    const newProduct = {
      id,
      title,
      description,
      price,
      status,
      thumbnail,
      stock,
      category
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
