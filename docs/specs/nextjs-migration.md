# Spec: Migrate Coconut React apps to a unified Next.js app

**Date:** 2026-07-11
**Status:** Approved (design) — pending implementation plan

## Goal

Migrate the two Vite + React 18 apps (`frontend/` storefront and `admin/` dashboard)
into a **single Next.js app** (App Router, latest stable), built test-first (TDD).
Keep everything on free-tier infrastructure. The NestJS backend and MongoDB Atlas
are unchanged.

## Context (current state)

- **backend/** — NestJS 11 API. Modules: user, food, cart, order, ai, newsletter,
  auth, common. Services: MongoDB Atlas (Mongoose), Stripe, Cloudinary, Groq, Resend,
  `@nestjs/throttler`. Deployed as a Docker container on **Render free tier** (sleeps
  after ~15 min idle). Not changing in this effort.
- **frontend/** — React 18 + Vite + Redux Toolkit (`authSlice`, `cartSlice`,
  `foodSlice`). Routes: `/`, `/cart`, `/order`, `/myorders`, `/verify`, `/profile`,
  `/app-download`. Warms up the backend on load via `warmUpServer()`.
- **admin/** — React 18 + Vite. Whole app gated behind a login screen; checks
  `token && role === 'admin'` from `localStorage`. Routes: `/add`, `/list`, `/orders`.
- **Auth today:** login/register in `user.controller.ts` (not `auth`). JWT
  (`{ id, role }`, 7d). `AuthMiddleware` protects select routes and injects `userId`
  into `req.body`. `AdminGuard` checks `role === 'admin'`.

## Decisions (locked)

| Area | Decision |
|---|---|
| Scope | Merge storefront + admin into **one** Next.js app using route groups |
| State | **Keep Redux Toolkit** — port slices as-is behind a client provider |
| Testing | **Vitest** + React Testing Library (backend stays on Jest) |
| Versions | Latest stable Next.js (App Router) + React 19, via `create-next-app@latest`; Turbopack dev |
| Backend host | **Stay on Render free tier**; no move to Vercel |
| Backend warm-up | **Keep `warmUpServer()` ping only**; no cron (single-user project) |
| Admin auth | **Parity-first** — `localStorage` + Redux, client-side guard in admin `layout.tsx` |

## Target architecture

```
web/                        (scaffolded as frontend-next/, renamed at cutover)
├── app/
│   ├── layout.tsx          root: ReduxProvider, theme init, ToastContainer
│   ├── (public)/
│   │   ├── layout.tsx      Navbar + Footer
│   │   ├── page.tsx        Home
│   │   ├── cart/page.tsx
│   │   ├── order/page.tsx
│   │   ├── myorders/page.tsx
│   │   ├── verify/page.tsx
│   │   ├── profile/page.tsx
│   │   └── app-download/page.tsx
│   └── (admin)/
│       └── admin/
│           ├── layout.tsx  Sidebar + admin Navbar + client auth guard
│           ├── add/page.tsx
│           ├── list/page.tsx
│           └── orders/page.tsx
├── components/             shared + storefront + admin components
├── store/                  ported Redux slices + hooks + provider
├── services/               api client (axios)
├── lib/
├── constants/
├── middleware.ts           (parity-first: minimal; hardening deferred)
└── vitest.config.ts + test setup
```

**Deployment:** 3 free services unchanged in count — Vercel (this single app) +
Render (NestJS) + MongoDB Atlas. Net: Vercel projects go from 3 → 1.

## Requirements (acceptance criteria)

1. A new Next.js app scaffolds and builds (`next build`) with no type errors.
2. Vitest + RTL run; a sanity test passes (Red→Green demonstrated).
3. `authSlice`, `cartSlice`, `foodSlice` ported with passing unit tests for reducers.
4. A client `ReduxProvider` wraps the root layout; a wrapped component can read the store (tested).
5. Storefront routes render at their App Router paths with `react-router-dom`
   `<Link>` replaced by `next/link`; each has at least one passing render test.
6. Admin routes render under `/admin`; the admin layout blocks access unless
   `token && role === 'admin'` (parity with current behavior), covered by a test.
7. Theme (dark/light) init and persistence works at the root layout.
8. AI chat and cart interactions work against the existing NestJS API.
9. Full `vitest` suite passes and `next build` succeeds before cutover.
10. At cutover: old `frontend/` and `admin/` deleted, `frontend-next/` renamed,
    stray `backend/vercel.json` removed, Vercel project config updated.

## Phases (high level — detailed steps in the plan)

1. **Scaffold & TDD setup** — Next.js app, Vitest + RTL, sanity test.
2. **State** — port Redux slices with tests; client `ReduxProvider` in root layout.
3. **Shared UI** — Navbar, Footer, ThemeToggle, `ui/` primitives, AI chat.
4. **Storefront pages** — port each route with a render test.
5. **Admin route group** — admin layout + guard + add/list/orders pages.
6. **Verification & cutover** — full suite green, `next build` green, swap directories,
   remove redundant files, update Vercel config.

## Out of scope (documented follow-ups)

- **Backend auth hardening:** return real `401` status codes from `AuthMiddleware`;
  replace `req.body.userId` injection with a `@User()` param decorator. Backend-only;
  deferred so migration breakage is unambiguous.
- **Cookie-based edge auth** for `/admin` (httpOnly JWT + `middleware.ts` gate + SSR
  auth). Parity-first ships `localStorage` + client guard; this is the hardening path.
- **Server-Component data fetching** for the food list (currently Redux thunk).
  Optional later optimization.
- **Health-check cron** to prevent Render sleep. Not needed for a single-user project.
- Any change to backend business logic, Stripe, Cloudinary, Groq, or Resend.
