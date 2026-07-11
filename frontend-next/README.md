# Coconut web

The unified Coconut storefront and admin dashboard, built with Next.js App
Router. This single app replaces the two former Vite apps (`frontend/` and
`admin/`) — the storefront lives under `(public)`, the dashboard under
`(admin)/admin`.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Redux Toolkit** for client state (`store/slices`)
- **Tailwind CSS 4** + `framer-motion` + `lucide-react`
- **Vitest** + React Testing Library — this app is built test-first (TDD);
  every component ships with a co-located `*.test.tsx`

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the NestJS API origin (see `backend/`). It must
not end in `/api`.

## Scripts

```bash
npm run dev            # start the dev server
npm run build          # production build
npm test                # run the Vitest suite
npm run lint             # eslint
npm run format             # prettier --write
npm run format:check        # prettier --check
```

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Storefront home — AI assistant, menu, cart |
| `/cart`, `/order`, `/myorders`, `/profile`, `/verify`, `/app-download` | Storefront pages |
| `/admin` | Redirects to `/admin/add` |
| `/admin/add`, `/admin/list`, `/admin/orders` | Admin dashboard (gated by admin login) |

## Deployment

Deployed on **Vercel**. In the Vercel project settings, set the **Root
Directory** to `frontend-next` (this is a monorepo) and add
`NEXT_PUBLIC_API_URL` as an environment variable pointing at the Render
backend.

The backend (NestJS) runs separately on Render — see the root `README.md`
for the full architecture.
