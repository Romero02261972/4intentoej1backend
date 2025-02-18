const socket = io();

socket.on("productos", (productos) => {
    const listaProductos = document.getElementById("listaProductos");
    listaProductos.innerHTML = "";
    productos.forEach(producto => {
        listaProductos.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${producto.title} - $${producto.price}
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${producto.id}')">Eliminar</button>
            </li>`;
    });
});

document.getElementById("formProducto").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const price = parseFloat(document.getElementById("price").value);
    
    if (!title || isNaN(price)) {
        alert("Todos los campos son obligatorios");
        return;
    }

    socket.emit("nuevoProducto", { title, price });
    document.getElementById("formProducto").reset();
});

function eliminarProducto(id) {
    socket.emit("eliminarProducto", id);
}
socket.on("error", (mensaje) => {
    alert(mensaje); 
});