//PROCESO DE TESTING
//1. Se crea una instancia de la clase "ProductManager"
class ProductManager {
    constructor() { //aquí inicia la construcción de los métodos y funciones que se van a utilizar para generar los objetos)
      this.products = []; // Las llaves cerradas indican que es un arreglo vacío y ahí es donde se van a almacenar los datos
      this.currentCode = 1; // Con esta función se define el código identificador inicial
    }
  
    // El método addProduct sirve como modelo que contiene las propiedades de los objetos que se van a crear
    addProduct({ title, description, price, thumbnail, stock }) {
      // Con esta función se valida que todos los campos estén presentes, (! significa que no está o es contrario, || es or -o-)
      if (!title || !description || !price || !thumbnail || !stock) {
        console.error (" Producto no agregado: todos los campos son obligatorios.");
        return; //si no ocurre el error se muestra el objeto añadido
      }
  
      // Con este método se valida que no se repita un producto (en este caso verificando si el título y la descripción ya existen en otro objeto)
      const exists = this.products.some(
        (product) => product.title === title && product.description === description
      );
      if (exists) {
        console.error("Error: Producto duplicado.");
        return;
      }
  
      // Con esta función se definen las propiedades del nuevo objeto
      const newProduct = {
        
        title,
        description,
        price,
        thumbnail,
        code: this.currentCode++, // Con esta función se incrementa automáticamente el código identificador
        stock,
      };
  
      // Con este método se agrega el producto al arreglo
      this.products.push(newProduct);
    }
  
    // Con este método se obtienen todos los objetos creados hasta ese momento
    getProducts() {
      console.log ("Productos agregados: ")
      return this.products;
      
    }
  
    // Con este método se busca un producto por código
    getProductById(code) {
      const product = this.products.find((product) => product.code === code);
      if (!product) {
        console.error("Estatus del producto: Not found");
        return null;
      }
      console.log ("Producto localizado: ")
      return product;
    }
  }
  // hasta aquí termina el constructor (en este caso)

  //aquí se comienzan a construir los nuevos objetos (productos)
  const manager = new ProductManager();
  //PROCESO DE TESTING
  // 2. Se llamará "getProducts" recién creada la instancia, debe devolver un arreglo vacío []
  console.log(manager.getProducts());
// PROCESO DE TESTING
  // 3. Se llamará al método "addProduct" con los siguientes campos:
  manager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    stock: 25,
  }
);
//PROCESO DE TESTING
//4. El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
//5. Se llamará el método "getProducts" nuevamente, esta vez debe aparecer el producto recién agregado
console.log( manager.getProducts());

 //PROCESO DE TESTING
 //6. Se llamará al método "addProduct" con los mismos campos de arriba, debe arrojar un error porque el código estará repetido. 
  manager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    stock: 25,
  });
  console.log(manager.getProducts());

  // Se intenta añadir un producto sin el campo "descripción" para que genere error y no lo añada al arreglo
  manager.addProduct({
    title: "Producto prueba 2",
    description: "",
    price: 300,
    thumbnail: "sin imagen",
    stock: 15,
  });
  
  // PROCESO DE TESTING
  //7. Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
  console.log(manager.getProductById(99));
  console.log(manager.getProductById(1)); 
  