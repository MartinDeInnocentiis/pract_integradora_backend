import { Router } from "express";
import ProductsModel from "../dao/models/products.js";

const router = Router()

router.get("/",async (req,res)=>{
    const productos = await ProductsModel.find({}).lean()
    res.render("home",{title: "PRODUCTOS AGREGADOS", productos: productos})
})

router.get("/realTimeProducts",(req,res)=>{
    res.render("realTimeProducts",{title: "VISTA DE PRODUCTOS EN TIEMPO REAL:", script: "index.js"})
})

router.post("/agregarProducto",async(req,res)=>{
    const {title,description,code,price,stock,category,thumbnail} = req.body
    if(!title || !description || !code || !price || !stock || !category || !thumbnail){
        return res.status(500).json({message : "COMPLETAR TODOS LOS DATOS"})
    }else{
        const productoNuevo = {
            title : title,
            description : description, 
            code : code,
            price : +price,
            status : true,
            stock : +stock,
            category : category,
            thumbnail : thumbnail
        }
        let result = await ProductsModel.insertMany([productoNuevo])
        return res.status(201).json({message: "PRODUCTO AGREGADO EXITOSAMENTE", data : result})
    }
})

export default router