const fs = require('fs');
const { faker } = require('@faker-js/faker');

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
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data); 
    }
  }

  saveToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }

  addProduct({ title, description, price, thumbnail, stock }) {
    if (!title || !description || !price || !thumbnail || !stock) {
      console.error("Producto no agregado: todos los campos son obligatorios.");
      return;
    }

    const exists = this.products.some(
      (product) => product.title === title && product.description === description
    );
    if (exists) {
      console.error("Error: Producto duplicado.");
      return;
    }

    // Generar ID único con Faker
    const newProduct = {
      id: faker.datatype.uuid(),
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
    console.log("Productos agregados:");
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.error("Estatus del producto: Not found");
      return null;
    }
    console.log("Producto localizado:");
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

    // Prevenir cambios en el ID
    if (updatedProduct.id !== id) {
      console.error("El ID del producto no puede ser modificado.");
      return;
    }

    this.products[productIndex] = updatedProduct;
    this.saveToFile();
    console.log(`Producto con ID ${id} actualizado.`);
  }
}

const manager = new ProductManager('./products.json');

manager.addProduct({
  title: "Producto Prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  stock: 25,
});

console.log("Productos:", manager.getProducts());

const productos = manager.getProducts();
if (productos.length > 0) {
  const producto = productos[0];
  console.log("Producto encontrado:", manager.getProductById(producto.id));
} else {
  console.log("No hay productos para buscar.");
}

if (productos.length > 0) {
  const producto = productos[0];
  manager.updateProduct(producto.id, { price: 300, stock: 50 });
  console.log("Producto actualizado:", manager.getProducts());
}

module.exports = ProductManager;