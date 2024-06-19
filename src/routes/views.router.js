import { Router } from "express";
//import productsManager from '../DAO/managers/products.manager.js';
import product_model from "../DAO/models/products.model.js";
import cart_model from "../DAO/models/carts.model.js";
import { total_de_carrito } from "../controllers/cart.controller.js";

const router = Router()
// vista para renderizar el home
router.get('/', async (req, resp)=>{
    try {
        const products = await product_model.find().lean().exec()
        resp.render('home', { products })
    } catch (error) {
        console.log('Error en Router views: GET / -> renderizar home')
        resp.status(500).json({ error_code: error })
    }
})
// vista para renderizar /products
router.get('/products', async (req, resp)=>{
    try {
        const { page = 1, limit = 4, sort, query } = req.query

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null
        }

        
        const filtro = query ? { 'category': query } : {} //o status si es por disponibilidad
        
        //const products = await product_model.find().lean().exec()
        const response = await product_model.paginate(filtro, options)

        const { docs , totalPages, prevPage, nextPage, hasNextPage, hasPrevPage } = response

        const products = docs.map(doc => doc.toObject({ virtuals: true })) //sin esto no renderiza los productos...
        
        let prevLink = `/products?page=${prevPage}&limit=${limit}`
        let nextLink = `/products?page=${nextPage}&limit=${limit}`

        if (query) {
            prevLink += `&query=${query}`
            nextLink += `&query=${query}`
        }

        if (sort) {
            prevLink += `&sort=${sort}`
            nextLink += `&sort=${sort}`
        }


        resp.render('products', {
            products,
            totalPages,
            prevPage,
            nextPage,
            hasNextPage,
            hasPrevPage,
            prevLink: hasPrevPage ? prevLink : null,
            nextLink: hasNextPage ? nextLink : null,
            currentPage: page
        })

    } catch (error) {
        console.log('Error en Router views: GET / -> renderizar /products')
        resp.status(500).json({ error_code: error })
    }
})
// vista para renderizar /cart
router.get('/cart/:cid', async (req, resp)=>{
    try{
        const id_carrito = req.params.cid
        const carrito = await cart_model.findById(id_carrito).populate('products.product').lean() //666fed41ade3be7f741e8e8d
        const products = carrito.products
        const total_price = total_de_carrito(products)
        resp.render('cart', {products, total_price, carrito})

    }catch(error){
        console.log('Error en Router views: GET / -> renderizar /cart')
        resp.status(500).json({ error_code: error })
    }
})
// vista para renderizar el realtimeproducts
router.get('/realtimeproducts', (req, resp)=>{
    //no le paso productos porque los traigo desde websocket
    
    resp.render('realtimeproducts')
})

export default router