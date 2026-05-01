# Coconut — Admin Dashboard

React admin panel for managing the Coconut food delivery platform.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **HTTP**: Axios (authenticated instance with Bearer token interceptor)
- **Notifications**: React Toastify

## Setup

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:4000
```

```bash
npm run dev
```

## Admin Login

The admin dashboard is protected by a login gate. To access it:

1. Create a user account on the customer frontend with the email you want to use as admin.
2. Set `ADMIN_EMAIL=<that email>` in `backend/.env` and restart the backend.
3. Log in on the admin dashboard with that email and password.

The backend resolves the `admin` role at login time — no separate admin account type exists.

## Features

- **Food Inventory**: Add, edit, and remove menu items with image upload (Cloudinary)
- **Order Management**: View all orders, filter by status and date range, update delivery status
- **Dark / light mode**
