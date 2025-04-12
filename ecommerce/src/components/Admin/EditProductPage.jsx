import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {fetchProductDetails, updateProduct} from "../../redux/slices/productSlice"
import axios from 'axios';
function EditProductPage() {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {id}=useParams()
    const {selectedProduct,loading,error}=useSelector((state)=> state.products)

    const [productData,setProductData]=useState({
        name:"",
        description:"",
        price:0,
        countInStock:0,
        sku:"",
        category:"",
        brand:"",
        sizes:[],
        colors:[],
        collections:"",
        material:"",
        gender:"",
        images:[
            // {
            //     url:"https://picsum.photos/150?random=1",
            // },
            // {
            //     url:"https://picsum.photos/150?random=2",
            // },
        ],
    })
    const [uploading,setUploading]=useState(false); //image uploadiing state
    useEffect(()=>{
        if(id)
        dispatch(fetchProductDetails(id))
    },[dispatch,id])

    useEffect(()=>{
        if(selectedProduct)
            setProductData(selectedProduct)
    },[selectedProduct])

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setProductData((prevData)=> ({...prevData, [name]:value}));
    }
    const handleImageUpload=async(e)=>{
        const file=e.target.files[0];
        // console.log(file);
        const formData=new FormData()
        formData.append("image",file)
        try {
            setUploading(true)
            const {data}=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`,formData,{
                headers:{"Content-Type":"multipart/form-data"},
            })
            setProductData((prevData) => ({
                ...prevData,images:[...prevData.images,{url:data.imageUrl,altText:""}]
            }))
            setUploading(false)
        } catch (error) {
            console.error(error);
            setUploading(false)
        }
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        // console.log(productData)
        dispatch(updateProduct({id,productData}))
        navigate("/admin/products")
    }
    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>
  return (
    <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
      <h2 className="text-3xl font-bold mb-6 ">Edit Product</h2>
      <form action="" onSubmit={handleSubmit}>
        {/* name  */}
        <div className="mb-6 ">
            <label htmlFor="" className="block font-semibold mb-2">Product Name</label>
            <input type="text" name="name" className='w-full border border-gray-300 rounded-md p-2' required value={productData.name}  onChange={handleChange}/>
        </div>
        {/* description  */}
        <div className="mb-6 ">
            <label htmlFor="" className="block font-semibold mb-2">Description</label>
            <textarea name="description" value={productData.description} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' row={4} required id=""></textarea>
        </div>
        {/* price  */}
        <div className="mb-6">
        <label htmlFor="" className="block font-semibold mb-2">Price</label>
        <input type="number" name="price" value={productData.price} className='w-full border border-gray-300 rounded-md p-2' onChange={handleChange} id="" />
        </div>
        {/* count in stock  */}
        <div className="mb-6">
        <label htmlFor="" className="block font-semibold mb-2">Count in Stock</label>
        <input type="number" name="countInStock" value={productData.countInStock} className='w-full border border-gray-300 rounded-md p-2' onChange={handleChange} id="" />
        </div>

        {/* sku  */}
        <div className="mb-6">
        <label htmlFor="" className="block font-semibold mb-2">SKU</label>
        <input type="text" name="sku" value={productData.sku} className='w-full border border-gray-300 rounded-md p-2' onChange={handleChange} id="" />
        </div>
        {/* sizes  */}
        <div className="mb-6">
        <label htmlFor="" className="block font-semibold mb-2">Sizes (Comma -seperated)</label>
        <input type="text" name="sizes" value={productData.sizes.join(",")} className='w-full border border-gray-300 rounded-md p-2' onChange={(e)=> setProductData({...productData,sizes:e.target.value.split(",").map((size)=>size.trim())})} id="" />
        </div>
        colors 
        <div className="mb-6">
        <label htmlFor="" className="block font-semibold mb-2">Colors (Comma -seperated)</label>
        <input type="text" name="colors" value={productData.colors.join(",")} className='w-full border border-gray-300 rounded-md p-2' onChange={(e)=> setProductData({...productData,colors:e.target.value.split(",").map((color)=>color.trim())})} id="" />
        </div>
        {/* image upload  */}
        <div className="mb-6">
            <label htmlFor="" className="block font-semibold mb-2">Upload Image</label>
            <input type="file" onChange={handleImageUpload}  />
            {uploading && <p>Uploading image...</p>}
            <div className="flex gap-4 mt-4">
                {productData.images.map((image,index)=>(
                    <div key={index}>
                        <img src={image.url} alt={image.altText || "product image"} className="w-20 h-20 object-cover rounded-md shadow-md" />
                    </div>
                ))}
            </div>
        </div>
        <button type='submit' className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors'>Update Product</button>
      </form>
    </div>
  )
}

export default EditProductPage
