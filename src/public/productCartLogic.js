document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.boton-agregar-carrito')

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.target.closest('.card').querySelector('.elementos-ocultos').textContent.trim()
            const cartId = '66725536869112b9b4d3ff76'; // ID del carrito, reemplazar con el ID correcto
            
            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: 1 })
                });

                const data = await response.json()

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto agregado al carrito!',
                        text: `El producto ha sido agregado al carrito con éxito.`
                    })
                    console.log(data)
                } else {
                    console.error('Error al agregar el producto:', data.error)
                }
            } catch (error) {
                console.error('Error al agregar el producto:', error)
            }
        })
    })
})
