const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv")
const connectDB=require("./config/db")
const userRoutes=require("./routes/userRoutes")
const productRoutes=require("./routes/productRoutes")
const cartRoutes=require("./routes/cartRoutes")
const checkoutRoutes=require("./routes/checkoutRoutes")
const orderRoutes=require("./routes/orderRoutes")
const uploadRoutes=require("./routes/uploadRoutes")
const subscriberRoutes=require("./routes/subscriberRoutes")
const adminRoutes=require("./routes/adminRoutes")
const productAdminRoutes=require("./routes/productAdminRoutes")
const adminOrderRoutes=require("./routes/adminOrderRoutes")

const app=express();
app.use(express.json())
// app.use(cors());
app.use(cors({
    origin: [
      'https://rabbit-fcer.vercel.app',
      'http://localhost:9000' // For local development
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));


dotenv.config();

connectDB();

const PORT=process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.send("WELCOME TO RABBIT API")
})

//api routes 

app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/checkout",checkoutRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api",subscriberRoutes);

//admin routes
app.use("/api/admin/users",adminRoutes);
app.use("/api/admin/products",productAdminRoutes);
app.use("/api/admin/orders",adminOrderRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})