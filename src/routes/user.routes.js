import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js"
import { logoutUser,refreshAccessToken } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
    
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
/*
//verifyJWT is method from middleware post me do function likhe hai to phle verifyJWT 
run hoga uske end me next() likhe hai to uske bd logoutUser run hoga
*/
router.route("/logout").post(verifyJWT, logoutUser) 

router.route("/refresh-token").post(refreshAccessToken)

export default router 