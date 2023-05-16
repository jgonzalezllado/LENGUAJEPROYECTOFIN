const form = document.getElementById('formulario');
const addBtn = document.getElementById('btn-add');
const consultarBtn = document.getElementById('btn-consultar');
const resultados = document.getElementById('resultados');
const consultarTodoBtn = document.getElementById('btn-consultar-todo');
const tablaInventario = document.getElementById('tabla-inventario');
const apiUrl = 'http://localhost:3000/productos';

addBtn.onclick = function() {
  const data = {
    nombre: form.nombre.value,
    descripcion: form.descripcion.value,
    precio: form.precio.value,
    cantidad: form.cantidad.value
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(json => {
    resultados.textContent = 'Producto añadido con éxito:\n' + JSON.stringify(json);
    form.reset();
  })
  .catch(error => {
    resultados.textContent = 'Error al añadir producto: ' + error.message;
  });
};

consultarBtn.onclick = function() {
  const nombre = document.getElementById('nombre-consultar').value;
  fetch(`${apiUrl}?nombre=${nombre}`)
    .then(response => response.json())
    .then(json => {
      const tbody = tablaInventario.querySelector('tbody');
      tbody.innerHTML = ''; // Elimina filas anteriores (si las hay)
      json.forEach(producto => {
        const fila = tbody.insertRow();
        const celdaNombre = fila.insertCell();
        const celdaDescripcion = fila.insertCell();
        const celdaPrecio = fila.insertCell();
        const celdaCantidad = fila.insertCell();
        const celdaEliminar = fila.insertCell();
        celdaNombre.textContent = producto.nombre;
        celdaDescripcion.textContent = producto.descripcion || '';
        celdaPrecio.textContent = producto.precio;
        celdaCantidad.textContent = producto.cantidad;
        const btnEliminar = document.createElement('button'); // Creamos el botón
        btnEliminar.textContent = 'Eliminar'; // Asignamos el texto al botón
        btnEliminar.onclick = function() { // Agregamos el evento onclick
          eliminarProducto(producto.id);
        };
        celdaEliminar.appendChild(btnEliminar); // Agregamos el botón a la celda
      
      });
    })
    .catch(error => {
      console.error('No se ha encontrado el producto:', error);
      alert('No se ha encontrado el producto. Intente de nuevo más tarde.');
    });
};


consultarTodoBtn.onclick = function() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(json => {
      const tbody = tablaInventario.querySelector('tbody');
      tbody.innerHTML = ''; // Elimina filas anteriores (si las hay)
      json.forEach(producto => {
        const fila = tbody.insertRow();
        const celdaNombre = fila.insertCell();
        const celdaDescripcion = fila.insertCell();
        const celdaPrecio = fila.insertCell();
        const celdaCantidad = fila.insertCell();
        const celdaEliminar = fila.insertCell(); // Agregamos celda para eliminar
        celdaNombre.textContent = producto.nombre;
        celdaDescripcion.textContent = producto.descripcion || '';
        celdaPrecio.textContent = producto.precio;
        celdaCantidad.textContent = producto.cantidad;
        const btnEliminar = document.createElement('button'); // Creamos el botón
        btnEliminar.textContent = 'Eliminar'; // Asignamos el texto al botón
        btnEliminar.onclick = function() { // Agregamos el evento onclick
          eliminarProducto(producto.id);
        };
        celdaEliminar.appendChild(btnEliminar); // Agregamos el botón a la celda
      });
    })
    .catch(error => {
      console.error('Error al consultar inventario:', error);
      alert('No se pudo consultar el inventario. Intente de nuevo más tarde.');
    });
};

function eliminarProducto(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(json => {
    resultados.textContent = 'Producto eliminado con éxito:\n' + JSON.stringify(json);
    consultarTodoBtn.click(); // Actualizamos la tabla
    consultarBtn.click();
  })
  .catch(error => {
    resultados.textContent = 'Error al eliminar producto: ' + error.message;
  });
}
