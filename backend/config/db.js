const mongoose=require("mongoose")
 const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected sucessfully mongodb")
    }catch(e){
        console.error("mongodb connection failed",e);
        process.exit(1);
    }
 }
 module.exports=connectDB;