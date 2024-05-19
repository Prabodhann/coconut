The coconut Admin Dashboard is a tool that enables administrators to efficiently manage products and orders within the coconut food delivery application.

## Features

- **Product Management**:

  - Add new products with details such as name, description, price, and category.
  - List all existing products with search and filter capabilities.
  - Update product information, including name, description, price, and category.

- **Order Management**:

  - View a list of all incoming orders with essential details like customer information, order items, and order status.
  - Update the status of orders (e.g., pending, processing, delivered).

- **User-friendly Interface**:

  - Intuitive and responsive user interface built with ReactJS and styled using CSS.
  - Easy-to-use forms and input fields for efficient data entry.
  - Toastify notifications for providing feedback on successful or failed operations.

## Technologies Used

- ReactJS
- JavaScript
- CSS
- Axios (for backend communication)
- React-DOM
- React-Router-DOM
- React-Toastify

## Getting Started

### Admin Panel Setup

1. Navigate to the admin panel directory:
   ```sh
   cd ../admin
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the admin directory and add the backend URL:
   ```env
   VITE_API_URL=https://example.hostingsite.com
   ```
4. Start the admin panel server:
   ```sh
   npm run dev
   ```
