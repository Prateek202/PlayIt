import { response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js ";    // importing error handling file 
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";


//login ka 5th step generate access and refresh token
const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken    //saving refresh token in Database
        await user.save({validateBeforeSave: false})    //validateBeforeSave:false means here we doesnot need validation before save
        return {acessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}


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
    const {fullName, email, username, password } = req.body
    //console.log("email", email);
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
    // if (email.indexOf('@') > -1)
    // {
    //     throw new ApiError(400, "Enter valid email")
    // }
//3
    const existedUser = await User.findOne({
        $or: [{username}, {email}]  //
    })
    if(existedUser){
        throw new ApiError(409, "user with email or username already exists")
    }
//4
//     const avatarLocalPath = req.files?.avatar[0]?.path;
//     const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
//     if(!avatarLocalPath){
//         throw new ApiError(400,"Avatar file is required")
//     }
// //5
//     const avatar = await uploadOnCloudinary(avatarLocalPath)
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath)
//     if(!avatar){
//         throw new ApiError(400,"Avatar file is required")
//     }
    
//6

    const user = await User.create({
        fullName,
       // avatar : avatar.url,
        //coverImage : coverImage?.url || "",  //bcz cover image is not required field to agar upload ni hua to blanck chod dena hai
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

const loginUser = asyncHandler(async(req,res)=>{
    //1 get data from request body
    //2 username or email
    //3 find the user
    //4 password check
    //5 access and refreshtoken
    //6 send cookies

    //1
    const {email, username, password} = req.body
    if(!username || !email){
        throw new ApiError(400, "username or password is required")
    }

//3

    const user = await User.findOne({
        $or: [{username}, {email}]  //$or mongodb operator here we are checking if we have username or email
    })
    if(!user){  //email or username kuch bhi nahi mila that means user not exists
        throw new ApiError(404, "user does not access")
    }

//4
    const isPasswordValid = await user.isPasswordCorrect(password)  //ispasswordcorrect function we created in user.controller
    
    if(!isPasswordValid){
        throw newApiError(401, "Invalid password credentials")
    }
//5
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)


    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    const options = {
        httponly: true,
        secure: true
        /* isse koi bi manually modify ni krr skta 
        cookies ko server se hi hoga*/  
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,refreshToken
            },
            "User logged In successfully"
        )
    )
})      


const logoutUser = asyncHandler(async(req, res) =>{
    //1 clr cookies 
    //2 reset refreshtoken

    //for logging out there is a problem that how will we get the id that we want to logout
    //so we use 
    await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new : true
        }
    )
    const options = {
        httponly: true,
        secure: true
        /* isse koi bi manually modify ni krr skta 
        cookies ko server se hi hoga*/  
    }
    return res
    .status(200)
    .clearCookie("accessTokken", option)
    .clearCookie("refreshTokken", option)
    .json(new ApiResponse(200,{}, "user loggedout"))
})

 
    export { registerUser,
        loginUser, 
        logoutUser
    }  