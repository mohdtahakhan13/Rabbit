import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
function PayPalButton({amount,onSuccess,onError}) {

  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
    <PayPalButtons style={{ layout: "vertical" }} createOrder={(data,actions)=>{ return actions.order.create({
        purchase_units:[{amount: {value:parseFloat(amount).toFixed(2)}}]
    })}}
    onApprove={(data,actions)=>{ return actions.order.capture().then(onSuccess)}}
    onError={onError}
    />
</PayPalScriptProvider>
  )
}

export default PayPalButton
// import React from 'react';
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// function PayPalButton({ amount, onSuccess, onError, currency = "USD" }) {
//   const paypalOptions = {
//     "client-id": "AZ6MaNJthYqhJwj0OW1wkAt85YtbOAEBNgs5KZTeSnRy7k0stDTrY3Qw-qhliUSvafFYsGG7BlW0fWe-", // Replace with your actual client ID
//     currency: currency,
//     "disable-funding": "credit,card", // Optional: disable specific funding sources
//   };

//   return (
//     <PayPalScriptProvider options={paypalOptions}>
//       <PayPalButtons 
//         style={{ 
//           layout: "vertical",
//           color: "black",
//           shape: "rect",
//           label: "paypal"
//         }} 
//         createOrder={(data, actions) => {
//           return actions.order.create({
//             purchase_units: [{
//               amount: {
//                 value: amount.toString(),
//                 currency_code: currency
//               }
//             }]
//           });
//         }}
//         onApprove={(data, actions) => {
//           return actions.order.capture().then((details) => {
//             onSuccess(details);
//           });
//         }}
//         onError={(err) => {
//           console.error("PayPal error:", err);
//           onError(err);
//         }}
//         onCancel={(data) => {
//           console.log("Payment cancelled", data);
//         }}
//       />
//     </PayPalScriptProvider>
//   );
// }

// export default PayPalButton;