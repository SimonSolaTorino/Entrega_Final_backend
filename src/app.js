//IMPORTS
import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import {__dirname} from './utils.js';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewRouter from './routes/views.router.js';
import productsManager from './managers/products.manager.js';

//CONSTANTES
const PORT = 8080
const app = express()
//EXPRESS
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//SETEAMOS EL PUBLIC
app.use(express.static(`${__dirname}/public`))
//HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

//RUTAS
//ruta productos
app.use('/api/products', productRouter)
//ruta carritos
app.use('/api/carts', cartRouter)
//ruta views
app.use('/', viewRouter)

//INICIAMOS SERVER SOCKET
const http_server = app.listen(PORT, ()=>console.log(`Escuchando el puerto ${PORT} correctamente.`))
const socket_server = new Server(http_server)
socket_server.on('connection', (socket)=>{
    console.log("usuario conectado por socket")
    /*primero obtengo los productos de la DB y los mando al cliente.*/
    let productos = productsManager.traer_productos()
    socket.emit('productos', productos)

    socket.on('producto_agregado', (nuevo_prod) => {
        /*recibo el producto nuevo del cliente*/
        let producto_agregado = productsManager.agregar_producto(nuevo_prod)
        console.log('Producto agregado a la DB')
        /*mando el producto nuevo al cliente */
        socket_server.emit('producto_agregado', producto_agregado)
    })

    socket.on('eliminar_producto', (id_prod) => {
        /*recibo el id y lo casteo a numero*/
        const id_casteado = Number(id_prod)
        /*lo elimino en la base de datos*/
        let producto_eliminado = productsManager.eliminar_producto(id_casteado)
        console.log("producto eliminado: ", producto_eliminado)
        /*"refresco" el DOM sin el producto*/
        socket_server.emit('producto_eliminado', id_casteado)
    })
})