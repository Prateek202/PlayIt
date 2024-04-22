import 'dotenv/config'
// import mongoose from "mongoose";
// import { DB_NAME} from "./constants";   
import connectDB from "./db/index.js";  
import { app } from './app.js';

//Approach 1 to connect DB
/*
import express from "express"


const app = express()
;(async() => {

    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) //await is mandatory        
        app.on("error",()=>{
            console.log("ERROR :", error)
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listning on PORT ${process.env.PORT}`);
        })
    }
    catch(error){
        console.error("ERROR",error);
        throw err
    }
}) ()  
*/

//Approach 2 

 /*in this approaach we create a saperate file and create all function 
on that file and import that file in index.js*/


connectDB()  
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running at PORT : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo db connection fail !! ",err);
} )