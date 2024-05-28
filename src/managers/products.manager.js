//LIBRERIAS
import fs from 'fs'

//CLASES
class ProductManager {

    constructor(path){
        this.path = path
    }

    #ids_almacenados = this.traer_todos_id()

    traer_todos_id(){
        if(fs.existsSync(this.path)){
            const productos = fs.readFileSync(this.path, 'utf-8')
            return productos.map(objeto => objeto.id)
        }else{
            return []
        }
    }

    crear_id_unico(){
        let mientras = true
        let id_unico = undefined
        let numero_random = Math.floor(Math.random() * 30) + 1
        while(mientras === true){
            if(this.#ids_almacenados.includes(numero_random)){
                numero_random = Math.floor(Math.random() * 30) + 1
            }else{
                id_unico = numero_random
                mientras = false
            }
        }
        if(id_unico !== undefined){
            this.#ids_almacenados.push(id_unico)
            return id_unico
        }else{
            console.log(`ERROR! En el metodo "crear_id_unico()" de la clase ProductManager se llego al limite de ID aleatoreos. Incremente el margen.`)
            return undefined
        }
    }

    traer_productos(){
        if(fs.existsSync(this.path)){
            let archivo_productos = fs.readFileSync(this.path, 'utf-8')
            if(archivo_productos.trim().length === 0){
                console.log(`El archivo ${this.path} esta vacio.`)
                return []
            }else{
                const productos = JSON.parse(archivo_productos)
                console.log(`Acceso a la DB con exito.`)
                return productos
            }
        }else{
            fs.writeFileSync(this.path, JSON.stringify([], null, 2))
            console.log(`ERROR! En el metodo "traer_productos()" de la clase ProductManager no se encontro la BD en la ruta: ${this.path}. Se creara un directorio con esta ruta.`)
            return []
        }
    }

    traer_producto_por_id(id_prod){
        const productos = this.traer_productos()
        if(productos.length !== 0){
            const producto = productos.find(objeto => objeto.id === id_prod)
            if(producto){
                console.log(`Producto encontrado con exito.`)
                return producto
            }else{
                console.log(`ERROR! En el metodo "traer_producto_por_id()" de la clase ProductManager no se encontro ningun producto con el id: ${id_prod}.`)
                return {}
            }
        }else{
            console.log(`ERROR! En el metodo "traer_producto_por_id()" de la clase ProductManager la DB esta vacia.`) 
            return {}
        }
 
    }

    eliminar_producto(id_prod){
        const productos = this.traer_productos()
        if(productos.length !== 0){
            const producto = productos.find(objeto => objeto.id === id_prod)
            if(producto){
                this.#ids_almacenados = this.#ids_almacenados.filter(almacenado => almacenado !== id_prod)
                const productos_actualizados = productos.filter(objeto => objeto.id !== id_prod)
                fs.writeFileSync(this.path, JSON.stringify(productos_actualizados, null, 2))
                console.log(`El producto con id ${id_prod} se a eliminado correctamente y la DB a sido actualizada.`)
            }else{
                console.log(typeof id_prod)
                console.log(`ERROR! En el metodo "eliminar_prooducto()" de la clase ProductManager no se encontro ningun producto con el id: ${id_prod}.`)
            }
            return producto
        }else{
            return {}
        }
    }

    agregar_producto(producto_parametro){
        if(producto_parametro.hasOwnProperty('price') && typeof producto_parametro.price === 'string'){
            console.log('El producto ingresado tiene un campo price incorrecto, se corregira provisoriamente.')
            producto_parametro.price = 0
        }
        if(producto_parametro.hasOwnProperty('stock') && typeof producto_parametro.stock === 'string'){
            console.log('El producto ingresado tiene un campo stock incorrecto, se corregira provisoriamente.')
            producto_parametro.stock = 0
        }
        if(producto_parametro.hasOwnProperty('status') && typeof producto_parametro.status !== 'boolean'){
            console.log('El producto ingresado tiene un campo status incorrecto, se corregira provisoriamente.')
            producto_parametro.status = true
        }
        const producto_nuevo = {
            title: producto_parametro.title + '' || 'sin titulo',
            description: producto_parametro.description + '' || 'sin descripcion',
            code: producto_parametro.code + '' || 'sin code',
            price: producto_parametro.price || 0,
            status: producto_parametro.status || true,
            stock: producto_parametro.stock || 0,
            category: producto_parametro.category + '' || 'sin categoria',
            thumbnail: [producto_parametro.thumbnail] || []
        }
        const id_unico = this.crear_id_unico()
        if(id_unico !== undefined){
            producto_nuevo.id = id_unico
            let productos = this.traer_productos()
            productos.push(producto_nuevo)
            fs.writeFileSync(this.path, JSON.stringify(productos, null, 2))
            console.log(`Se agrego correctamente el producto a la BD.`)
            return producto_nuevo
        }else{
            console.log(`ERROR! En el metodo "agregar_producto()" de la clase ProductManager se obtuvo el id "undefined". No se agregara el producto hasta que no se solucione el limite de id's`)
            return producto_nuevo   
        }
    }

    modificar_objeto_producto(objeto_producto, campos_nuevos){
        for(const campo in campos_nuevos){
            if(objeto_producto.hasOwnProperty(campo)){
                if((campo === 'stock' || campo === 'price') && (typeof campos_nuevos[campo] === 'string')){
                    campos_nuevos[campo] = 0
                    console.log('Los datos ingresados tienen un campo incorrecto, se corregira provisoriamente.')
                }
                objeto_producto[campo] = campos_nuevos[campo]
            }
        }
        return objeto_producto
    }

    actualizar_producto(id_prod, campos_nuevos){
        const productos = this.traer_productos()
        if(productos.length !== 0){
            const posicion_producto = productos.findIndex(objeto => objeto.id === id_prod)
            if(posicion_producto !== -1){
                productos[posicion_producto] = this.modificar_objeto_producto(productos[posicion_producto], campos_nuevos)
                fs.writeFileSync(this.path, JSON.stringify(productos, null, 2))
                console.log(`El producto con id: ${id_prod} se actualizo correctamente. BD actualizada.`)
                return productos.find(objeto => objeto.id === id_prod)
            }else{
                console.log(`ERROR! En el metodo "actualizar_producto()" de la clase ProductManager no se encontro ningun producto con el id: ${id_prod}.`)
                return {}
            }
        }else{
            return {}
        }
    }
}
//INSTANCIA DE CLASE
const productsManager = new ProductManager('../src/files/productos.json')

//EXPORT DEL MANAGER
export default productsManager