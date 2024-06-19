//IMPORTS
import { Router } from 'express';
import cart_model from '../DAO/models/carts.model.js';
import product_model from '../DAO/models/products.model.js';
import { total_de_carrito } from '../controllers/cart.controller.js';
//CONSTANTES
const router = Router()
//crear carrito
router.post('/', async (req, res)=>{
    try{
        const carrito_nuevo = await cart_model.create({ products: [] })
        res.json(carrito_nuevo)
    }catch(error){
        console.log('Error en Router cart: POST -> crear carrito ')
        res.status(500).json({ error_code: error })
    }
})
//traer carrito por id
router.get('/:cid', async (req, res)=>{
    try{
        const id_carrito = req.params.cid
        const carrito = await cart_model.findById(id_carrito).populate("products.product")
        if (!carrito) {
            return res.status(404).json({ msg: `No se encontró carrito con ID ${id_carrito}` })
        }else{
            res.json(carrito)    
        }
        
    }catch(error){
        console.log('Error en Router cart: GET -> traer carrito por id ')
        res.status(500).json({ error_code: error })
    }
})
//vaciar carrito
router.delete('/:cid', async (req, res)=>{
    try{
        const id_carrito = req.params.cid
        const carrito = await cart_model.findByIdAndUpdate(id_carrito, { products: [] })
        
        if (!carrito) {
            return res.status(404).json({ msg: `Carrito con id ${id_carrito} no encontrado.` })
        }

        res.status(200).json({ msg: 'Carrito vaciado correctamente.', carrito })  
        
    }catch(error){
        console.log('Error en Router cart: DELETE -> vaciar carrito')
        res.status(500).json({ error_code: error })

    }
})
//agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res)=>{
    try{
        const id_carrito = req.params.cid
        const id_producto = req.params.pid
        const quantity = parseInt(req.body.quantity)

        const producto = await product_model.findById(id_producto)
        const carrito = await cart_model.findById(id_carrito)
        
        if (!carrito) {
            return res.status(404).json({ msg: `Carrito con id ${id_carrito} no encontrado.` })
        }
        
        if (!producto) {
            return res.status(404).json({ msg: `Producto con id ${id_producto} no encontrado.` })
        }
                
        let producto_en_carrito = carrito.products.find(item => item.product.toString() === id_producto)
                
        if (producto_en_carrito) {
            producto_en_carrito.quantity += quantity
        }else{
            carrito.products.push({
                product: id_producto,
                quantity: quantity})
        }
            
        const carrito_actualizado = await carrito.save()
        res.status(200).json({ msg: 'Producto agregado al carrito!', carrito_actualizado })
    
    }catch(error){
        console.log('Error en Router cart: POST -> agregar un producto al carrito')
        res.status(500).json({ error_code: error })
    }
})
//actualizar la cantidad de un producto del carrito
router.put('/:cid/product/:pid', async (req, res)=>{
    try{
        const id_carrito = req.params.cid
        const id_producto = req.params.pid
        const quantity = parseInt(req.body.quantity)

        const producto = await product_model.findById(id_producto)
        const carrito = await cart_model.findById(id_carrito)

        if (!carrito) {
            return res.status(404).json({ msg: `Carrito con id ${id_carrito} no encontrado.` })
        }
        
        if (!producto) {
            return res.status(404).json({ msg: `Producto con id ${id_producto} no encontrado.` })
        }
                
        let producto_en_carrito = carrito.products.find(item => item.product.toString() === id_producto)
                
        if (producto_en_carrito) {
            producto_en_carrito.quantity = quantity
        }else{
            carrito.products.push({
                product: id_producto,
                quantity: quantity})
        }
            
        const carrito_actualizado = await carrito.save()
        res.status(200).json({ msg: 'Producto agregado al carrito!', carrito_actualizado })

    }catch(error){
        console.log('Error en Router cart: PUT -> actualizar la cantidad de un producto del carrito')
        res.status(500).json({ error_code: error })
    }
})
// Eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const id_carrito = req.params.cid
        const id_producto = req.params.pid

        const carrito = await cart_model.findById(id_carrito)
        carrito.products = carrito.products.filter(item => item.product.toString() !== id_producto)
        await carrito.save()
        const nuevo_carrito = await cart_model.findById(id_carrito).populate('products.product').lean()
        const total_price = total_de_carrito(nuevo_carrito.products)

        res.status(200).json({ msg: 'Producto eliminado del carrito', carrito, total_price })
    } catch (error) {
        console.log('Error en Router cart: DELETE -> eliminar un producto del carrito')
        res.status(500).json({ error_code: error })
    }
})
//EXPORTACION
export default router