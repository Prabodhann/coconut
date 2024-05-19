# Food Delivery App

Coconut is a full-stack food delivery application built using the MERN (MongoDB, Express, React, Node.js) stack. The application allows users to browse a menu, place orders, and make payments seamlessly. Additionally, it provides an admin panel to manage products, orders, and other administrative tasks.

## Features

- **User Interface**

  - Built with ReactJS and JavaScript
  - Styled with pure CSS for a responsive design
  - Utilizes Vite as the front-end build tool for efficient development

- **React Components and Libraries**

  - React Hooks for state management and lifecycle methods
  - Axios for communication with the backend API
  - React Router for handling client-side routing
  - React Toastify for displaying notifications and alerts

- **Backend**

  - Node.js and Express for building the server
  - MongoDB for data storage
  - Mongoose ODM for schema management and data modeling
  - JSON Web Tokens (JWT) for user authentication and authorization

- **Payment Integration**

  - Stripe API for secure and reliable payment processing

- **Admin Panel**
  - Add, list, modify, and update products and orders
  - Change order status
  - Synchronization between front-end and back-end for real-time updates

## Getting Started

To run the coconut Food Delivery App locally, follow these steps:

1. Clone the repository: `git clone https://github.com/Prabodhann/coconut.git`

2. Install dependencies for the front-end and back-end:

- Front-end: `cd coconut/frontend && npm install`
- Back-end: `cd coconut/backend && npm install`

3. Set up environment variables for the back-end (e.g., MongoDB connection string, Stripe API keys)
4. Start the development servers:

- Back-end: `npm start` (in the `coconut/backend` directory)
- Front-end: `npm run dev` (in the `coconut/frontend` directory):

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the frontend directory and add the backend URL:
   ```env
   VITE_API_URL="https://coconut-drab.vercel.app"
   ```
4. Start the frontend server:
   ```sh
   npm run dev
   ```

```
- Admin-panel `npm run dev` (in the `coconut/admin` directory)
```

## Payment Integration

Coconut integrates with the Stripe API for secure and reliable payment processing. During testing, you can use the following test card details:

- Card Number: `4000003560000008`
- CVV: Any value
- Expiry Date: Any future date

Please note that these are test card details provided by Stripe for testing purposes only. Do not use real credit card information during testing.
