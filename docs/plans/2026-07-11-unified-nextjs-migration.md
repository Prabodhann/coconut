# Unified Next.js Migration — TDD Implementation Plan

## Scope and constraints

- Replace the two Vite applications (`frontend/` and `admin/`) with one App Router
  Next.js application, initially scaffolded at `frontend-next/`.
- Preserve the NestJS API, MongoDB Atlas, Stripe, Cloudinary, Groq, Resend, and
  Render deployment without behavioural changes.
- Keep the current Redux Toolkit state model and client-side, localStorage-based
  authentication. Admin access remains a client guard; edge/cookie hardening is
  explicitly deferred.
- Use current stable Next.js and React 19, Turbopack for development, and Vitest
  with React Testing Library for the new frontend test suite.
- Do not modify the existing user edit in
  `frontend/src/components/FoodDisplay/FoodDisplay.tsx` during the migration.

## Current-state findings

- Storefront routes are `/`, `/cart`, `/order`, `/myorders`, `/verify`,
  `/profile`, and `/app-download`; navigation presently uses React Router.
- The storefront root owns theme hydration, the Render `/health` warm-up request,
  menu/cart bootstrap thunks, Toastify, the login popup, navbar, and footer.
- `authSlice` reads and writes browser localStorage at module initialization,
  which must be made safe for Next.js server evaluation without changing client
  persistence behaviour.
- The admin app stores a distinct `admin_token`/`admin_role` session and presently
  protects all routes with an in-app gate. Its routes need to become
  `/admin/add`, `/admin/list`, and `/admin/orders`.
- Existing API clients reference Vite environment variables. The new application
  must use a public Next.js environment variable while retaining the same backend
  endpoints and authorization headers.

## Execution sequence

Each numbered item below is one approval-gated TDD step: write and run the failing
test, add only the code needed for that test, run it green, report the prescribed
step result, and wait for approval before proceeding.

1. **Scaffold and test harness**
   - Generate `frontend-next/` with the App Router, TypeScript, Tailwind, and the
     selected stable Next.js/React versions.
   - Configure Vitest, jsdom, React Testing Library, test setup, path aliases,
     and scripts for test, lint, development, and production build.
   - Red test: a minimal root page renders a Coconut heading.
   - Green implementation: establish the minimal root layout/page required for
     the passing test.

2. **Browser-safe configuration and API client**
   - Red tests: API base URL resolves from `NEXT_PUBLIC_API_URL`; the request
     interceptor sends the persisted storefront bearer token only in a browser.
   - Green implementation: port constants/types and add a browser-safe Axios
     client plus food/cart service methods, retaining current endpoint contracts.

3. **Redux slices**
   - Red tests: reducer behaviour for `authSlice`, `cartSlice`, and `foodSlice`,
     including auth persistence, cart increment/decrement/clear, and food thunk
     loading/success/error transitions.
   - Green implementation: port the slices and types; guard all localStorage
     reads/writes so server rendering never accesses `window`.

4. **Redux provider and application bootstrap**
   - Red tests: a component inside `ReduxProvider` reads store state; root client
     bootstrap requests food on mount and cart only after authentication.
   - Green implementation: create the provider and a focused client bootstrap
     component, then place it beneath the root layout alongside Toastify, theme
     initialization, and the existing Render health ping.

5. **Shared storefront shell**
   - Red tests: public layout renders Navbar/Footer; navbar navigation uses Next
     links; theme toggle reads, applies, and persists the selected theme.
   - Green implementation: port shared storefront components, CSS/assets, UI
     primitives, login modal, scroll reset behaviour, loading/skeleton elements,
     and AI chat. Replace React Router APIs with `next/link`, `useRouter`,
     `usePathname`, and `useSearchParams` as applicable; mark interactive
     components as client components.

6. **Storefront route migration**
   - For each route, first add one route-level render test, then port it into the
     `(public)` route group:
     - Home: `page.tsx` with explore/menu/food display behaviour backed by Redux.
     - Cart: `cart/page.tsx` with cart interaction and checkout navigation.
     - Checkout: `order/page.tsx` with order submission and Stripe redirect.
     - Orders: `myorders/page.tsx`.
     - Verification: `verify/page.tsx`, preserving query-string processing.
     - Profile: `profile/page.tsx`.
     - Mobile apps: `app-download/page.tsx`.
   - Keep client data fetching and API responses behaviourally equivalent; do not
     introduce server-side menu fetching in this migration.

7. **Admin session utilities and guard**
   - Red tests: admin session persistence and layout access decisions for no
     session, non-admin role, and administrator role.
   - Green implementation: port the admin Axios client/session helpers and create
     a client admin layout that renders the login screen unless both
     `admin_token` and `admin_role === 'admin'` are present. Keep authentication
     parity with the current app.

8. **Admin shell and pages**
   - Red tests: the admin shell renders navigation and logout; each `/admin/add`,
     `/admin/list`, and `/admin/orders` page renders.
   - Green implementation: port navbar, sidebar, shared types/constants/assets,
     skeletons, styling, then Add, List, and Orders under the `(admin)` group.
     Translate admin links and redirects to Next navigation APIs.

9. **Route, interaction, and build verification**
   - Extend tests where needed to cover AI chat submission, cart interactions,
     and public/admin route rendering against mocked API boundaries.
   - Run the full Vitest suite, lint, and `next build`; resolve only migration
     failures. Manually exercise the backend warm-up, theme persistence, login,
     cart, checkout redirect, AI chat, and all admin flows against the existing
     API.

10. **Cutover**
    - After all verification is green, delete the superseded `frontend/` and
      `admin/` directories, rename `frontend-next/` to `frontend/`, remove
      `backend/vercel.json`, and update the single Vercel project configuration
      and environment variable to `NEXT_PUBLIC_API_URL`.
    - Re-run the complete frontend verification suite and production build from
      the final directory. Confirm deployment configuration retains exactly one
      frontend Vercel project, one Render API, and MongoDB Atlas.

## Test commands

From `frontend-next/` during the migration, run the focused Vitest test for each
red/green cycle, followed by the full `npm run test`, `npm run lint`, and
`npm run build` before cutover. Backend Jest tests remain untouched unless a
read-only regression check is useful.

## Cutover risks to control

- Next.js evaluates modules on the server; all localStorage/document/window usage
  must be restricted to client components or browser-safe guards.
- Route groups do not appear in URLs, so public URLs remain unchanged while admin
  paths gain the intended `/admin` prefix.
- `NEXT_PUBLIC_API_URL` must be configured in every Vercel environment and the
  Render `FRONTEND_URL` allow-list must include the final single frontend origin.
- Existing uncommitted user work remains outside the migration baseline and must
  not be deleted or overwritten during cutover.
