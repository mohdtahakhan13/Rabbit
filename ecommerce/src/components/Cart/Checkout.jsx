import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';
import {useDispatch, useSelector} from "react-redux"
import {createCheckout} from "../../redux/slices/checkoutSlice"
import axios from "axios"
// const cart={
//   products:[
//     {
//       name:"Stylish Jacket",
//       size:"M",
//       color:"black",
//       price:120,
//       image:"https://picsum.photos/150?random=1"
//     },
//     {
//       name:"Casual Sneakers",
//       size:"42",
//       color:"white",
//       price:75,
//       image:"https://picsum.photos/150?random=2"
//     },
//   ],
//   totalPrice:195,
// };


function Checkout() {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {cart,loading,error}=useSelector((state)=> state.cart)
  const {user}=useSelector((state)=> state.auth)

  const [checkoutId,setCheckoutId]=useState(null)
  const [shippingAddress,setShippingAddress]=useState({
    firstName:"",
    lastName:"",
    address:"",
    city:"",
    postalCode:"",
    country:"",
    phone:"",
  })

  //ensure cart is loaded before proceeding
  useEffect(()=>{
    if(!cart || cart.products.length=== 0)
      navigate("/");
  },[cart,navigate])

  const handleCreateCheckout=async (e)=>{
    e.preventDefault()
    // setCheckoutId(123)
    if(cart && cart.products.length>0){
      const res=await dispatch(createCheckout({
        checkoutItems:cart.products,
        shippingAddress,
        paymentMethod:"Paypal",
        totalPrice:cart.totalPrice,
      }))
      // console.log("checkout",res)
      if(res.payload && res.payload._id)
        setCheckoutId(res.payload._id); //set checkout id if checkout was successfull 
    }
    }

    const handlePaymentSuccess=async (details)=>{
      // console.log("payment successful",details)
      try {
        const response=await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,{
          paymentStatus:'paid', paymentDetails:details,
        },{
          headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
        })
          await handleFinalizeCheckout(checkoutId); //finalize checkout if payment is successfull
      } catch (error) {
        console.error(error);
      }
    }

    const handleFinalizeCheckout=async (checkoutId)=>{
      try {
        const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,{},{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("userToken")}`
          },
        })
          navigate("/order-confirmation")        
      } catch (error) {
        console.error(error);
      }
    }
    if(loading) return <p>Loading cart..</p>
    if(error) return  <p>Error: {error}</p>
    if(!cart || !cart.products || cart.products.length===0)
      return <p>Your cart is empty.</p>
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
      {/* left section  */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form action="" onSubmit={handleCreateCheckout}>
          <h3 className='text-lg mb-4'>Contact Details</h3>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">Email</label>
            <input type="email" name="" value={user? user.email : ""} id="" className='w-full p-2 border rounded ' disabled />
          </div>
          <h2 className="text-lg mb-4">Delivery</h2>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="" className="block text-gray-700">First Name</label>
              <input type="text" className='w-full p-2 border rounded' value={shippingAddress.firstName} required onChange={(e)=> setShippingAddress({...shippingAddress,firstName:e.target.value})} />
            </div>
            <div>
              <label htmlFor="" className="block text-gray-700">Last Name</label>
              <input type="text" className='w-full p-2 border rounded' value={shippingAddress.lastName} required onChange={(e)=> setShippingAddress({...shippingAddress,lastName:e.target.value})} />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">Address</label>
            <input type="text" value={shippingAddress.address} onChange={(e)=> setShippingAddress({...shippingAddress,address:e.target.value})}  className='w-full p-2 rounded border' required/>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
              <label htmlFor="" className="block text-gray-700">City</label>
              <input type="text" className='w-full p-2 border rounded' value={shippingAddress.city} required onChange={(e)=> setShippingAddress({...shippingAddress,city:e.target.value})} />
            </div>
            <div>
              <label htmlFor="" className="block text-gray-700">Postal Code</label>
              <input type="text" className='w-full p-2 border rounded' value={shippingAddress.postalCode} required onChange={(e)=> setShippingAddress({...shippingAddress,postalCode:e.target.value})} />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">Country</label>
            <input type="text" value={shippingAddress.country} onChange={(e)=> setShippingAddress({...shippingAddress,country:e.target.value})}  className='w-full p-2 rounded border' required/>
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">Phone</label>
            <input type="tel" value={shippingAddress.phone} onChange={(e)=> setShippingAddress({...shippingAddress,phone:e.target.value})}  className='w-full p-2 rounded border' required/>
          </div>

          <div className="mt-6">
            {!checkoutId ? (
              <button type='submit' className='w-full bg-black text-white py-3 rounded'>Continue to Payment</button>
  ): (
    <div>
      <h3 className="text-lg mb-4 font-semibold">Pay with Paypal</h3>
      {/* paypal button  */}
      <PayPalButton  amount={cart.totalPrice} onSuccess={handlePaymentSuccess} onError={(err)=> alert("Payment failed. Try again.")} />
    </div>
  )}
          </div>
        </form>
      </div>

      {/* right section  */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product,index)=>(
            <div key={index} className='flex items-start justify-between py-2 border-b'>
              <div className="flex items-start">
              <img src={product.image} alt={product.name} className='w-full h-24 object-cover mr-4' />
              <div>
                <h3 className="text-md">{product.name}</h3>
                <p className="text-gray-500">Size:{product.size}</p>
                <p className="text-gray-500">Color:{product.color}</p>
              </div>
              </div>
              <p className="text-xl">${product.price ?.toLocaleString() }</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t">
          <p>Total</p>
          <p>${cart.totalPrice?.toLocaleString(``)}</p>
        </div>
      </div>
    </div>
  )
}

export default Checkout

// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import PayPalButton from './PayPalButton';

// const cart = {
//   products: [
//     {
//       name: "Stylish Jacket",
//       size: "M",
//       color: "black",
//       price: 120,
//       image: "https://picsum.photos/150?random=1"
//     },
//     {
//       name: "Casual Sneakers",
//       size: "42",
//       color: "white",
//       price: 75,
//       image: "https://picsum.photos/150?random=2"
//     },
//   ],
//   totalPrice: 195,
// };

// function Checkout() {
//   const navigate = useNavigate();
//   const [checkoutId, setCheckoutId] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentError, setPaymentError] = useState(null);
//   const [shippingAddress, setShippingAddress] = useState({
//     firstName: "",
//     lastName: "",
//     address: "",
//     city: "",
//     postalCode: "",
//     country: "",
//     phone: "",
//   });

//   const handleCreateCheckout = (e) => {
//     e.preventDefault();
//     // Validate shipping address
//     if (!shippingAddress.firstName || !shippingAddress.lastName || 
//         !shippingAddress.address || !shippingAddress.city || 
//         !shippingAddress.postalCode || !shippingAddress.country || 
//         !shippingAddress.phone) {
//       setPaymentError("Please fill in all shipping details");
//       return;
//     }
//     setCheckoutId(`checkout_${Date.now()}`);
//     setPaymentError(null);
//   };

//   const handlePaymentSuccess = (details) => {
//     console.log("Payment successful", details);
//     setIsProcessing(false);
//     navigate("/order-confirmation", { 
//       state: { 
//         orderDetails: details, 
//         shippingAddress, 
//         cart 
//       } 
//     });
//   };

//   const handlePaymentError = (err) => {
//     console.error("Payment failed:", err);
//     setIsProcessing(false);
//     setPaymentError("Payment failed. Please try again or use another payment method.");
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setShippingAddress(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
//       {/* left section */}
//       <div className="bg-white rounded-lg p-6">
//         <h2 className="text-2xl uppercase mb-6">Checkout</h2>
//         <form onSubmit={handleCreateCheckout}>
//           <h3 className='text-lg mb-4'>Contact Details</h3>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-700">Email</label>
//             <input 
//               type="email" 
//               id="email" 
//               defaultValue="user@example.com" 
//               className='w-full p-2 border rounded' 
//               disabled 
//             />
//           </div>
          
//           <h2 className="text-lg mb-4">Delivery</h2>
//           <div className="mb-4 grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="firstName" className="block text-gray-700">First Name</label>
//               <input 
//                 type="text" 
//                 id="firstName"
//                 name="firstName"
//                 className='w-full p-2 border rounded' 
//                 value={shippingAddress.firstName} 
//                 required 
//                 onChange={handleInputChange} 
//               />
//             </div>
//             <div>
//               <label htmlFor="lastName" className="block text-gray-700">Last Name</label>
//               <input 
//                 type="text" 
//                 id="lastName"
//                 name="lastName"
//                 className='w-full p-2 border rounded' 
//                 value={shippingAddress.lastName} 
//                 required 
//                 onChange={handleInputChange} 
//               />
//             </div>
//           </div>
          
//           <div className="mb-4">
//             <label htmlFor="address" className="block text-gray-700">Address</label>
//             <input 
//               type="text" 
//               id="address"
//               name="address"
//               value={shippingAddress.address} 
//               onChange={handleInputChange}  
//               className='w-full p-2 rounded border' 
//               required
//             />
//           </div>
          
//           <div className="mb-4 grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="city" className="block text-gray-700">City</label>
//               <input 
//                 type="text" 
//                 id="city"
//                 name="city"
//                 className='w-full p-2 border rounded' 
//                 value={shippingAddress.city} 
//                 required 
//                 onChange={handleInputChange} 
//               />
//             </div>
//             <div>
//               <label htmlFor="postalCode" className="block text-gray-700">Postal Code</label>
//               <input 
//                 type="text" 
//                 id="postalCode"
//                 name="postalCode"
//                 className='w-full p-2 border rounded' 
//                 value={shippingAddress.postalCode} 
//                 required 
//                 onChange={handleInputChange} 
//               />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label htmlFor="country" className="block text-gray-700">Country</label>
//             <input 
//               type="text" 
//               id="country"
//               name="country"
//               value={shippingAddress.country} 
//               onChange={handleInputChange}  
//               className='w-full p-2 rounded border' 
//               required
//             />
//           </div>
          
//           <div className="mb-4">
//             <label htmlFor="phone" className="block text-gray-700">Phone</label>
//             <input 
//               type="tel" 
//               id="phone"
//               name="phone"
//               value={shippingAddress.phone} 
//               onChange={handleInputChange}  
//               className='w-full p-2 rounded border' 
//               required
//             />
//           </div>

//           <div className="mt-6">
//             {!checkoutId ? (
//               <button 
//                 type='submit' 
//                 className='w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors'
//               >
//                 Continue to Payment
//               </button>
//             ) : (
//               <div>
//                 <h3 className="text-lg mb-4 font-semibold">Pay with PayPal</h3>
//                 {paymentError && (
//                   <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//                     {paymentError}
//                   </div>
//                 )}
//                 {isProcessing && (
//                   <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
//                     Processing payment...
//                   </div>
//                 )}
//                 <PayPalButton 
//                   amount={cart.totalPrice.toString()} 
//                   onSuccess={handlePaymentSuccess} 
//                   onError={handlePaymentError}
//                 />
//                 <button 
//                   type="button" 
//                   onClick={() => setCheckoutId(null)}
//                   className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors"
//                 >
//                   Back to Shipping
//                 </button>
//               </div>
//             )}
//           </div>
//         </form>
//       </div>

//       {/* right section */}
//       <div className="bg-gray-50 p-6 rounded-lg">
//         <h3 className="text-lg mb-4">Order Summary</h3>
//         <div className="border-t py-4 mb-4">
//           {cart.products.map((product, index) => (
//             <div key={index} className='flex items-start justify-between py-2 border-b'>
//               <div className="flex items-start">
//                 <img 
//                   src={product.image} 
//                   alt={product.name} 
//                   className='w-24 h-24 object-cover mr-4 rounded' 
//                 />
//                 <div>
//                   <h3 className="text-md font-medium">{product.name}</h3>
//                   <p className="text-gray-500 text-sm">Size: {product.size}</p>
//                   <p className="text-gray-500 text-sm">Color: {product.color}</p>
//                 </div>
//               </div>
//               <p className="text-lg font-medium">${product.price?.toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between items-center text-lg mb-4">
//           <p className="text-gray-600">Subtotal</p>
//           <p className="font-medium">${cart.totalPrice?.toLocaleString()}</p>
//         </div>
//         <div className="flex justify-between items-center text-lg mb-4">
//           <p className="text-gray-600">Shipping</p>
//           <p className="font-medium">Free</p>
//         </div>
//         <div className="flex justify-between items-center text-xl mt-4 pt-4 border-t">
//           <p className="font-semibold">Total</p>
//           <p className="font-bold">${cart.totalPrice?.toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Checkout;