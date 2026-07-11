# 🥥 Coconut — The Premium AI-Powered Food delivery Ecosystem

[![Vercel](https://img.shields.io/badge/Frontend-Live-brightgreen)](https://coconut-del.vercel.app)
[![Render](https://img.shields.io/badge/Backend-Live-blue)](https://coconut-ua3i.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Enterprise-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Framework-red)](https://nestjs.com/)

Coconut is a high-fidelity, end-to-end food delivery platform built for the modern era. It features an AI-driven search experience, enterprise-grade state management, and a stunning glassmorphic design system.

---

## 🏗️ Architecture [Monorepo]

This project is organized as a unified monorepo for seamless development and deployment:

| Package | Technology Stack | Description |
| :--- | :--- | :--- |
| **[Frontend (web)](./frontend-next)** | Next.js 16 (App Router), React 19, Redux Toolkit, Tailwind CSS, Framer Motion | Unified storefront **and** admin dashboard, built test-first with Vitest. |
| **[Backend](./backend)** | NestJS, MongoDB (Mongoose), Cloudinary, Stripe, Groq SDK | Enterprise API handling authentication, payments, and AI processing. |

> **Note:** the storefront and admin dashboard used to be two separate Vite
> apps (`frontend/`, `admin/`). They've been merged into a single Next.js app
> at `frontend-next/` — see [Migration history](#-migration-history) below.

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
- API Keys: Cloudinary, Stripe, Groq, Resend

### Local Development

1. **Clone & Install**
   ```bash
   git clone https://github.com/Prabodhann/coconut.git
   cd coconut
   ```

2. **Frontend + Admin** (unified app)
   ```bash
   cd frontend-next
   npm install
   cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
   npm run dev
   ```
   Storefront at `/`, admin dashboard at `/admin` (redirects to `/admin/add`).

3. **Backend**
   ```bash
   cd backend
   npm install
   # Create .env based on .env.example
   npm run start:dev
   ```

---

## 🛠️ Technology Toolbox

- **Frontend**: `Next.js 16`, `React 19`, `Redux Toolkit`, `Framer Motion`, `Lucide React`, `Tailwind CSS 4`, `Vitest`.
- **Backend**: `NestJS 11`, `Mongoose`, `JWT`, `Bcrypt`, `Groq SDK`.
- **Infrastructure**: `Vercel` (frontend), `Render` (backend, Docker), `MongoDB Atlas`.

---

## 🥥 Design Philosophy
> *"Aesthetics are not just pixels; they are the interface between hunger and satisfaction."*

Coconut prioritizes **Rich Aesthetics**: smooth gradients, micro-animations, and glassmorphism to create a premium first impression.

---

## 🔄 Migration History

The storefront (`frontend/`) and admin dashboard (`admin/`) were originally
two separate Vite + React apps. They have been merged into a single
Next.js App Router app at **`frontend-next/`**, following the project's
mandatory TDD process (spec → plan → red/green/refactor — see
`CLAUDE.md`). The old directories have been removed; git history still has
them if you need to reference the originals.

What changed, and why:

- **One app instead of two** — `frontend-next/(public)` is the storefront,
  `frontend-next/(admin)/admin` is the dashboard. Fewer Vercel projects,
  shared components (`Button`, theming, the API client).
- **Every component was ported test-first**, not rewritten from scratch —
  each has a co-located `*.test.tsx` verifying real behavior, not just that
  it renders.
- **State management stayed on Redux Toolkit** — a deliberate choice not to
  change frameworks and state libraries in the same migration.
- **Auth stayed `localStorage` + client-side guards** (parity-first) rather
  than moving to httpOnly cookies + Next middleware. That hardening is a
  documented follow-up, not done here.
- **The migration surfaced and fixed three real backend-contract bugs** that
  predated it: checkout was sending the wrong item payload shape, profile
  update was sending fields the backend rejects, and admin's "add/edit food"
  was sending `FormData` to an endpoint that only accepts JSON with a base64
  image. All three would have failed in production.
- **Backend and deployment topology are unchanged** — NestJS on Render,
  MongoDB Atlas, Stripe, Cloudinary, Groq, Resend. Only the frontend moved.

---

## 📜 License
This project is for demonstration purposes. All rights reserved. 🥥🚀
