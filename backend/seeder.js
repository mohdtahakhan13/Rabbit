const mongoose=require("mongoose")
const dotenv=require("dotenv")
const Product=require("./models/Product")
const User=require("./models/User")
const Cart=require("./models/Cart")
const products=require("./data/product")

dotenv.config()

mongoose.connect(process.env.MONGO_URI)
//function to seed data

const seedData=async ()=>{
    try {
        //clear exisiting data
        await Product.deleteMany()
        await User.deleteMany();
        await Cart.deleteMany();
        // create a default admin user
        const createdUser=await User.create({
            name:"Admin User",
            email:"admin@example.com",
            password:"123456",
            role:"admin"
        })
        //assign default user id to each product
        const userID=createdUser._id;
        const sampleProducts=products.map((product)=>{
            return {...product,user:userID};
        })
        //insert product in the database
        await Product.insertMany(sampleProducts)
        console.log("product data seeded successfully")
        process.exit();
    } catch (error) {
        console.error("error seeding the data");
        process.exit(1);
        
    }
}

seedData();