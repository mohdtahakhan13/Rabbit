const express=require("express")
const User=require("../models/User")
const jwt=require("jsonwebtoken")
const {protect}=require("../middleware/authMiddleware")
//new route instance
const router=express.Router();

// /api/users/register
router.post("/register", async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        let user=await User.findOne({email})
        if(user) return res.status(400).json({message:"user already exits"})
        user=new User({name,email,password})
    await user.save();
    // res.status(201).json({
    //     user:{
            // _id:user._id,
            // name:user.name,
            // email:user.email,
            // role:user.role,
    //     },
    // })
    
    // create JWT payload
    const payload={user:{ id: user._id,role:user.role}};
    // sign and return the token along with user data
    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{ 
        if(err) throw err;
        res.status(201).json({
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },token,
        })
    }
    );
    }catch(e){
        console.log(e);
        res.status(500).send("server error")
    }
});

///api/users/login
//authenticate users

router.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user) res.status(400).json({ message: "Invalid credentials"})
        const isMatch=await user.matchPassword(password);
    if(!isMatch) res.status(400).json({message:"invalid credentials"})
    
    // create JWT payload
    const payload={user:{ id: user._id,role:user.role}};
    //sign and return the token along with user data
    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{ 
        if(err) throw err;
        res.json({
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },token,
        })
    }
    );
    }catch(e){
        console.error(e)
        res.status(500).send("server error")
}
});

// get request /api/users/profile
// get the logged-in users profile (protected route)
// private access

router.get("/profile",protect,async(req,res)=>{
    res.json(req.user);
})
module.exports=router