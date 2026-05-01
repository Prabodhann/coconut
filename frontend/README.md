# Coconut — Customer Frontend

The customer-facing web application for the Coconut food delivery platform.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **State**: Redux Toolkit (persisted to localStorage)
- **Styling**: Tailwind CSS + Framer Motion
- **HTTP**: Axios (with Bearer token interceptor)
- **Payments**: Stripe Checkout (redirect flow)
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

## Features

- Browse and search menu items with AI-powered recommendations
- Cart management with persistent state
- Stripe-powered checkout
- Order history and live status tracking
- User profile management
- Newsletter subscription
- Dark / light mode

## Auth Flow

Login and registration share a single popup. On success the backend returns `{ token, role }` which is stored in Redux state (persisted in localStorage). The Axios interceptor attaches `Authorization: Bearer <token>` to every subsequent request.
