import { response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js ";    // importing error handling file 
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async(req, res) => {
    //steps for registering user
    //1. get user details from frontend
    //2. validation (jitna bi detail diya hai user ne wo correct to hai n like kuch field empty to nahi)
    //3. check if user is already exists: check using username and email
    //4. check for images : avatar    
    //5. upload them to cloudinary
    //6. create user object - create entry in db
    //7. remove password and refresh token field from response
    //8 check for user creation
    //9 return response


    //1
    const {fullName, email, username, password} = req.body
    console.log("email", email);
//2
    if(fullName===""){
        throw new ApiError(400, "FullName is required")
    }
    if(email===""){
        throw new ApiError(400, "Email is required")
    }
    if(username===""){
        throw new ApiError(400, "username is required")
    }
    if(password===""){
        throw new ApiError(400, "password is required")
    }
    if (email.indexOf('@') > -1)
    {
        throw new ApiError(400, "Enter valid email")
    }
//3
    const existedUser = User.findOne({
        $or: [{username}, {email}]  //
    })
    if(existedUser){
        throw new ApiError(409, "user with email or username already exists")
    }
//4
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
//5
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    
//6

    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",  //bcz cover image is not required field to agar upload ni hua to blanck chod dena hai
        email,
        password,
        username : username.toLowerCase()
    })

   
//7
    const createdUser = await  User.findById(user._id).select(
        "-password -refreshToken"     //select s jo jo fields chahiye wo select krte hai prr - lga ho to eliminate ho jata hai
    )
 //checking whether user created or not
 //8
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering") 
    }

    //9
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})


    


 
    export { registerUser } 