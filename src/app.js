import path from "path"
import { __dirname } from "./utils.js"
import express from "express"
import { Server } from "socket.io"
import Viewrouter from "./Routes/view.router.js"
import Productosrouter from "./Routes/productos.router.js"
import Carritorouter from "./Routes/carrito.router.js"
import Chatrouter from "./Routes/chat.router.js"
import MessagesModel from "./dao/models/messages.js"
import ProductsModel from "./dao/models/products.js"
import { engine } from "express-handlebars"
import mongoose from "mongoose"
import * as dotenv from "dotenv"


dotenv.config() //Conf. del dotenv

const app = express() //Inicializar express
const PORT = process.env.PORT || 8080 //Se guarda el puerto en una variable
const MONGO_URL = process.env.URL_MONGOOSE //Se guarda la direccion de la base de Mongo en una variable
const connection = mongoose.connect(MONGO_URL) //Se realiza la conexión con Mongo
    
console.log(MONGO_URL)

//CONFIG. DE EXPRESS
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//CONFIG. DE HANDLEBARS
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "./views"));


//SE IMPLEMENTA USO DE CARPETA PUBLIC PARA ACCEDER AL CONTENIDO COMUNICACION CLIENTE-SERVIDOR
app.use(express.static(path.join(__dirname , "../public")))

//SE DEFINEN ENDPOINTS
app.use("/productos",Productosrouter)
app.use("/carrito",Carritorouter)
app.use("/",Viewrouter)
app.use("/chat",Chatrouter)



//SE INICIALIZA EL SERVIDOR CON SOCKET
const server = app.listen(PORT,()=>{
    console.log("Escuchando desde el puerto " + PORT)
})

server.on("error",(err)=>{
    console.log(err)
})


const ioServer = new Server(server)

ioServer.on("connection", async (socket) => {
    console.log("CONEXION ON");

    socket.on("disconnect",()=>{
        console.log("USUARIO OFFLINE")
    })

    socket.on("new-product", async (data) => {
      let title = data.title
      let description = data.description
      let code = data.code
      let price = +data.price
      let stock = +data.stock
      let category = data.category
      let thumbnail = data.thumbnail
      console.log(title,description,code,price,stock,category,thumbnail)
      console.log("PRODUCTO AGREGADO CON EXITO")
    });

    socket.on("delete-product",async(data)=>{ 
        let id = data;
        let result = await ProductsModel.findByIdAndDelete(id);
        console.log("PRODUCTO ELIMINADO", result);
    })
    

    const productos = await ProductsModel.find({}).lean()
    socket.emit("update-products", productos)

    socket.on("guardar-mensaje",(data)=>{
        MessagesModel.insertMany([data])
    })

    const mensajes = await MessagesModel.find({}).lean()
    socket.emit("enviar-mensajes",mensajes)
    socket.on("Nuevos-mensajes",(data)=>{
        console.log(data + " NUEVOS MENSAJES")
    })
});








