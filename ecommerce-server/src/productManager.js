const fs = require("fs");
const { faker } = require(`@faker-js/faker`);
const path = require("path");

class ProductManager {
  constructor(filename) {
    this.path = path.join(__dirname, filename); // Forzar uso dentro de src
    console.log("Ruta del archivo product.json:", this.path);

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
  console.log("Archivo actualizado correctamente.", this.products);
  } catch (error){
    console.error(`Error al guardar el archivo: ${error.message}`);
  }
  }

  addProduct({ title, description, price, status, thumbnail, stock, category }) {
    if (
      !title || typeof title !== "string" || title.trim() === "" ||
      !description || typeof description !== "string" || description.trim() === "" ||
      typeof price !== "number" || price <= 0 ||
      typeof status !== "boolean" ||
      !thumbnail || typeof thumbnail !== "string" || thumbnail.trim() === "" ||
      typeof stock !== "number" || stock <= 0 ||
      !category || typeof category !== "string" || category.trim() === ""
    ) {
      console.error("Producto no agregado: Todos los campos son obligatorios y deben ser válidos.");
      return null;
    }

    if (id && this.products.some(product => product.id === id)) {
      console.error(`Error: Producto con ID ${id} ya existe.`);
      return null;
    }

    const productId = id || faker.string.uuid();

    const newProduct = {
      id: productId,
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
    return newProduct; 
}

getProducts() {
  try {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data); 
  } catch (error) {
      console.error("Error leyendo productos:", error);
      return [];
  }
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

    if (typeof updatedProduct.stock !== "number" || updatedProduct.stock < 0) {
      console.error("El stock no puede ser negativo.");
      return;
    }

    this.products[productIndex] = updatedProduct;
    this.saveToFile();
    console.log(`Producto con ID ${id} actualizado.`);
  }
  deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
        console.error(`Producto con ID ${id} no encontrado.`);
        return false; // Indicar que no se encontró el producto
    }

    this.products.splice(productIndex, 1); // Eliminar producto
    this.saveToFile(); // Guardar cambios en el archivo

    console.log(`Producto con ID ${id} eliminado.`);
    return true; // Indicar éxito en la eliminación
}

}

const productManager = new ProductManager("products.json");

const result = productManager.deleteProduct("3d7eaed4-ec69-48bb");
console.log("Resultado de la eliminación:", result);


module.exports = ProductManager;
