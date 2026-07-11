# Next.js Migration — TDD Implementation Plan

**Superseded by `docs/plans/2026-07-11-unified-nextjs-migration.md`.** This
earlier draft only covered the storefront; the plan that was actually
executed also merged in the admin dashboard. Kept for history.

We will migrate the Coconut frontend to Next.js using a strict Test-Driven Development (TDD) approach (Red → Green → Refactor) as per the project's ways of working.

## Open Questions & Clarifications
Since the current `frontend` project does not have a testing framework installed, **Phase 1** involves scaffolding a new Next.js project (temporarily named `frontend-next`) and setting up a testing framework.
**Question:** Do you have a preference between **Jest** and **Vitest** for the testing framework in the new Next.js application? (Jest is the standard default for Next.js, but Vitest is faster and very popular).

---

## Proposed Changes

### Phase 1: Project Scaffolding & TDD Setup
We will create the foundation and enable testing.
1. **Initialize Next.js:** Scaffold `frontend-next` using Next.js 14/15 (App Router, TypeScript, Tailwind).
2. **Setup Testing:** Install the testing framework (Jest or Vitest), `@testing-library/react`, and configure the environment.
3. **TDD Step (Sanity Check):** 
   - *Test:* Write a failing test for a basic `app/page.tsx` rendering a "Hello Coconut" heading.
   - *Implementation:* Write the minimal code to pass the test.

### Phase 2: Porting State Management (Redux)
We will port the existing Redux logic and ensure it works with Next.js Client Components.
1. **TDD Step (Slices):**
   - *Test:* Write unit tests for `authSlice`, `cartSlice`, and `foodSlice` reducers.
   - *Implementation:* Port the slices from the old project to `frontend-next/src/store/` and make the tests pass.
2. **TDD Step (Redux Provider):**
   - *Test:* Write a test verifying that a dummy component wrapped in `ReduxProvider` can access the store.
   - *Implementation:* Create `providers/ReduxProvider.tsx` with `"use client"` and wrap `app/layout.tsx`.

### Phase 3: Porting UI Components
We will move shared components one by one, adapting them to Next.js.
1. **TDD Step (Navbar):**
   - *Test:* Write a test for `Navbar` verifying it renders the logo, theme toggle, and navigation links.
   - *Implementation:* Port `Navbar.tsx`, replacing `react-router-dom`'s `<Link>` with `next/link`.
2. **TDD Step (AI Chat):**
   - *Test:* Write tests for `VercelV0Chat` ensuring it renders the input and handles form submission.
   - *Implementation:* Port `v0-ai-chat.tsx` with `"use client"` and ensure styling remains intact.
3. **TDD Step (Shared UI):**
   - *Test & Implement:* Port `Footer`, `ThemeToggle`, and `ui/` components (buttons, inputs) verifying they render correctly.

### Phase 4: Porting Pages & Routing
We will convert the SPA pages to Next.js App Router pages.
1. **TDD Step (Home Page & Data Fetching):**
   - *Test:* Mock the backend API response and test that `Home` page renders the `FoodDisplay` component with the fetched items.
   - *Implementation:* Implement `app/page.tsx` as a Server Component that fetches the food list directly from the NestJS API.
2. **TDD Step (Cart Page):**
   - *Test:* Mock the Redux cart state and verify the `Cart` page renders the items and total price.
   - *Implementation:* Port `Cart.tsx` to `app/cart/page.tsx` as a Client Component.
3. **TDD Step (Order & Profile Pages):**
   - *Test:* Verify form validations in the `PlaceOrder` page.
   - *Implementation:* Port `PlaceOrder`, `MyOrders`, and `Profile` pages to their respective App Router paths.

### Phase 5: Verification & Cutover
1. **Run Full Test Suite:** Execute `npm run test` to ensure 100% pass rate.
2. **Build Verification:** Run `npm run build` to verify Next.js builds successfully without type errors.
3. **Directory Swap:** Delete the old `frontend` directory and rename `frontend-next` to `frontend`.

---

## Verification Plan

### Automated Tests
We will run the following commands continuously during development:
- `npm run test` (Executes the test suite)
- `npm run lint` (Ensures code quality and ESLint compliance)

### Manual Verification
1. Start the Next.js development server (`npm run dev`).
2. Navigate through the application to ensure:
   - The Home page loads instantly (SSR).
   - Adding items to the cart works interactively (Client-side Redux).
   - The AI Assistant chat successfully connects to the backend API.
   - Dark/Light theme toggling persists correctly.
