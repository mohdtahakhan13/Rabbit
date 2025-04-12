import React, { useState } from 'react'
import {IoMdClose} from "react-icons/io"
import { useNavigate } from 'react-router-dom';
import CardContents from '../Cart/CardContents'
import {useSelector} from "react-redux"
function CartDrawer({drawerOpen,toggleCartDrawer}) {
  // const navigate=useNavigate();
  const navigate= useNavigate()
  const {user,guestId}= useSelector((state) => state.auth)
  const {cart}=useSelector((state)=> state.cart)
  const userId=user ? user._id :null;
const handleCheckout=()=>{
  toggleCartDrawer()
  if(!user)
navigate("/login?redirect=checkout")
  else
  navigate("/checkout")
}
  return (
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"} `}>
      <div className='flex justify-end p-4'>
        <button onClick={toggleCartDrawer}>
            <IoMdClose  className='h-6 w-6 text-gray-600'/>
        </button>
      </div>

      {/* cart content with scrollable area  */}
      <div className='flex-grow p-4 overflow-y-auto'>
        <h2 className='font-semibold text-xl mb-4'>Your Cart</h2>
        {cart && cart?.products?.length>0 ? ( <CardContents cart={cart} userId={userId} guestId={guestId} />) : (<p>
          Your Cart is empty.
        </p>)}
        {/* component for card content  */}
       
      </div>


      {/* checkout button fixed at bottom  */}
      <div className='p-4 bg-white sticky bottom-0'>
      {cart && cart?.products?.length>0 && (
        <>
        <button  onClick={handleCheckout} className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition '>Checkout</button>
        <p className='text-sm tracking-tighter text-gray-500 mt-2 text-center'>Shipping, taxes , and discount codes calculated at checkout.</p>
        </>
      )}
        
      </div>
    </div>
  )
}

export default CartDrawer
