import asyncHandler from '../utils/asyncHandler.js'
import { User } from "../models/Users.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../utils/cloudinary.js"


const generateAccessAndRefreshTokens=async (userId)=>{
    try{
        //find user by his id
        const user = await User.findById(userId)

        //generate access and refresh tokens
       const accessToken= user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        
        //save refreshtoken in database but since db requires password validations before saving, make that false
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})


        //return access and refreshtokens to the user 
        return {accessToken,refreshToken}




    }catch(error){
        throw new ApiError(500,"Error generating Refresh and Access token")
    }
}


const registerUser = asyncHandler(async (req, res) => {

    // get user data from frontend
    // validation - not empty
    // validation - existing user
    // check for images, check for avatar
    // upload them to cloudinary
    // create new user object
    // remove password and refreshToken field from response
    // check for user creation
    // return response


        // get user data from frontend
        const { fullName, username, email, password } = req.body;
        
        
        // validation - not empty
        if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
            throw new ApiError(400,"All fields are required");
        }

        // validation - existing user
        const existingUser = await User.findOne({
            $or: [{username,email}]
        });
        if (existingUser) {
            throw new ApiError(409,"User Already exists");
        }

        // check for images, check for avatar
        const avatarLocalPath = req.files?.avatar[0]?.path;
      
        const coverImagePath = req.files?.coverImage?.[0]?.path;


        //optional way of handling error when no cover image is passed 

        /*  
            let coverImagePath;
            if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
                coverImagePath=req.files.coverImage[0].path 
        */
       
        if (!avatarLocalPath) {
            throw new ApiError(400,"Avatar file is required");
        }

        // upload them to cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImagePath);
   
        if (!avatar) {
            throw new ApiError(400,"Avatar upload failed");
        }
       

        // create new user object
        const newUser = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        });
       

        // remove password and refreshToken field from response
        const userCreated = await User.findById(newUser._id).select(
            "-password -refreshToken"  // Select User without sending password and refreshToken fields
        );

        // check for user creation
        if (!userCreated) {
            throw new ApiError(500,"Something went wrong while registering a user");
        }

 

        //return response 
        return res.status(201).json(
            new ApiResponse(200,userCreated,"User registered successfully")
        )

   
});


const loginUser=asyncHandler(async(req,res)=>{
    //get data from user
    //check if fields are empty
    // check if the user already exists (user check)  
    // if they exist, match their password to grant them access(password check)
    //access and refresh token 
    //send tokens through cookies
    //else tell them to register the new account 

    const {username,password,email}=req.body;

    
    if(!username || !email){
      throw new ApiError(400,"Username or Email is required")
    }
    const existingUser=await User.findOne({
        $or:[{username,email}]
    })
    if(!existingUser){
        throw new ApiError(400,"User not found")
    }

    const passwordMatch = await existingUser.isPasswordCorrect(password)
    
    if(!passwordMatch){
        throw new ApiError(401," Password Incorrect ")
    }
    
     const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(existingUser._id)

     const loggedUser=await User.findById(existingUser._id).select(
        "-password -refreshToken"
     )


     //options designing for cookies

     const options={
        httpOnly:true,
        secure:true
     }

     return res.stataus(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options) //when sent in cookies, tokens are sent to the database 
     .json(
        new ApiResponse(200,
            {
                user:loggedUser,accessToken,refreshToken    //again sending access token ad refresh token in case user wants to save these tokens to himself as well 
            },
            "User Logged in Successfully"
        )
     )



});






export {registerUser,loginUser,logoutUser}