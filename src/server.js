//require('dotenv').config({path:'./env'})


import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";


const port=process.env.PROCESS || 8000
dotenv.config({
    path:'./.env'
})
 
connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log("App lsitenning at port ",port)
    })
})
.catch((err)=>{
    console.log("MongoDB connection FAILED !!",err)
})
