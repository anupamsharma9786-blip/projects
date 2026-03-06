const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('../config/cache');

async function registerUser(req,res){
    const {username,email,password} = req.body;

    const IsUserExist = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(IsUserExist){
        return res.status(400).json({
            message:"User Already Exists"
        })
    }

    const hash = await bcrypt.hash(password,10);

    const user = await userModel.create({
        username,
        email,
        password:hash
    });

    const token = jwt.sign({
            id:user._id,
            username
        },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    );

    res.cookie("token",token);
    return res.status(201).json({
        message:"User registered successfully",
        user:{
            username,
            email,
        }
    });

}


async function loginUser(req,res){
    const {username,email,password} = req.body;
    
    const user = await userModel.findOne({
        $or:[
            {username},
            {email}

        ]
    }).select("+password")

    if(!user){
        return res.status(400).json({
            message:"Invalid Credentials"
        })
    }

    const isPassValid = await bcrypt.compare(password,user.password)

    if(!isPassValid){
        return res.status(400).json({
            message:"Invalid Credentials"
        })
    }

    const token = jwt.sign(
        {
            username,
            id:user._id
        },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token);

    return res.status(200).json({
        message:"User logged in successfully",
        user:{
            username:user.username,
            email:user.email
        }
    })
} 

async function getMe(req,res){
    const user = await userModel.findById(req.user.id);

    return res.status(200).json({
        message:"user fetched successfully",
        user,
    })

}

async function logoutUser(req,res){
    const token = req.cookies.token;
    res.clearCookie("token");

    await redis.set(token,Date.now().toString());

    return res.status(200).json({
        message:"Logout successful"
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
};
