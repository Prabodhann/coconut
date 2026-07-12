# Backend Formatting & Consistency

## Goal

Make the `backend/` NestJS codebase consistent in code style, module structure,
and test coverage. Currently: two files fail Prettier, ESLint has unresolved
errors (including a config bug that breaks linting of any `*.spec.ts` file),
`AuthController`/`AuthService` are dead empty stubs, and only one test file
exists in the entire project (`app.controller.spec.ts`).

## Requirements

### Phase 1 — Formatting / lint infrastructure

- Fix `tsconfig.json`: remove `test` and `**/*spec.ts` from its `exclude`
  array. Those exclusions belong only in `tsconfig.build.json` (production
  build), not the main project config ESLint's `projectService` resolves
  against. Without this fix, ESLint cannot type-check any spec file
  (`Parsing error: ... was not found by the project service`).
- Run `prettier --write` across `src/**/*.ts` and `test/**/*.ts`.
- Run `eslint --fix` across the same.
- Manually resolve remaining ESLint errors that `--fix` can't auto-fix:
  - `src/newsletter/newsletter.service.ts`: remove unused
    `ServiceUnavailableException` import.
  - `src/ai/ai.service.ts:83`: resolve unsafe `.message` access on an `any`
    value (narrow the caught error type instead of widening the lint rule).
- Acceptance: `npm run lint` and `npx prettier --check "src/**/*.ts" "test/**/*.ts"`
  both exit clean.

### Phase 2 — Structural cleanup

- Delete `src/auth/auth.controller.ts` and `src/auth/auth.service.ts` — both
  are empty stubs with no routes/methods, unreferenced anywhere except their
  own module registration. Actual auth logic (login/register) lives in
  `UserController`/`UserService`.
- Update `src/auth/auth.module.ts` to only wire what's actually used:
  ```ts
  @Module({
    providers: [AdminGuard],
    exports: [AdminGuard],
  })
  export class AuthModule {}
  ```
- No other module has a structural gap that fits the "fill gaps only, don't
  invent files for modules that don't need them" criterion — `cart` and `ai`
  intentionally have no `schema/` folder (cart reuses `User`'s schema, ai has
  no persisted model), which is correct as-is, not a gap.
- Acceptance: app still boots (`npm run start`), `AdminGuard` and
  `AuthMiddleware` continue to be usable from `app.module.ts` exactly as
  before.

### Phase 3 — Unit tests

Add a `.spec.ts` next to each controller/service/guard/middleware/filter that
doesn't already have one, using Nest's `Test.createTestingModule` with mocked
dependencies (mocked Mongoose models via `getModelToken`, mocked services).
DTOs, schemas, and `src/config/cloudinary.ts` are out of scope — they hold no
branching logic worth unit testing.

Files to add tests for (16):

- `src/app.service.spec.ts`
- `src/ai/ai.controller.spec.ts`, `src/ai/ai.service.spec.ts`
- `src/auth/admin.guard.spec.ts`, `src/auth/auth.middleware.spec.ts`
- `src/cart/cart.controller.spec.ts`, `src/cart/cart.service.spec.ts`
- `src/food/food.controller.spec.ts`, `src/food/food.service.spec.ts`
- `src/newsletter/newsletter.controller.spec.ts`,
  `src/newsletter/newsletter.service.spec.ts`
- `src/order/order.controller.spec.ts`, `src/order/order.service.spec.ts`
- `src/user/user.controller.spec.ts`, `src/user/user.service.spec.ts`
- `src/common/filters/http-exception.filter.spec.ts`

Each spec should cover, at minimum, the happy path and the main error path
(e.g. `NotFoundException` on missing user, guard rejecting a missing/invalid
token, filter mapping an `HttpException` vs. a generic `Error`) for every
public method.

Acceptance: `npm run test` and `npm run test:cov` pass; every file in the list
above has a corresponding spec.

## Out of scope

- E2E test expansion (only `test/app.e2e-spec.ts` exists today; not touched).
- DTO/schema validation tests.
- Renaming routes, changing response shapes, or altering business logic —
  this is a formatting/structure/test-coverage pass, not a behavior change.
- `frontend-next/` — backend only.
