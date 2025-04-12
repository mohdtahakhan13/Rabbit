const express=require("express")
const Order=require("../models/Order")
const {protect,admin} =require("../middleware/authMiddleware")

const router=express.Router();

//GET /api/admin/orders
//get all orders (admin only) //private/admin
router.get("/",protect,admin,async (req,res)=>{
    try {
        const orders=await Order.find({}).populate("user","name email")
        res.json(orders)
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"})
    }
})

//PUT /api/admin/orders/:id
//update order status
//private/admin
router.put("/:id",protect,admin,async (req,res)=>{
    try {
        const order=await Order.findById(req.params.id).populate("user","name")
        if(order){
            order.status=req.body.status || order.status
            order.isDeivered=req.body.status ==="Delivered" ? true :order.isDeivered
            order.deliveredAt=req.body.status==="Delivered" ? Date.now() :order.deliveredAt

            const updatedOrder=await order.save()
            res.json(updatedOrder)
        }else res.status(404).json({message: "order not found"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'server error'})
    }
})


//DELETE /api/admin/orders/:id
//delete an order //private/admin
router.delete("/:id",protect,admin,async (req,res)=>{
    try {
        const order=await Order.findById(req.params.id)
        if(order){
            await Order.deleteOne()
            res.json({message:"order deleted"})
        }else
        res.status(404).json({message:"order not found"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"})
    }
})
module.exports=router