import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name :" avtar", //frontend me bi avtar naam denge
            maxCount: 1
        },
        {
            name: "coverImage",  ////frontend me bi coverImage naam denge
            maxCount:1 
        }
    ]), //fields accepet array

    
    registerUser
)
router.route("/login").post(loginUser) 

//secure routes

router.route("/logout").post(verifyJWT, logoutUser) //verifyJWT is method from middleware post me do function likhe hai to phle verifyJWT run hoga uske end me next() likhe hai to uske bd logoutUser run hoga



export default router 