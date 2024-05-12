//IMPORTS
import express from 'express'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
//CONSTANTES
const PORT = 8080
const app = express()
//INICIAR SERVIDOR
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//RUTAS
/*test para ver si anda el server: app.get('/api', (req, resp)=>{resp.send('ok server')})*/
//ruta productos
app.use('/api/products', productRouter)
//ruta carritos
app.use('/api/carts', cartRouter)
//ESCUCHAMOS SERVER.
app.listen(PORT, ()=>console.log(`Escuchando el puerto ${PORT} correctamente.`))