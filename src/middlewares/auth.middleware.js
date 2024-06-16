//this middleware will only verofy that your is present or not

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header          //requesting for cookies   ? means optional that is cookies may or may not present cookies is not present in mobile application
        ("Authorization")?.replace("Bearer ","")        //so when cookies is not comming from accesstoken then may be the user is sending custom header 
    
        if(!token){
            throw new ApiError(401,"Unauthorize request")
        }  
    
        //now if we have token then we will ask from jwt that token is correct or not
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid Access Toekn")
        }
        req.user = user();
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }
})