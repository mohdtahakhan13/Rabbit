const express=require("express")
const Cart=require('../models/Cart')
const Product=require('../models/Product')
const {protect} =require("../middleware/authMiddleware")

const router=express.Router()

//helper fn to get cart by userid and guestid
const getCart= async (userId,guestId)=>{
    if(userId){
        return await Cart.findOne({user:userId});
    }else if(guestId){
        return await Cart.findOne({guestId})
    }
    return null;
}
//POST /api/cart
//add a product to cart for guest or loggedin user //public
router.post("/", async (req,res)=>{
    const {productId,quantity,size,color,guestId,userId}=req.body;
    try {
        const product=await Product.findById(productId)
        if(!product) return res.status(404).json({message:"Product not found"})
        //determine if user is guest or logged in
        let cart=await getCart(userId,guestId);
        //if cart exist we need to update it 
        if(cart){
            const productIndex=cart.products.findIndex((p)=>p.productId.toString()===productId && p.size===size && p.color===color)
            if(productIndex>-1){
                //product exists, update the quantity
                cart.products[productIndex].quantity += quantity;
            }else{
                // add new product
                cart.products.push({
                    productId,
                    name:product.name,
                    image:product.images[0].url,
                    price:product.price,
                    size,
                    color,
                    quantity,
                })
            }

            //recalculate total price
            cart.totalPrice=cart.products.reduce((acc,item)=> acc+item.price*item.quantity,0);
            await cart.save();
            return res.status(200).json(cart);
        }else{
            //create a new cart for guest or user
            const newCart=await Cart.create({
                user:userId ? userId : undefined,
                guestId:guestId ? guestId : "guest_"+new Date().getTime(),
                products:[
                    {
                        productId,
                        name:product.name,
                        image:product.images[0].url,
                        price:product.price,
                        size,color,quantity,
                    },
                ],
                totalPrice:product.price*quantity
            })
            return res.status(201).json(newCart);
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({messgae:"Server error"})
    }
})

//PUT /api/cart
//update product quantity in cart for guest or loggedin user // public
router.put("/",async (req,res)=>{
    const {productId,quantity,size,color,guestId,userId}=req.body;
    try {
        let cart=await getCart(userId,guestId);
        if(!cart) return res.status(404).json({message:"cart not found"})
        const productIndex=cart.products.findIndex((p)=> p.productId.toString()===productId && p.size===size && p.color===color)
        if(productIndex >-1)
        {
            //update quantity
            if(quantity>0){
                cart.products[productIndex].quantity=quantity
            }else{
                cart.products.splice(productIndex,1); //remove product if quantity is 0
            }
            cart.totalPrice=cart.products.reduce((acc,item)=> acc+item.price*item.quantity,0)
            await cart.save();
            return res.status(200).json(cart)
        }
        else return res.status(404).json({message:"product not found in cart"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"server error"})
        
    }
})

//DELETE /api/cart
//remove product from the cart //apublic
router.delete("/",async (req,res)=>{
    const {productId,size,color,guestId,userId}=req.body;
    try {
        let cart=await getCart(userId,guestId)
        if(!cart) return res.status(404).json({message:"cart not found"})
            const productIndex=cart.products.findIndex((p)=> p.productId.toString()===productId && p.size===size && p.color===color)
        if(productIndex>-1){
            cart.products.splice(productIndex,1)
        cart.totalPrice=cart.products.reduce((acc,item)=> acc+item.price*item.quantity,0)
        await cart.save();
        return res.status(200).json(cart)
        }
        else{
            return res.status(404).json({message:"product not found in cart"})
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"})
    }
})

//GET /api/cart
// get logged in users or guest users cart
//public
router.get("/",async (req,res)=>{
    const {userId,guestId}=req.query;
    try {
        const cart=await getCart(userId,guestId)
        if(cart)
            res.json(cart)
        else{
            res.status(404).json({message:"cart not found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error"})
        
    }
})

//POST /api/cart/merge
//merge guest cart into user cart on login //private
router.post("/merge",protect,async (req,res)=>{
    const {guestId}=req.body;
    try {
        const guestCart=await Cart.findOne({guestId})
        const userCart=await Cart.findOne({userId:req.user._id});
        if(guestCart){
            if(guestCart.products.length===0){
                return res.status(400).json({message:"Guest cart is empty"})
            }
            if(userCart){
                guestCart.products.forEach((guestItem)=>{
                    const productIndex=userCart.products.findIndex((item)=> item.productId.toString()===guestItem.productId.toString() && item.size==guestItem.size && item.color==guestItem.color);
                    if(productIndex>-1){
                        //if item ecist in usercart update the quantity
                        userCart.products[productIndex].quantity+=guestItem.quantity
                    }
                    else{
                        userCart.products.push(guestItem)
                    }
                })
                userCart.totalPrice=userCart.products.reduce((acc,item)=> acc+item.price*item.quantity,0)
                await userCart.save()
                //remove the guest cart after merging
                try {
                    await Cart.findOneAndDelete({guestId})
                } catch (error) {
                    console.error("error deleteing guest cart",error);   
                }
                res.status(200).json(userCart)
            }
            else{
                //if user has no existing cart , assign guest cart to user
                guestCart.user=req.user._id
                guestCart.guestId=undefined
                await guestCart.save()
                res.status(200).json(guestCart)
            }
        }else{
            if(userCart){
                //guest cart has already been merged , return user cart
                return res.status(200).json(userCart)
            }
            res.status(404).json({messgae:"guest cart not found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server error"})
    }
})
module.exports=router