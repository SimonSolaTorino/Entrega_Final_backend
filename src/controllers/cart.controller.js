export const total_de_carrito = (array_productos)=>{
    let total = 0
    for (const producto of array_productos){
        total += (producto.quantity * producto.product.price)
    }

    return total
}