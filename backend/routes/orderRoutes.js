const express=require("express")
const Order=require("../models/Order")
const {protect} =require("../middleware/authMiddleware")

const router=express.Router()

// GET /api/orders/my-orders
//get logged in users orders
//private
router.get("/my-orders",protect,async (req,res)=>{
    try {
        //fetch all the orders for authenticated user
        const orders=await Order.find({user:req.user._id}).sort({createdAt:-1})
        res.json(orders)
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"})
    }
})

//GET /api/orders/:id
// get order details by id //private
router.get("/:id",protect,async (req,res)=>{
    try {
        const order=await Order.findById(req.params.id).populate(
            "user","name email"
        );
        if(!order)
            return res.status(404).json({message:"order not found"})
        //return full order details
        res.json(order)
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"})
    }
})

module.exports=router;