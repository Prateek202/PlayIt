import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({      //use method for middleware
    origin: process.env.CORS_ORIGIN, //from where we accept request
    Credentials : true
}))

app.use(express.json({limit: "16kb"}))  //for taking data from form
app.use(express.urlencoded({extended: true, limit : "16kb"}))   //from taking data from url
app.use(express.static("public"))
app.use(cookieParser())

export { app }