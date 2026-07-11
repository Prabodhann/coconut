# Backend Formatting & Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `backend/` pass Prettier/ESLint cleanly, remove the dead `AuthController`/`AuthService` stubs, and add unit test coverage for every controller/service/guard/middleware/filter that doesn't already have it.

**Architecture:** Three sequential phases. Phase 1 fixes the lint/format tooling itself (including a `tsconfig.json` bug that breaks linting of any spec file — this must land before Phase 3 adds spec files). Phase 2 removes dead code. Phase 3 adds one `.spec.ts` per production file using Nest's `TestingModule` with `jest.fn()` mocks for Mongoose models and third-party SDKs (Stripe, Cloudinary, Resend, Groq).

**Tech Stack:** NestJS 11, TypeScript, Jest 30 + ts-jest, `@nestjs/testing`, Mongoose 9 (`getModelToken`), ESLint 9 (flat config) + Prettier 3.

## Global Constraints

- All commands below run from `backend/` (the working directory already contains this file's repo).
- Jest config (`package.json`): `rootDir: "src"`, `testRegex: ".*\\.spec\\.ts$"` — every spec file must live under `src/`, colocated with the file it tests (matches existing `app.controller.spec.ts`).
- No behavior changes: DTOs, schemas, route paths, and response shapes stay exactly as they are today. Phase 1/2 changes are formatting/lint/dead-code only.
- Do not touch `frontend-next/`.

---

## Phase 1 — Formatting / lint infrastructure

### Task 1: Fix tsconfig spec-file exclusion and clean lint/format

**Files:**
- Modify: `backend/tsconfig.json`
- Modify: `backend/src/newsletter/newsletter.service.ts` (remove unused import)
- Modify: `backend/src/ai/ai.service.ts:79-86` (fix unsafe `any` access)
- Modify (auto): `backend/src/newsletter/newsletter.service.ts`, `backend/src/order/order.controller.ts` (Prettier formatting)

**Interfaces:** None — infra-only change, no new exports or signatures.

- [ ] **Step 1: Fix `tsconfig.json` so ESLint can type-check spec files**

The `exclude` array currently drops `test` and `**/*spec.ts` from the *main* project config. `tsconfig.build.json` already has its own `exclude` for production builds — the main `tsconfig.json` should include everything so ESLint's `projectService` can resolve spec files.

Edit `backend/tsconfig.json`, changing:
```json
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "scratch", "test", "**/*spec.ts"]
```
to:
```json
  "include": ["src/**/*", "test/**/*"],
  "exclude": ["node_modules", "dist", "scratch"]
```

- [ ] **Step 2: Verify the fix**

Run: `cd backend && npx eslint src/app.controller.spec.ts test/app.e2e-spec.ts`
Expected: no `Parsing error: ... was not found by the project service` — only (at most) unrelated rule warnings, no parsing errors.

- [ ] **Step 3: Auto-fix formatting and lint**

Run:
```bash
cd backend
npx prettier --write "src/**/*.ts" "test/**/*.ts"
npx eslint "{src,test}/**/*.ts" --fix
```

- [ ] **Step 4: Remove the unused import in newsletter.service.ts**

In `backend/src/newsletter/newsletter.service.ts`, the import block:
```ts
import {
  Injectable,
  ServiceUnavailableException,
  ConflictException,
  Logger,
} from '@nestjs/common';
```
`ServiceUnavailableException` is never used in this file. Change to:
```ts
import {
  Injectable,
  ConflictException,
  Logger,
} from '@nestjs/common';
```

- [ ] **Step 5: Fix unsafe `any` access in ai.service.ts**

In `backend/src/ai/ai.service.ts`, the catch block:
```ts
    } catch (error) {
      console.error('Groq AI Error:', error);
      throw new ServiceUnavailableException(
        `AI Search failed: ${error.message || 'Unknown provider error'}`,
      );
    }
```
Change to:
```ts
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown provider error';
      console.error('Groq AI Error:', error);
      throw new ServiceUnavailableException(`AI Search failed: ${message}`);
    }
```

- [ ] **Step 6: Verify lint and format are fully clean**

Run:
```bash
cd backend
npx prettier --check "src/**/*.ts" "test/**/*.ts"
npm run lint
```
Expected: Prettier reports `All matched files use Prettier code style!`; `npm run lint` exits 0 with no errors.

- [ ] **Step 7: Verify the app still builds**

Run: `cd backend && npm run build`
Expected: exits 0, `dist/` produced.

- [ ] **Step 8: Commit**

```bash
cd backend
git add tsconfig.json src/newsletter/newsletter.service.ts src/ai/ai.service.ts src/order/order.controller.ts
git commit -m "fix(backend): resolve lint/format issues and tsconfig spec-file exclusion bug"
```

---

## Phase 2 — Structural cleanup

### Task 2: Remove dead AuthController/AuthService, simplify AuthModule

**Files:**
- Delete: `backend/src/auth/auth.controller.ts`
- Delete: `backend/src/auth/auth.service.ts`
- Modify: `backend/src/auth/auth.module.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `AuthModule` still exports `AdminGuard` (unchanged public surface — `src/food/food.module.ts` and `src/order/order.module.ts` import `AuthModule` for this export; `src/app.module.ts` imports `AuthMiddleware` directly from `./auth/auth.middleware`, not from `AuthModule`, so it is unaffected).

- [ ] **Step 1: Confirm nothing references the dead files**

Run: `cd backend && grep -rn "AuthController\|AuthService" src --include=*.ts`
Expected: only hits inside `src/auth/auth.controller.ts`, `src/auth/auth.service.ts`, and their own registration in `src/auth/auth.module.ts`. No hits elsewhere.

- [ ] **Step 2: Delete the dead files**

```bash
cd backend
git rm src/auth/auth.controller.ts src/auth/auth.service.ts
```

- [ ] **Step 3: Simplify auth.module.ts**

Replace the full contents of `backend/src/auth/auth.module.ts` with:
```ts
import { Module } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

@Module({
  providers: [AdminGuard],
  exports: [AdminGuard],
})
export class AuthModule {}
```

- [ ] **Step 4: Verify the app still builds and boots**

Run: `cd backend && npm run build`
Expected: exits 0, no missing-import errors for `AuthController`/`AuthService`.

- [ ] **Step 5: Commit**

```bash
cd backend
git add src/auth/auth.module.ts
git commit -m "refactor(backend): remove dead AuthController/AuthService stubs"
```

---

## Phase 3 — Unit tests

Shared mocking patterns used throughout this phase:
- Mongoose models are provided via `getModelToken(<Schema>.name)` with a `jest.fn()` object exposing only the static methods each service actually calls (`findOne`, `findById`, `find`, `findByIdAndUpdate`, `findByIdAndDelete`, `create`). Where a service does `new this.xModel(...)`, the mock model itself is `jest.fn().mockImplementation(...)` returning an object with a `save` jest mock.
- Third-party SDKs (`cloudinary`, `stripe`, `resend`, `groq-sdk`) are mocked with `jest.mock(...)` at the top of the relevant spec file, since the service constructs them internally rather than accepting them via DI.

### Task 3: app.service.spec.ts

**Files:**
- Create: `backend/src/app.service.spec.ts`

**Interfaces:**
- Consumes: `AppService.getHello(): string` from `backend/src/app.service.ts`.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('getHello returns the greeting string', () => {
    expect(service.getHello()).toBe('Hello World!');
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest app.service.spec.ts`
Expected: `1 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/app.service.spec.ts
git commit -m "test(backend): add AppService unit test"
```

### Task 4: ai.controller.spec.ts

**Files:**
- Create: `backend/src/ai/ai.controller.spec.ts`

**Interfaces:**
- Consumes: `AiController.getRecommendation(body: AiQueryDto)` from `backend/src/ai/ai.controller.ts`, `AiService.getRecommendations(query: string)`.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

describe('AiController', () => {
  let controller: AiController;
  let service: { getRecommendations: jest.Mock };

  beforeEach(async () => {
    service = { getRecommendations: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [{ provide: AiService, useValue: service }],
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it('delegates to AiService.getRecommendations with the query and returns its result', async () => {
    const expected = { success: true, message: 'Try the curry', itemIds: ['1'] };
    service.getRecommendations.mockResolvedValue(expected);

    const result = await controller.getRecommendation({ query: 'something spicy' });

    expect(service.getRecommendations).toHaveBeenCalledWith('something spicy');
    expect(result).toBe(expected);
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest ai.controller.spec.ts`
Expected: `1 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/ai/ai.controller.spec.ts
git commit -m "test(backend): add AiController unit test"
```

### Task 5: ai.service.spec.ts

**Files:**
- Create: `backend/src/ai/ai.service.spec.ts`

**Interfaces:**
- Consumes: `AiService.getRecommendations(query: string)` from `backend/src/ai/ai.service.ts` (updated in Task 1, Step 5), `Food`/`FoodDocument` from `backend/src/food/schemas/food.schema.ts`.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { AiService } from './ai.service';
import { Food } from '../food/schemas/food.schema';

const mockCreate = jest.fn();
// ai.service.ts does `import Groq from 'groq-sdk'` (default import); under this
// project's tsconfig (no esModuleInterop) that compiles to `new groq_sdk_1.default(...)`,
// so the mock module must expose a `default` key, not a bare constructor.
jest.mock('groq-sdk', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: { completions: { create: mockCreate } },
    })),
  };
});

describe('AiService', () => {
  let foodModel: { find: jest.Mock };
  let configService: { get: jest.Mock };

  const buildService = async (apiKey: string | undefined) => {
    foodModel = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          { _id: 'f1', name: 'Curry', description: 'Spicy', price: 10, category: 'Mains' },
        ]),
      }),
    };
    configService = { get: jest.fn().mockReturnValue(apiKey) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: getModelToken(Food.name), useValue: foodModel },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    return module.get<AiService>(AiService);
  };

  afterEach(() => jest.clearAllMocks());

  it('throws BadRequestException when GROQ_API_KEY is not configured', async () => {
    const service = await buildService(undefined);

    await expect(service.getRecommendations('spicy food')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns parsed recommendations on success', async () => {
    const service = await buildService('test-key');
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({ message: 'Try the curry', itemIds: ['f1'] }),
          },
        },
      ],
    });

    const result = await service.getRecommendations('spicy food');

    expect(foodModel.find).toHaveBeenCalled();
    expect(result).toEqual({ success: true, message: 'Try the curry', itemIds: ['f1'] });
  });

  it('throws ServiceUnavailableException when the Groq call fails', async () => {
    const service = await buildService('test-key');
    mockCreate.mockRejectedValue(new Error('provider down'));

    await expect(service.getRecommendations('spicy food')).rejects.toThrow(
      ServiceUnavailableException,
    );
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest ai.service.spec.ts`
Expected: `3 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/ai/ai.service.spec.ts
git commit -m "test(backend): add AiService unit test"
```

### Task 6: admin.guard.spec.ts

**Files:**
- Create: `backend/src/auth/admin.guard.spec.ts`

**Interfaces:**
- Consumes: `AdminGuard.canActivate(context: ExecutionContext)` from `backend/src/auth/admin.guard.ts`.

- [ ] **Step 1: Write the test**

```ts
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let jwtService: { verifyAsync: jest.Mock };
  let configService: { get: jest.Mock };

  const contextWithHeader = (authorization?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization } }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() };
    configService = { get: jest.fn().mockReturnValue('secret') };
    guard = new AdminGuard(jwtService as unknown as JwtService, configService as unknown as ConfigService);
  });

  it('allows access for a valid admin token', async () => {
    jwtService.verifyAsync.mockResolvedValue({ id: 'u1', role: 'admin' });

    await expect(guard.canActivate(contextWithHeader('Bearer good-token'))).resolves.toBe(true);
  });

  it('throws ForbiddenException when no authorization header is present', async () => {
    await expect(guard.canActivate(contextWithHeader(undefined))).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('throws ForbiddenException when the token role is not admin', async () => {
    jwtService.verifyAsync.mockResolvedValue({ id: 'u1', role: 'user' });

    await expect(guard.canActivate(contextWithHeader('Bearer good-token'))).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('throws ForbiddenException when token verification fails', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid signature'));

    await expect(guard.canActivate(contextWithHeader('Bearer bad-token'))).rejects.toThrow(
      ForbiddenException,
    );
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest admin.guard.spec.ts`
Expected: `4 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/auth/admin.guard.spec.ts
git commit -m "test(backend): add AdminGuard unit test"
```

### Task 7: auth.middleware.spec.ts

**Files:**
- Create: `backend/src/auth/auth.middleware.spec.ts`

**Interfaces:**
- Consumes: `AuthMiddleware.use(req, res, next)` from `backend/src/auth/auth.middleware.ts`.

- [ ] **Step 1: Write the test**

```ts
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let jwtService: { verifyAsync: jest.Mock };
  let configService: { get: jest.Mock };
  let next: NextFunction;
  let json: jest.Mock;
  let res: Response;

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() };
    configService = { get: jest.fn().mockReturnValue('secret') };
    middleware = new AuthMiddleware(
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
    );
    next = jest.fn();
    json = jest.fn();
    res = { json } as unknown as Response;
  });

  it('attaches userId to the body and calls next on a valid token', async () => {
    jwtService.verifyAsync.mockResolvedValue({ id: 'u1', role: 'user' });
    const req = { headers: { authorization: 'Bearer good-token' }, body: {} } as unknown as Request;

    await middleware.use(req, res, next);

    expect((req.body as Record<string, string>).userId).toBe('u1');
    expect(next).toHaveBeenCalled();
  });

  it('responds with an error when no authorization header is present', async () => {
    const req = { headers: {}, body: {} } as unknown as Request;

    await middleware.use(req, res, next);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: 'Not Authorized Login Again',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds with an error when token verification fails', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));
    const req = { headers: { authorization: 'Bearer bad-token' }, body: {} } as unknown as Request;

    await middleware.use(req, res, next);

    expect(json).toHaveBeenCalledWith({ success: false, message: 'jwt expired' });
    expect(next).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest auth.middleware.spec.ts`
Expected: `3 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/auth/auth.middleware.spec.ts
git commit -m "test(backend): add AuthMiddleware unit test"
```

### Task 8: cart.service.spec.ts

**Files:**
- Create: `backend/src/cart/cart.service.spec.ts`

**Interfaces:**
- Consumes: `CartService.addToCart/removeFromCart/getCart` from `backend/src/cart/cart.service.ts`, `User`/`UserDocument` from `backend/src/user/schemas/user.schema.ts`.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { User } from '../user/schemas/user.schema';

describe('CartService', () => {
  let service: CartService;
  let userModel: { findById: jest.Mock; findByIdAndUpdate: jest.Mock };

  beforeEach(async () => {
    userModel = { findById: jest.fn(), findByIdAndUpdate: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService, { provide: getModelToken(User.name), useValue: userModel }],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  describe('addToCart', () => {
    it('increments the item count and saves', async () => {
      userModel.findById.mockResolvedValue({ cartData: { item1: 1 } });
      userModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.addToCart('u1', 'item1');

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('u1', {
        cartData: { item1: 2 },
      });
      expect(result).toEqual({ success: true, message: 'Added To Cart' });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.addToCart('missing', 'item1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromCart', () => {
    it('decrements the item count and saves', async () => {
      userModel.findById.mockResolvedValue({ cartData: { item1: 2 } });
      userModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.removeFromCart('u1', 'item1');

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('u1', {
        cartData: { item1: 1 },
      });
      expect(result).toEqual({ success: true, message: 'Removed From Cart' });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.removeFromCart('missing', 'item1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getCart', () => {
    it('returns the cart data', async () => {
      userModel.findById.mockResolvedValue({ cartData: { item1: 1 } });

      const result = await service.getCart('u1');

      expect(result).toEqual({ success: true, cartData: { item1: 1 } });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.getCart('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest cart.service.spec.ts`
Expected: `6 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/cart/cart.service.spec.ts
git commit -m "test(backend): add CartService unit test"
```

### Task 9: cart.controller.spec.ts

**Files:**
- Create: `backend/src/cart/cart.controller.spec.ts`

**Interfaces:**
- Consumes: `CartController.addToCart/removeFromCart/getCart` from `backend/src/cart/cart.controller.ts`.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

describe('CartController', () => {
  let controller: CartController;
  let service: { addToCart: jest.Mock; removeFromCart: jest.Mock; getCart: jest.Mock };

  beforeEach(async () => {
    service = { addToCart: jest.fn(), removeFromCart: jest.fn(), getCart: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{ provide: CartService, useValue: service }],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('addToCart delegates to CartService.addToCart', () => {
    const expected = { success: true, message: 'Added To Cart' };
    service.addToCart.mockReturnValue(expected);

    const result = controller.addToCart({ userId: 'u1', itemId: 'item1' });

    expect(service.addToCart).toHaveBeenCalledWith('u1', 'item1');
    expect(result).toBe(expected);
  });

  it('removeFromCart delegates to CartService.removeFromCart', () => {
    const expected = { success: true, message: 'Removed From Cart' };
    service.removeFromCart.mockReturnValue(expected);

    const result = controller.removeFromCart({ userId: 'u1', itemId: 'item1' });

    expect(service.removeFromCart).toHaveBeenCalledWith('u1', 'item1');
    expect(result).toBe(expected);
  });

  it('getCart delegates to CartService.getCart', () => {
    const expected = { success: true, cartData: {} };
    service.getCart.mockReturnValue(expected);

    const result = controller.getCart({ userId: 'u1' });

    expect(service.getCart).toHaveBeenCalledWith('u1');
    expect(result).toBe(expected);
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest cart.controller.spec.ts`
Expected: `3 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/cart/cart.controller.spec.ts
git commit -m "test(backend): add CartController unit test"
```

### Task 10: food.service.spec.ts

**Files:**
- Create: `backend/src/food/food.service.spec.ts`

**Interfaces:**
- Consumes: `FoodService.addFood/listFood/removeFood/editFood` from `backend/src/food/food.service.ts`, `Food`/`FoodDocument` from `backend/src/food/schemas/food.schema.ts`.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { FoodService } from './food.service';
import { Food } from './schemas/food.schema';

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe('FoodService', () => {
  let service: FoodService;
  let foodModelCtor: jest.Mock;
  let foodModel: {
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndDelete: jest.Mock;
  };
  let saveMock: jest.Mock;

  beforeEach(async () => {
    saveMock = jest.fn().mockResolvedValue(undefined);
    foodModelCtor = jest.fn().mockImplementation((doc: Record<string, unknown>) => ({
      ...doc,
      save: saveMock,
    })) as unknown as jest.Mock;
    foodModel = Object.assign(foodModelCtor, {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndDelete: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodService, { provide: getModelToken(Food.name), useValue: foodModel }],
    }).compile();

    service = module.get<FoodService>(FoodService);
    jest.clearAllMocks();
    saveMock.mockResolvedValue(undefined);
  });

  const foodDto = {
    name: 'Curry',
    description: 'Spicy',
    price: 12,
    category: 'Mains',
    imageData: 'data:image/png;base64,...',
  };

  describe('addFood', () => {
    it('uploads the image and saves the food item', async () => {
      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({
        secure_url: 'https://img/1.png',
        public_id: 'cloud1',
      });

      const result = await service.addFood(foodDto);

      expect(cloudinary.uploader.upload).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ success: true, message: 'Food Added' });
    });

    it('throws ServiceUnavailableException when the image upload fails', async () => {
      (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(new Error('cloudinary down'));

      await expect(service.addFood(foodDto)).rejects.toThrow(ServiceUnavailableException);
    });
  });

  describe('listFood', () => {
    it('returns all food items', async () => {
      foodModel.find.mockResolvedValue([{ name: 'Curry' }]);

      const result = await service.listFood();

      expect(result).toEqual({ success: true, data: [{ name: 'Curry' }] });
    });
  });

  describe('removeFood', () => {
    it('deletes the food item and its cloudinary image', async () => {
      foodModel.findById.mockResolvedValue({ cloudinaryId: 'cloud1' });
      foodModel.findByIdAndDelete.mockResolvedValue({});
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({});

      const result = await service.removeFood('f1');

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('cloud1');
      expect(foodModel.findByIdAndDelete).toHaveBeenCalledWith('f1');
      expect(result).toEqual({ success: true, message: 'Food Removed' });
    });

    it('throws NotFoundException when the food item does not exist', async () => {
      foodModel.findById.mockResolvedValue(null);

      await expect(service.removeFood('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('editFood', () => {
    it('updates fields without touching the image when imageData is absent', async () => {
      const existing = { name: 'Old', description: 'Old desc', price: 5, category: 'Old', cloudinaryId: 'cloud1', save: saveMock };
      foodModel.findById.mockResolvedValue(existing);

      const result = await service.editFood({ id: 'f1', name: 'New Name' });

      expect(existing.name).toBe('New Name');
      expect(saveMock).toHaveBeenCalled();
      expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
      expect(result).toEqual({ success: true, message: 'Food Updated Successfully' });
    });

    it('throws NotFoundException when the food item does not exist', async () => {
      foodModel.findById.mockResolvedValue(null);

      await expect(service.editFood({ id: 'missing' })).rejects.toThrow(NotFoundException);
    });
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest food.service.spec.ts`
Expected: `7 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/food/food.service.spec.ts
git commit -m "test(backend): add FoodService unit test"
```

### Task 11: food.controller.spec.ts

**Files:**
- Create: `backend/src/food/food.controller.spec.ts`

**Interfaces:**
- Consumes: `FoodController.addFood/listFood/removeFood/editFood` from `backend/src/food/food.controller.ts`. Calling controller methods directly bypasses Nest's HTTP guard *execution* pipeline (guard behavior itself is covered by `admin.guard.spec.ts`), but NestJS's `TestingModule.compile()` still eagerly resolves any class referenced via `@UseGuards` metadata as an injectable — so `AdminGuard` must be overridden with `overrideGuard(...).useValue(...)`, or `compile()` fails trying to construct the real `AdminGuard` (which needs `JwtService`/`ConfigService`, not provided here).

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { AdminGuard } from '../auth/admin.guard';

describe('FoodController', () => {
  let controller: FoodController;
  let service: {
    addFood: jest.Mock;
    listFood: jest.Mock;
    removeFood: jest.Mock;
    editFood: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      addFood: jest.fn(),
      listFood: jest.fn(),
      removeFood: jest.fn(),
      editFood: jest.fn(),
    };

    const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodController],
      providers: [{ provide: FoodService, useValue: service }],
    })
      .overrideGuard(AdminGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<FoodController>(FoodController);
  });

  it('addFood delegates to FoodService.addFood', () => {
    const dto = { name: 'Curry', description: 'Spicy', price: 12, category: 'Mains', imageData: 'x' };
    const expected = { success: true, message: 'Food Added' };
    service.addFood.mockReturnValue(expected);

    const result = controller.addFood(dto);

    expect(service.addFood).toHaveBeenCalledWith(dto);
    expect(result).toBe(expected);
  });

  it('listFood delegates to FoodService.listFood', () => {
    const expected = { success: true, data: [] };
    service.listFood.mockReturnValue(expected);

    const result = controller.listFood();

    expect(service.listFood).toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  it('removeFood delegates to FoodService.removeFood', () => {
    const expected = { success: true, message: 'Food Removed' };
    service.removeFood.mockReturnValue(expected);

    const result = controller.removeFood({ id: 'f1' });

    expect(service.removeFood).toHaveBeenCalledWith('f1');
    expect(result).toBe(expected);
  });

  it('editFood delegates to FoodService.editFood', () => {
    const dto = { id: 'f1', name: 'New Name' };
    const expected = { success: true, message: 'Food Updated Successfully' };
    service.editFood.mockReturnValue(expected);

    const result = controller.editFood(dto);

    expect(service.editFood).toHaveBeenCalledWith(dto);
    expect(result).toBe(expected);
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest food.controller.spec.ts`
Expected: `4 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/food/food.controller.spec.ts
git commit -m "test(backend): add FoodController unit test"
```

### Task 12: newsletter.service.spec.ts

**Files:**
- Create: `backend/src/newsletter/newsletter.service.spec.ts`

**Interfaces:**
- Consumes: `NewsletterService.subscribe(email: string)` from `backend/src/newsletter/newsletter.service.ts` (updated in Task 1, Step 4), `Subscriber`/`SubscriberDocument` from `backend/src/newsletter/schemas/subscriber.schema.ts`.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import { Resend } from 'resend';
import { NewsletterService } from './newsletter.service';
import { Subscriber } from './schemas/subscriber.schema';

const mockSend = jest.fn();
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

describe('NewsletterService', () => {
  let service: NewsletterService;
  let subscriberModel: { findOne: jest.Mock; create: jest.Mock };

  beforeEach(async () => {
    subscriberModel = { findOne: jest.fn(), create: jest.fn() };
    mockSend.mockReset();
    mockSend.mockResolvedValue({ error: null });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsletterService,
        { provide: getModelToken(Subscriber.name), useValue: subscriberModel },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('key') } },
      ],
    }).compile();

    service = module.get<NewsletterService>(NewsletterService);
  });

  it('creates a subscriber and sends the welcome email', async () => {
    subscriberModel.findOne.mockResolvedValue(null);
    subscriberModel.create.mockResolvedValue({ email: 'a@b.com' });

    const result = await service.subscribe('a@b.com');

    expect(subscriberModel.create).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(mockSend).toHaveBeenCalled();
    expect(result).toEqual({ success: true, message: 'Subscribed successfully' });
  });

  it('throws ConflictException when the email is already subscribed', async () => {
    subscriberModel.findOne.mockResolvedValue({ email: 'a@b.com' });

    await expect(service.subscribe('a@b.com')).rejects.toThrow(ConflictException);
    expect(subscriberModel.create).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest newsletter.service.spec.ts`
Expected: `2 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/newsletter/newsletter.service.spec.ts
git commit -m "test(backend): add NewsletterService unit test"
```

### Task 13: newsletter.controller.spec.ts

**Files:**
- Create: `backend/src/newsletter/newsletter.controller.spec.ts`

**Interfaces:**
- Consumes: `NewsletterController.subscribe(body: SubscribeDto)` from `backend/src/newsletter/newsletter.controller.ts`.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';

describe('NewsletterController', () => {
  let controller: NewsletterController;
  let service: { subscribe: jest.Mock };

  beforeEach(async () => {
    service = { subscribe: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsletterController],
      providers: [{ provide: NewsletterService, useValue: service }],
    }).compile();

    controller = module.get<NewsletterController>(NewsletterController);
  });

  it('delegates to NewsletterService.subscribe with the email', async () => {
    const expected = { success: true, message: 'Subscribed successfully' };
    service.subscribe.mockResolvedValue(expected);

    const result = await controller.subscribe({ email: 'a@b.com' });

    expect(service.subscribe).toHaveBeenCalledWith('a@b.com');
    expect(result).toBe(expected);
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest newsletter.controller.spec.ts`
Expected: `1 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/newsletter/newsletter.controller.spec.ts
git commit -m "test(backend): add NewsletterController unit test"
```

### Task 14: order.service.spec.ts

**Files:**
- Create: `backend/src/order/order.service.spec.ts`

**Interfaces:**
- Consumes: `OrderService.placeOrder/listOrders/userOrders/updateStatus/verifyOrder/handleStripeWebhook` from `backend/src/order/order.service.ts`, `Order`/`OrderDocument` and `User`/`UserDocument` schemas.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import Stripe from 'stripe';
import { OrderService } from './order.service';
import { Order } from './schemas/order.schema';
import { User } from '../user/schemas/user.schema';

const mockSessionsCreate = jest.fn();
const mockConstructEvent = jest.fn();
// order.service.ts does `import Stripe from 'stripe'` (default import); under this
// project's tsconfig (no esModuleInterop) that compiles to `new stripe_1.default(...)`,
// so the mock module must expose a `default` key, not a bare constructor.
jest.mock('stripe', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      checkout: { sessions: { create: mockSessionsCreate } },
      webhooks: { constructEvent: mockConstructEvent },
    })),
  };
});

describe('OrderService', () => {
  let service: OrderService;
  let orderModelCtor: jest.Mock;
  let orderModel: {
    find: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
  };
  let userModel: { findByIdAndUpdate: jest.Mock };
  let saveMock: jest.Mock;

  const placeOrderDto = {
    userId: 'u1',
    items: [{ itemId: 'i1', name: 'Curry', price: 100, quantity: 2 }],
    amount: 205,
    address: {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      street: 'St',
      city: 'City',
      state: 'State',
      zipcode: '000000',
      country: 'IN',
      phone: '0000000000',
    },
  };

  beforeEach(async () => {
    saveMock = jest.fn().mockResolvedValue(undefined);
    orderModelCtor = jest.fn().mockImplementation((doc: Record<string, unknown>) => ({
      ...doc,
      _id: { toString: () => 'order1' },
      save: saveMock,
    })) as unknown as jest.Mock;
    orderModel = Object.assign(orderModelCtor, {
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    });
    userModel = { findByIdAndUpdate: jest.fn() };
    mockSessionsCreate.mockReset();
    mockConstructEvent.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getModelToken(Order.name), useValue: orderModel },
        { provide: getModelToken(User.name), useValue: userModel },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-value'),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  describe('placeOrder', () => {
    it('creates a Stripe session, saves the order, and clears the cart', async () => {
      mockSessionsCreate.mockResolvedValue({ url: 'https://stripe/session' });
      userModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.placeOrder(placeOrderDto);

      expect(mockSessionsCreate).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('u1', { cartData: {} });
      expect(result).toEqual({ success: true, session_url: 'https://stripe/session' });
    });

    it('throws ServiceUnavailableException when Stripe is unavailable', async () => {
      mockSessionsCreate.mockRejectedValue(new Error('stripe down'));

      await expect(service.placeOrder(placeOrderDto)).rejects.toThrow(
        ServiceUnavailableException,
      );
      expect(saveMock).not.toHaveBeenCalled();
    });
  });

  it('listOrders returns all orders', async () => {
    orderModel.find.mockResolvedValue([{ orderId: 'o1' }]);

    const result = await service.listOrders();

    expect(result).toEqual({ success: true, data: [{ orderId: 'o1' }] });
  });

  it('userOrders returns orders for the given user', async () => {
    orderModel.find.mockResolvedValue([{ orderId: 'o1' }]);

    const result = await service.userOrders('u1');

    expect(orderModel.find).toHaveBeenCalledWith({ userId: 'u1' });
    expect(result).toEqual({ success: true, data: [{ orderId: 'o1' }] });
  });

  it('updateStatus updates the order status', async () => {
    orderModel.findByIdAndUpdate.mockResolvedValue({});

    const result = await service.updateStatus('o1', 'Delivered');

    expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('o1', { status: 'Delivered' });
    expect(result).toEqual({ success: true, message: 'Status Updated' });
  });

  describe('verifyOrder', () => {
    it('marks the order as paid on success', async () => {
      orderModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.verifyOrder('o1', 'true');

      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('o1', { payment: true });
      expect(result).toEqual({ success: true, message: 'Paid' });
    });

    it('deletes the order on failure', async () => {
      orderModel.findByIdAndDelete.mockResolvedValue({});

      const result = await service.verifyOrder('o1', 'false');

      expect(orderModel.findByIdAndDelete).toHaveBeenCalledWith('o1');
      expect(result).toEqual({ success: false, message: 'Not Paid' });
    });
  });

  describe('handleStripeWebhook', () => {
    it('throws BadRequestException when the webhook secret is not configured', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OrderService,
          { provide: getModelToken(Order.name), useValue: orderModel },
          { provide: getModelToken(User.name), useValue: userModel },
          { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue(undefined) } },
        ],
      }).compile();
      const unconfiguredService = module.get<OrderService>(OrderService);

      await expect(
        unconfiguredService.handleStripeWebhook(Buffer.from(''), 'sig'),
      ).rejects.toThrow(BadRequestException);
    });

    it('marks the order paid on checkout.session.completed', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: { metadata: { orderId: 'o1' } } },
      } as unknown as Stripe.Event);
      orderModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.handleStripeWebhook(Buffer.from('payload'), 'sig');

      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('o1', { payment: true });
      expect(result).toEqual({ received: true });
    });

    it('deletes the order on checkout.session.expired', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.expired',
        data: { object: { metadata: { orderId: 'o1' } } },
      } as unknown as Stripe.Event);
      orderModel.findByIdAndDelete.mockResolvedValue({});

      const result = await service.handleStripeWebhook(Buffer.from('payload'), 'sig');

      expect(orderModel.findByIdAndDelete).toHaveBeenCalledWith('o1');
      expect(result).toEqual({ received: true });
    });

    it('throws BadRequestException when signature verification fails', async () => {
      mockConstructEvent.mockImplementation(() => {
        throw new Error('bad signature');
      });

      await expect(
        service.handleStripeWebhook(Buffer.from('payload'), 'sig'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest order.service.spec.ts`
Expected: `11 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/order/order.service.spec.ts
git commit -m "test(backend): add OrderService unit test"
```

### Task 15: order.controller.spec.ts

**Files:**
- Create: `backend/src/order/order.controller.spec.ts`

**Interfaces:**
- Consumes: `OrderController.placeOrder/listOrders/userOrders/updateStatus/verifyOrder/stripeWebhook` from `backend/src/order/order.controller.ts`.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { CanActivate } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AdminGuard } from '../auth/admin.guard';

describe('OrderController', () => {
  let controller: OrderController;
  let service: {
    placeOrder: jest.Mock;
    listOrders: jest.Mock;
    userOrders: jest.Mock;
    updateStatus: jest.Mock;
    verifyOrder: jest.Mock;
    handleStripeWebhook: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      placeOrder: jest.fn(),
      listOrders: jest.fn(),
      userOrders: jest.fn(),
      updateStatus: jest.fn(),
      verifyOrder: jest.fn(),
      handleStripeWebhook: jest.fn(),
    };

    // OrderController uses @UseGuards(AdminGuard) on some routes; NestJS's
    // TestingModule eagerly resolves classes referenced via guard metadata
    // during compile(), so AdminGuard must be overridden even though these
    // unit tests call controller methods directly (bypassing the HTTP guard
    // pipeline entirely).
    const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: service }],
    })
      .overrideGuard(AdminGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('placeOrder delegates to OrderService.placeOrder', () => {
    const dto = { userId: 'u1', items: [], amount: 10, address: {} } as never;
    const expected = { success: true, session_url: 'https://stripe' };
    service.placeOrder.mockReturnValue(expected);

    expect(controller.placeOrder(dto)).toBe(expected);
    expect(service.placeOrder).toHaveBeenCalledWith(dto);
  });

  it('listOrders delegates to OrderService.listOrders', () => {
    const expected = { success: true, data: [] };
    service.listOrders.mockReturnValue(expected);

    expect(controller.listOrders()).toBe(expected);
    expect(service.listOrders).toHaveBeenCalled();
  });

  it('userOrders delegates to OrderService.userOrders', () => {
    const expected = { success: true, data: [] };
    service.userOrders.mockReturnValue(expected);

    expect(controller.userOrders({ userId: 'u1' })).toBe(expected);
    expect(service.userOrders).toHaveBeenCalledWith('u1');
  });

  it('updateStatus delegates to OrderService.updateStatus', () => {
    const expected = { success: true, message: 'Status Updated' };
    service.updateStatus.mockReturnValue(expected);

    expect(controller.updateStatus({ orderId: 'o1', status: 'Delivered' })).toBe(expected);
    expect(service.updateStatus).toHaveBeenCalledWith('o1', 'Delivered');
  });

  it('verifyOrder delegates to OrderService.verifyOrder', () => {
    const expected = { success: true, message: 'Paid' };
    service.verifyOrder.mockReturnValue(expected);

    expect(controller.verifyOrder({ orderId: 'o1', success: 'true' })).toBe(expected);
    expect(service.verifyOrder).toHaveBeenCalledWith('o1', 'true');
  });

  it('stripeWebhook delegates to OrderService.handleStripeWebhook', () => {
    const expected = { received: true };
    service.handleStripeWebhook.mockReturnValue(expected);
    const req = { body: Buffer.from('payload') } as unknown as Request;

    expect(controller.stripeWebhook(req, 'sig')).toBe(expected);
    expect(service.handleStripeWebhook).toHaveBeenCalledWith(req.body, 'sig');
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest order.controller.spec.ts`
Expected: `6 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/order/order.controller.spec.ts
git commit -m "test(backend): add OrderController unit test"
```

### Task 16: user.service.spec.ts

**Files:**
- Create: `backend/src/user/user.service.spec.ts`

**Interfaces:**
- Consumes: `UserService.loginUser/registerUser/getProfile/updateProfile` from `backend/src/user/user.service.ts`, `User`/`UserDocument` schema.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed'),
}));

describe('UserService', () => {
  let service: UserService;
  let userModelCtor: jest.Mock;
  let userModel: { findOne: jest.Mock; findById: jest.Mock };
  let saveMock: jest.Mock;
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    saveMock = jest.fn().mockResolvedValue(undefined);
    userModelCtor = jest.fn().mockImplementation((doc: Record<string, unknown>) => ({
      ...doc,
      _id: { toString: () => 'u1' },
      save: saveMock,
    })) as unknown as jest.Mock;
    userModel = Object.assign(userModelCtor, {
      findOne: jest.fn(),
      findById: jest.fn(),
    });
    jwtService = { sign: jest.fn().mockReturnValue('signed-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue(undefined) } },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
    saveMock.mockResolvedValue(undefined);
    jwtService.sign.mockReturnValue('signed-token');
  });

  describe('loginUser', () => {
    it('returns a token on valid credentials', async () => {
      userModel.findOne.mockResolvedValue({ _id: { toString: () => 'u1' }, password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.loginUser({ email: 'a@b.com', password: 'secret123' });

      expect(result).toEqual({ success: true, token: 'signed-token', role: 'user' });
    });

    it('throws UnauthorizedException when the user does not exist', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(
        service.loginUser({ email: 'missing@b.com', password: 'secret123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException on a password mismatch', async () => {
      userModel.findOne.mockResolvedValue({ _id: { toString: () => 'u1' }, password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.loginUser({ email: 'a@b.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('registerUser', () => {
    it('creates a user and returns a token', async () => {
      userModel.findOne.mockResolvedValue(null);

      const result = await service.registerUser({
        name: 'A',
        email: 'a@b.com',
        password: 'secret123',
      });

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ success: true, token: 'signed-token', role: 'user' });
    });

    it('throws ConflictException when the email is already registered', async () => {
      userModel.findOne.mockResolvedValue({ email: 'a@b.com' });

      await expect(
        service.registerUser({ name: 'A', email: 'a@b.com', password: 'secret123' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getProfile', () => {
    it('returns the user profile', async () => {
      userModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ name: 'A', email: 'a@b.com' }),
      });

      const result = await service.getProfile('u1');

      expect(result).toEqual({ success: true, data: { name: 'A', email: 'a@b.com' } });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userModel.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      await expect(service.getProfile('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('updates the name and saves', async () => {
      const existing = { name: 'Old', password: 'hashed', save: saveMock };
      userModel.findById.mockResolvedValue(existing);

      const result = await service.updateProfile({ userId: 'u1', name: 'New Name' });

      expect(existing.name).toBe('New Name');
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ success: true, message: 'Profile updated successfully' });
    });

    it('throws NotFoundException when the user does not exist', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.updateProfile({ userId: 'missing' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest user.service.spec.ts`
Expected: `9 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/user/user.service.spec.ts
git commit -m "test(backend): add UserService unit test"
```

### Task 17: user.controller.spec.ts

**Files:**
- Create: `backend/src/user/user.controller.spec.ts`

**Interfaces:**
- Consumes: `UserController.loginUser/registerUser/getProfile/updateProfile` from `backend/src/user/user.controller.ts`.

- [ ] **Step 1: Write the test**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: {
    loginUser: jest.Mock;
    registerUser: jest.Mock;
    getProfile: jest.Mock;
    updateProfile: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      loginUser: jest.fn(),
      registerUser: jest.fn(),
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: service }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('loginUser delegates to UserService.loginUser', () => {
    const dto = { email: 'a@b.com', password: 'secret123' };
    const expected = { success: true, token: 't', role: 'user' };
    service.loginUser.mockReturnValue(expected);

    expect(controller.loginUser(dto)).toBe(expected);
    expect(service.loginUser).toHaveBeenCalledWith(dto);
  });

  it('registerUser delegates to UserService.registerUser', () => {
    const dto = { name: 'A', email: 'a@b.com', password: 'secret123' };
    const expected = { success: true, token: 't', role: 'user' };
    service.registerUser.mockReturnValue(expected);

    expect(controller.registerUser(dto)).toBe(expected);
    expect(service.registerUser).toHaveBeenCalledWith(dto);
  });

  it('getProfile delegates to UserService.getProfile', () => {
    const expected = { success: true, data: {} };
    service.getProfile.mockReturnValue(expected);

    expect(controller.getProfile({ userId: 'u1' })).toBe(expected);
    expect(service.getProfile).toHaveBeenCalledWith('u1');
  });

  it('updateProfile delegates to UserService.updateProfile', () => {
    const dto = { userId: 'u1', name: 'New Name' };
    const expected = { success: true, message: 'Profile updated successfully' };
    service.updateProfile.mockReturnValue(expected);

    expect(controller.updateProfile(dto)).toBe(expected);
    expect(service.updateProfile).toHaveBeenCalledWith(dto);
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest user.controller.spec.ts`
Expected: `4 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/user/user.controller.spec.ts
git commit -m "test(backend): add UserController unit test"
```

### Task 18: http-exception.filter.spec.ts

**Files:**
- Create: `backend/src/common/filters/http-exception.filter.spec.ts`

**Interfaces:**
- Consumes: `AllExceptionsFilter.catch(exception, host)` from `backend/src/common/filters/http-exception.filter.ts`.

- [ ] **Step 1: Write the test**

```ts
import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './http-exception.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let status: jest.Mock;
  let json: jest.Mock;
  let host: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
      }),
    } as unknown as ArgumentsHost;
  });

  it('maps an HttpException with a string message', () => {
    filter.catch(new BadRequestException('Invalid input'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({ success: false, message: 'Invalid input' });
  });

  it('joins an array of validation messages into a single string', () => {
    filter.catch(new BadRequestException(['name is required', 'email is invalid']), host);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: 'name is required, email is invalid',
    });
  });

  it('maps a generic Error to a 500 with its message', () => {
    filter.catch(new Error('boom'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith({ success: false, message: 'boom' });
  });

  it('maps a non-Error, non-HttpException value to a generic 500 message', () => {
    filter.catch('unexpected string throw', host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith({ success: false, message: 'Internal server error' });
  });
});
```

- [ ] **Step 2: Run and verify pass**

Run: `cd backend && npx jest http-exception.filter.spec.ts`
Expected: `4 passed`.

- [ ] **Step 3: Commit**

```bash
cd backend
git add src/common/filters/http-exception.filter.spec.ts
git commit -m "test(backend): add AllExceptionsFilter unit test"
```

### Task 19: Full verification pass

**Files:** None created/modified — verification only.

- [ ] **Step 1: Run the full test suite with coverage**

Run: `cd backend && npm run test:cov`
Expected: all suites pass (`app.controller.spec.ts` plus the 16 new spec files = 17 suites), 0 failures.

- [ ] **Step 2: Run lint and format checks**

Run:
```bash
cd backend
npx prettier --check "src/**/*.ts" "test/**/*.ts"
npm run lint
```
Expected: both exit 0 with no errors.

- [ ] **Step 3: Run the production build**

Run: `cd backend && npm run build`
Expected: exits 0.

- [ ] **Step 4: Confirm no stray dead files remain**

Run: `cd backend && test -f src/auth/auth.controller.ts && echo STILL_EXISTS || echo REMOVED`
Expected: `REMOVED`.

No commit for this task — it's a verification gate, not a code change. If any check fails, return to the relevant task above and fix before proceeding.
