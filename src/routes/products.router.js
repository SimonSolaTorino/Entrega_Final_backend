//IMPORTS
import { Router } from 'express';
import productsManager from '../managers/products.manager.js';
//CONSTANTES
const router = Router()
//traer todos los productos
router.get('/', async (req, res)=>{
    try{
        const array_productos = await productsManager.traer_productos()
        res.json(array_productos)

    }catch(error){
        console.log('Error en Router products: GET -> traer todos los productos ')
        res.status(500).json({ error_code: error })
    }
})
//traer producto por id
router.get('/:pid', async (req, res)=>{
    try{
        const id_producto = parseInt(req.params.pid)
        const producto_buscado = await productsManager.traer_producto_por_id(id_producto)
        if(producto_buscado == {}){
            res.json({msg: `no hay producto con el id ${id_producto}`})
        }else{
            res.json(producto_buscado)
        }

    }catch(error){
        console.log('Error en Router products: GET -> traer producto por id ')
        res.status(500).json({ error_code: error })
    }

})
//agregar un producto
router.post('/', async (req, res)=>{
    try{
        const objeto_a_agregar = req.body
        const producto_nuevo = await productsManager.agregar_producto(objeto_a_agregar)
        res.json(producto_nuevo) 

    }catch(error){
        console.log('Error en Router products: POST -> agregar un producto ')
        res.status(500).json({ error_code: error })
    }
})
//modificar un producto
router.put('/:pid', async (req, res)=>{
    try{
        const id_producto = parseInt(req.params.pid)
        const campos_nuevos = req.body
        const producto_modificado = await productsManager.actualizar_producto(id_producto, campos_nuevos)
        res.json(producto_modificado)
    }catch(error){
        console.log('Error en Router products: PUT -> modificar un producto ')
        res.status(500).json({ error_code: error })
    }
})
//eliminar un producto
router.delete('/:pid', async (req, res)=>{
    try{
        const id_producto = parseInt(req.params.pid)
        const producto_eliminado = await productsManager.eliminar_producto(id_producto)
        res.json(producto_eliminado)
    }catch(error){
        console.log('Error en Router products: DELETE -> eliminar un producto ')
        res.status(500).json({ error_code: error })
    }
})
//EXPORTACIONs
export default router