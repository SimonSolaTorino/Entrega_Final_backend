//IMPORTS
import { Router } from 'express';
import cartManager from '../DAO/managers/cart.manager.js';
//CONSTANTES
const router = Router()
//crear carrito
router.post('/', async (req, res)=>{
    try{
        const carrito_nuevo = await cartManager.crear_carrito()
        res.json(carrito_nuevo)
    }catch(error){
        console.log('Error en Router cart: POST -> crear carrito ')
        res.status(500).json({ error_code: error })
    }
})
//traer productos de un carrito por id
router.get('/:cid', async (req, res)=>{
    try{
        const id_carrito = req.params.cid
        const productos_de_carrito_buscado = await cartManager.traer_productos_de_carrito_por_id(id_carrito)
        res.json(productos_de_carrito_buscado) //devolvemos solo el [] de products:[] de un carrito
     }catch(error){
        console.log('Error en Router cart: GET -> traer productos de un carrito por id')
        res.status(500).json({ error_code: error })
    }
})
//agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res)=>{
    try{
        const id_carrito = req.params.cid
        const id_producto = parseInt(req.params.pid)
        const carrito_nuevo = await cartManager.agregar_productos_carrito(id_carrito, id_producto)
        res.json(carrito_nuevo)
    }catch(error){
        console.log('Error en Router cart: POST -> agregar un producto al carrito')
        res.status(500).json({ error_code: error })
    }
})
//EXPORTACION
export default router