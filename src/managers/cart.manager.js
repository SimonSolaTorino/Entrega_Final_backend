//LIBRERIA
import fs from 'fs'

//CLASE
class CartManager {

    constructor(path){
        this.path=path
    }

    #ids_almacenados = this.traer_todos_id()

    traer_todos_id(){
        if(fs.existsSync(this.path)){
            const carritos = fs.readFileSync(this.path, 'utf-8')
            return carritos.map(objeto => objeto.id)
        }else{
            return []
        }
    }

    crear_id_unico(){
        let mientras = true
        let id_unico = undefined
        let id_random = 'cartid_' + Math.floor(Math.random() * 30) + 1
        while(mientras === true){
            if(this.#ids_almacenados.includes(id_random)){
                id_random = 'cartid_' + Math.floor(Math.random() * 30) + 1
            }else{
                id_unico = id_random
                mientras = false
            }
        }
        if(id_unico !== undefined){
            this.#ids_almacenados.push(id_unico)
            return id_unico
        }else{
            console.log(`ERROR! En el metodo "crear_id_unico()" de la clase CartManager se llego al limite de ID aleatoreos. Incremente el margen.`)
            return undefined
        }
    }

    traer_carritos(){
        if(fs.existsSync(this.path)){
            const archivo_carrito = fs.readFileSync(this.path, 'utf-8')
            if(archivo_carrito.trim().length === 0){
                console.log(`El archivo ${this.path} esta vacio.`)
                return []
            }else{
                const carritos = JSON.parse(archivo_carrito)
                console.log(`Acceso a la DB con exito.`)
                return carritos
            }
        }else{
            fs.writeFileSync(this.path, JSON.stringify([], null, 2))
            console.log(`ERROR! En el metodo "traer_carritos() de la clase CartManager no se encontro la BD en la ruta: ${this.path}. Se creara un directorio con esta ruta.`)
            return []
        }
    }
    
    crear_carrito(){
        const carrito_nuevo = {
            id_carrito:this.crear_id_unico(),
            products:[]
        }
        const carritos = this.traer_carritos() //o [...] o []
        carritos.push(carrito_nuevo)
        fs.writeFileSync(this.path, JSON.stringify(carrito_nuevo, null, 2))
        console.log('Carrito creado con exito!')
        return carrito_nuevo
    }

    traer_carrito_por_id(id_cart){
        const carritos = this.traer_carritos()
        if(carritos.length > 0){
            const carrito = carritos.find(objeto => objeto.id_carrito === id_cart)
            if(carrito){
                console.log(`Carrito encontrado con exito.`)
                return carrito
            }else{
                console.log(`ERROR! En el metodo "traer_carrito_por_id()" de la clase CartManager no se encontro ningun carrito con el id: ${id_cart}.`)
                return {}
            }
        }else{
            console.log(`ERROR! En el metodo "traer_carrito_por_id()" de la clase CartManager la DB esta vacia.`) 
            return {}
        }
    }

    agregar_productos_carrito(id_cart, id_prod){
        const carrito = this.traer_carrito_por_id(id_cart)
        if(carrito){
            const productos_almacenados = carrito.products
            const producto  = productos_almacenados.find(objeto => objeto.product === id_prod)
            if(producto){
                producto.quantity += 1
            }else{
                productos_almacenados.push({product: id_prod, quantity: 1})
            }
            carrito.products = productos_almacenados
            console.log(`El producto con id ${id_prod} se agrego correctamente al carrito con id ${id_cart}`)
            const carritos = this.traer_carritos()
            const nuevo_carritos = carritos.filter(obj => obj.id_carrito !== id_cart)
            nuevo_carritos.push(carrito)
            fs.writeFileSync(this.path, JSON.stringify(nuevo_carritos, null, 2))
            return nuevo_carritos
        }else{
            console.log(`ERROR! En el metodo "agregar_productos_carrito() de la clase CartManager no se encontro ningun carrito con id: ${id_cart} para agregar productos.`)
            return {}
        }
    }
    
    traer_productos_de_carrito_por_id(id_cart){
        const carritos = this.traer_carritos()
        if(carritos.length > 0){
            const carrito = carritos.find(objeto => objeto.id_carrito === id_cart)
            if(carrito){
                console.log(`Carrito encontrado con exito.`)
                return carrito.products
            }else{
                console.log(`ERROR! En el metodo "traer_productos_de_carrito_por_id()" de la clase CartManager no se encontro ningun carrito con el id: ${id_cart}.`)
                return []
            }
        }else{
            console.log(`ERROR! En el metodo "traer_productos_de_carrito_por_id()" de la clase CartManager la DB esta vacia.`) 
            return []
        }
    }

    eliminar_carrito(id_cart){
        const carritos = this.traer_carrito_por_id(id_cart)
        if(carritos.length !== 0){
            const carrito = carritos.find(objeto => objeto.id_carrito === id_cart)
            if(carrito){
                this.#ids_almacenados = this.#ids_almacenados.filter(almacenado => almacenado !== id_cart)
                const carritos_actualizados = carritos.filter(objeto => objeto.id_carrito !== id_cart)
                fs.writeFileSync(this.path, JSON.stringify(carritos_actualizados, null, 2))
                console.log(`El carrito con id ${id_cart} se a eliminado correctamente y la DB a sido actualizada.`)
            }else{
                console.log(`ERROR! En el metodo "eliminar_carrito()" de la clase CartManager no se encontro ningun carrito con el id: ${id_cart}.`)
            }
            return false
        }else{
            return false
        }
    }
}

//INSTANCIA DE CLASE
const cartManager = new CartManager('../src/files/carrito.json')

//EXPORT DEL MANAGER
export default cartManager