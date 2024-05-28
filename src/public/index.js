const socket = io()
//RECEPCION Y EMICION DE SOCKETS
/*traer productos y mostrarlos*/
socket.on('productos', (productos_DB)=>{
    const productos_container = document.querySelector('.product-container')
    productos_container.innerHTML = ''; // para dejarlo limpio
    productos_DB.forEach(producto => {
        const nuevo_div = document.createElement('div')
        nuevo_div.classList.add('product-row')
        nuevo_div.setAttribute('data-id', producto.id)
        nuevo_div.innerHTML = `
            <div class="product-image">
                <img src="${producto.thumbnail.length > 0 ? producto.thumbnail[0] : 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'}" alt="imagen-realtimeproducts">
            </div>
            <div class="product-details">
                <h2 class="realtime-title">${producto.title}</h2>
                <p class="realtime-price">$${producto.price}</p>
                <p class="realtime-stock">Stock: ${producto.stock}</p>
                <p class="realtime-text">${producto.description}</p>
            </div>
            <div class="product-action">
                <button class="delete-btn">X</button>
            </div>
        `;
        productos_container.appendChild(nuevo_div);
    })
})
/*traer producto y agregarlo*/
socket.on('nuevoProducto', (producto) => {
    const productos_container = document.querySelector('.product-container')
    const nuevo_div = document.createElement('div')
    nuevo_div.classList.add('product-row')
    nuevo_div.setAttribute('data-id', producto.id)
    nuevo_div.innerHTML = `
        <div class="product-image">
            <img src="${producto.thumbnail.length > 0 ? producto.thumbnail[0] : 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'}" alt="imagen-realtimeproducts">
        </div>
        <div class="product-details">
            <h2 class="realtime-title">${producto.title}</h2>
            <p class="realtime-price">$${producto.price}</p>
            <p class="realtime-stock">Stock: ${producto.stock}</p>
            <p class="realtime-text">${producto.description}</p>
        </div>
        <div class="product-action">
            <button class="delete-btn">X</button>
        </div>
    `;
    productos_container.insertBefore(nuevo_div, productos_container.firstChild)
})
/*eliminar un producto del dom*/
socket.on('producto_eliminado', (id_prod) => {
    const producto_row = document.querySelector(`.product-row[data-id="${id_prod}"]`)
    if (producto_row) {
        producto_row.remove()
    }
})

//SWEETALERT AGREGAR PRODUCTO
const sweetalert_agregar = async () => {
    const { value: valores_form } = await Swal.fire({
        title: 'Ingresa los datos del nuevo producto!',
        html:
            '<input id="title" class="swal2-input" placeholder="Título">' +
            '<input id="description" class="swal2-input" placeholder="Descripción">' +
            '<input id="code" class="swal2-input" placeholder="Código">' +
            '<input id="price" type="number" class="swal2-input" placeholder="Precio">' +
            '<input id="stock" type="number" class="swal2-input" placeholder="Stock">' +
            '<input id="category" class="swal2-input" placeholder="Categoría">' +
            '<input id="thumbnail" class="swal2-input" placeholder="URL del Thumbnail">',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
            const title = Swal.getPopup().querySelector('#title').value
            const description = Swal.getPopup().querySelector('#description').value
            const code = Swal.getPopup().querySelector('#code').value
            const price = Swal.getPopup().querySelector('#price').value
            const stock = Swal.getPopup().querySelector('#stock').value
            const category = Swal.getPopup().querySelector('#category').value
            const thumbnail = Swal.getPopup().querySelector('#thumbnail').value
            return {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnail
            }
        },
        allowOutsideClick: false
    })
    return valores_form
}

//LISTENERS
/*agregar producto*/
document.addEventListener('DOMContentLoaded', () => {
    const boton_agregar_prod = document.querySelector('.boton-agregar-producto')

    if (boton_agregar_prod) {
        boton_agregar_prod.addEventListener('click', async () => {
            const prod_ingresado = await sweetalert_agregar()
            if (prod_ingresado) {
                socket.emit('producto_agregado', prod_ingresado)
            }
        })
    }
})
/*eliminar producto*/
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const producto_row = event.target.closest('.product-row')
        const id_prod = producto_row.getAttribute('data-id')
        socket.emit('eliminar_producto', id_prod)
    }
})