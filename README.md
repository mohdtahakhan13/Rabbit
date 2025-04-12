# MERN Stack E-Commerce Platform

A fully functional eCommerce web application built using the **MERN** stack (MongoDB, Express, React, Node) with **Redux Toolkit** for state management, **JWT** for authentication, and **PayPal** for payment processing.

## Features

### User Features
- User registration & login (with JWT authentication)
- Role-based access (Admin & Customer)
- Browse products with category-wise filters (Men, Women, Apparel, etc.)
- Product details with sizes, colors, and stock info
- Add to cart, update quantities, remove items
- Checkout with shipping and payment (PayPal)
- View order history

### Admin Features
- Secure admin login with protected routes
- Create, edit, and delete products
- Manage all orders and update their status
- View user list and order details

## Tech Stack

- **Frontend**: React.js, Redux Toolkit, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (hosted on Atlas)
- **Authentication**: JSON Web Token (JWT), bcrypt
- **Payment Integration**: PayPal
- **Deployment**: Vercel (Frontend), MongoDB Atlas (DB)
