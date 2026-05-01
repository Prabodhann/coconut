# Coconut — Backend API

NestJS REST API powering the Coconut food delivery platform.

## Tech Stack

- **Framework**: NestJS 11 (TypeScript)
- **Database**: MongoDB via Mongoose
- **Auth**: JWT (role-based: `user` / `admin`)
- **Payments**: Stripe (Checkout + Webhooks)
- **Images**: Cloudinary
- **Email**: Resend
- **AI**: Groq SDK (Llama 3.3 70B)
- **Rate limiting**: `@nestjs/throttler` — 30 req / 60 s globally

## Project Setup

```bash
npm install
```

Create a `.env` file (see `.env.example` for all required keys):

```env
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
GROQ_API_KEY=
ADMIN_EMAIL=
FRONTEND_URL=
PORT=4000
```

## Running

```bash
# development (watch mode)
npm run start:dev

# production
npm run start:prod
```

## API Modules

| Module | Base Path | Auth |
| :--- | :--- | :--- |
| User | `/api/user` | Public (login / register) |
| Food | `/api/food` | List: public · Add/Edit/Remove: admin |
| Order | `/api/order` | Place/verify: user · List/status: admin |
| Cart | `/api/cart` | User JWT |
| Newsletter | `/api/newsletter` | Public |
| AI | `/api/ai` | Public |

## Admin Access

Admin role is resolved at login time by comparing the login email against `ADMIN_EMAIL` in `.env`. No separate admin account type is needed — set `ADMIN_EMAIL=yourmail@example.com` and restart the server.

## Stripe Webhooks

Configure your Stripe webhook to point to `/api/order/webhook`. The endpoint handles:
- `checkout.session.completed` → marks order as paid
- `checkout.session.expired` → deletes unpaid order
