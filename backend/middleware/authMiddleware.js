const jwt=require("jsonwebtoken")
const User=require("../models/User")

// middleware to protect routes
 const protect=async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token=req.headers.authorization.split(" ")[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET)

            req.user=await User.findById(decoded.user.id).select("-password") // exclude password
            next();
         }
        catch(e){
            console.error("token verifcation failed",e)
            res.status(401).json({message:"not authorized , token failed"})
        }
    }else{
        res.status(401).json({message:"not aurthorized . no token provided"})
    }
 }

 //middleware to check if user is an admin
 const admin=(req,res,next)=>{
    if(req.user && req.user.role==="admin")
        next();
    else
    res.status(403).json({message:"Not authorized as an admin"})
 }
 
 module.exports={protect,admin}
