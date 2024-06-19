export const validar_campos = (campos)=>{
    const campos_validos = ['title', 'description', 'category', 'stock', 'price', 'thumbnail', 'code', 'status']
    for (let campo of campos) {
        if (!campos_validos.includes(campo)) {
            console.log(`Error: el campo ${campo} no es valido.`)
            return false
        }
    }
    return true
}

