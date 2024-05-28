import { Router } from "express";
import productsManager from '../managers/products.manager.js';

const router = Router()

router.get('/', (req, resp)=>{
    const products = productsManager.traer_productos()
    resp.render('home', { products })
})

router.get('/realtimeproducts', (req, resp)=>{
    //no le paso productos porque los traigo desde websocket
    
    resp.render('realtimeproducts')
})

export default router