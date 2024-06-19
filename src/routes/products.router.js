//IMPORTS
import { Router } from 'express';
import product_model from '../DAO/models/products.model.js'
import { validar_campos } from '../controllers/products.controller.js';
//CONSTANTES
const router = Router()
//test de mongoose
router.get('/prueba', async (req, resp)=>{
    try{
        const productos_mongoose = await product_model.find().exec()
        resp.send({productos_mongoose})
    }catch(error){
        console.log('Error en Router products: GET /prueba-> traer todos los productos ')
    }
})
//traer todos los productos
router.get('/', async (req, res)=>{
    try{
        const { limit = 10, page = 1, sort, query } = req.query

        const filtro = query ? { 'category': query } : {}
        //'category' para categorias (me gusta mas)
        //'status' para disponibilidad

        let ordenamiento = {}

        if(sort) ordenamiento.price = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null

        const response = await product_model.paginate(filtro, { page, limit, sort: ordenamiento })

        const nextLink = response.hasNextPage ? `http://localhost:8080/products?page=${response.nextPage}` : null
        const prevLink = response.hasPrevPage ? `http://localhost:8080/products?page=${response.prevPage}` : null

        res.status(200).json({
            status: 'success',
            payload: response.docs,
            totalPages: response.totalDocs,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page,
            hasNextPage: response.hasNextPage,
            hasPrevPage: response.hasPrevPage,
            prevLink,
            nextLink
        })

    }catch(error){
        console.log('Error en Router products: GET -> traer todos los productos ')
        console.log(error)
        res.status(500).json({ status: 'error' })
    }
})
//traer producto por id
router.get('/:pid', async (req, res)=>{
    try{
        const id_producto = req.params.pid
        const producto_buscado = await product_model.findById(id_producto)
        if(!producto_buscado){
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
        const { title, description, code, price, stock, category, thumbnail, status } = req.body

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Error! Uno de los campos es incorrecto o no a sido ingresado.' })
        }

        const info_producto = {
            title,
            description,
            code,
            price: parseInt(price),
            stock: parseInt(stock),
            category,
            status: status !== undefined ? status : true,
            thumbnail: thumbnail ? [thumbnail] : []
        }

        const producto_nuevo = await product_model.create(info_producto)

        res.json(info_producto)

    }catch(error){
        console.log('Error en Router products: POST -> agregar un producto ')
        res.status(500).json({ error_code: error })
    }
})
//modificar un producto
router.put('/:pid', async (req, res)=>{
    try{
        const id_producto = req.params.pid
        const campos_nuevos = req.body
        
        if(!validar_campos(Object.keys(campos_nuevos))){
            return res.status(404).json({ msg: 'Campos invalidos.' })

        }else{
            const producto_modificado = await product_model.findByIdAndUpdate(id_producto, campos_nuevos)
            res.json(producto_modificado)
        }

    }catch(error){
        console.log('Error en Router products: PUT -> modificar un producto ')
        res.status(500).json({ error_code: error })
    }
})
//eliminar un producto
router.delete('/:pid', async (req, res)=>{
    try{
        const id_producto = req.params.pid
        const producto_eliminado = await product_model.findByIdAndDelete(id_producto)

        if (!producto_eliminado) {
            return res.status(404).json({ msg: 'Producto no encontrado.' })

        }else{
            res.json({ msg: 'Producto eliminado correctamente.', producto: producto_eliminado })

        }
        
    }catch(error){
        console.log('Error en Router products: DELETE -> eliminar un producto ')
        res.status(500).json({ error_code: error })
    }
})
//EXPORTACIONs
export default router