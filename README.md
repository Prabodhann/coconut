# 🥥 Coconut — The Premium AI-Powered Food delivery Ecosystem

[![Vercel](https://img.shields.io/badge/Frontend-Live-brightgreen)](https://coconut-del.vercel.app)
[![Render](https://img.shields.io/badge/Backend-Live-blue)](https://coconut-backend.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Enterprise-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Framework-red)](https://nestjs.com/)

Coconut is a high-fidelity, end-to-end food delivery platform built for the modern era. It features an AI-driven search experience, enterprise-grade state management, and a stunning glassmorphic design system.

---

## 🏗️ Architecture [Monorepo]

This project is organized as a unified monorepo for seamless development and deployment:

| Package | Technology Stack | Description |
| :--- | :--- | :--- |
| **[Frontend](./frontend)** | React, Vite, Redux Toolkit, Tailwind CSS, Framer Motion | The customer-facing mobile-first web application. |
| **[Admin](./admin)** | React, Vite, Axios, Tailwind CSS | Robust dashboard for managing menu items, orders, and status updates. |
| **[Backend](./backend)** | NestJS, MongoDB (Mongoose), Cloudinary, Stripe, Groq SDK | Enterprise API handling authentication, payments, and AI processing. |

---

## ✨ Key Features

### 🤖 AI-Powered "Coconut" Assistant
Leveraging any **Llama 3.3 70B** via Groq, our RAG-enabled chat assistant understands cravings and recommends the best items from the live menu catalog.

### 🎭 Dynamic Identity System
Experience a fluid UI where the brand transforms as you navigate. Watch the "Coconut" logo condense into a sleek "C." icon upon scrolling, maximizing real estate for food discovery.

### 🌓 Standardized Theme Synchronization
A unified dark/light mode experience that persists across all application routes and user states.

### 💳 Real-Time Order Management
- **Stripe Integration**: Secure, enterprise-level checkout.
- **Live Status Tracking**: Real-time updates from "Food Processing" to "Out for Delivery."

---

## 🚀 Quick Start

### Prerequisites
- Node.js v24.x (Optimized for performance)
- MongoDB Atlas Account
- API Keys: Cloundiary, Stripe, Groq

### Local Development

1. **Clone & Install**
   ```bash
   git clone https://github.com/Prabodhann/coconut.git
   cd coconut
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend**
   ```bash
   cd backend
   npm install
   # Create .env based on .env.example
   npm run start:dev
   ```

4. **Admin**
   ```bash
   cd admin
   npm install
   npm run dev
   ```

---

## 🐳 Docker Deployment

Run the entire ecosystem with a single command:

```bash
docker-compose up --build
```

---

## 🛠️ Technology Toolbox

- **Frontend**: `React 18+`, `Vite`, `Redux Toolkit`, `Framer Motion`, `Lucide React`, `Tailwind CSS`.
- **Backend**: `NestJS 11`, `Mongoose`, `JWT`, `Bcrypt`, `Groq SDK`.
- **Infrastructure**: `Vercel`, `Render`, `Docker`.

---

## 🥥 Design Philosophy
> *"Aesthetics are not just pixels; they are the interface between hunger and satisfaction."*

Coconut prioritizes **Rich Aesthetics**: smooth gradients, micro-animations, and glassmorphism to create a premium first impression.

---

## 📜 License
This project is for demonstration purposes. All rights reserved. 🥥🚀
