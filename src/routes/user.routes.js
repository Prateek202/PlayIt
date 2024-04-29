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


export default router 