import fs from "fs"

class ProductManager{
    constructor(path){
        this.path = path
        if(!fs.existsSync(this.path)){
            fs.writeFileSync(this.path,JSON.stringify([]))
        }
    }

   async addProduct(product){
        try{
            if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
                throw new Error("ERROR: TODOS LOS CAMPOS SON OBLIGATORIOS!")
            }else{
                let arrayProductos = fs.readFileSync(this.path,"utf-8")
                let productos = JSON.parse(arrayProductos)
                let id = productos.length + 1
                product.id = id
            }
            let arrProductos = fs.readFileSync(this.path,"utf-8")
            let productos = JSON.parse(arrProductos)
            productos.push(product)
            fs.writeFileSync(this.path,JSON.stringify(productos))
            console.log("PRODUCTO AGREGADO")
        }catch(error){
            console.log(error)
        }
    }

    async getProductos(){
        try{
        let arrProductos = await fs.promises.readFile(this.path,"utf-8")
        let productos = JSON.parse(arrProductos)
        return productos
        }catch(error){
            return error
        }
    }

    async getProductById(id){
        try{
            let arrProductos = await fs.promises.readFile(this.path,"utf-8")
            let productos = JSON.parse(arrProductos)
            return productos.find((product)=>product.id===id) || "Not found"
            }catch(error){
            return error
        }
    }

    async updateProduct(id,campo,dato){
        try{
            let arrProductos = await fs.promises.readFile(this.path,"utf-8")
            let productos = JSON.parse(arrProductos)
            let productoIndice = productos.findIndex((product)=>product.id===id)
            if(productoIndice === -1){
                return new Error("ERROR. PROUCTO NO ENCONTRADO")
            }else{
               productos[productoIndice][campo] = dato
               await fs.promises.writeFile(this.path,JSON.stringify(productos))
            }
            }catch(error){
            return error
        }
    }

    async deleteProduct(id){
        try{
        let arrProductos = await fs.promises.readFile(this.path,"utf-8")
        let productos = JSON.parse(arrProductos)
        let producto = productos.find((product)=>product.id===id)
        if(producto == undefined){
           console.log(new Error("ERROR. PROUCTO NO ENCONTRADO"))
        }else{
            let newProductos = productos.filter((product)=>product.id!==producto.id)
            await fs.promises.writeFile(this.path,JSON.stringify(newProductos))
            console.log("PRODUCTO ELIMINADO")
        }
        }catch(error){
            console.log(error)
        }
    }
}

let producto1 = {
    title : "Producto N°1",
    description : "Este es un producto de ejemplo",
    price : 5500,
    thumbnail : "no img",
    code : "AAA111",
    stock : 13,
}

let producto2 = {
    title : "Producto N°2",
    description : "Este es un producto de ejemplo",
    price : 21000,
    thumbnail : "no img",
    code : "AAA112",
    stock : 15
}

let producto3 = {
    title : "Producto N°3",
    description : "Este es un producto de ejemplo",
    price : 19500,
    thumbnail : "no img",
    code : "AAA113",
    stock : 19
}

const manager = new ProductManager("productos.json")

manager.addProduct(producto1)
manager.addProduct(producto2)
manager.addProduct(producto3)




export default ProductManager