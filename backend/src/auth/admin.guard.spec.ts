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
    guard = new AdminGuard(
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
    );
  });

  it('allows access for a valid admin token', async () => {
    jwtService.verifyAsync.mockResolvedValue({ id: 'u1', role: 'admin' });

    await expect(
      guard.canActivate(contextWithHeader('Bearer good-token')),
    ).resolves.toBe(true);
  });

  it('throws ForbiddenException when no authorization header is present', async () => {
    await expect(
      guard.canActivate(contextWithHeader(undefined)),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when the token role is not admin', async () => {
    jwtService.verifyAsync.mockResolvedValue({ id: 'u1', role: 'user' });

    await expect(
      guard.canActivate(contextWithHeader('Bearer good-token')),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when token verification fails', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid signature'));

    await expect(
      guard.canActivate(contextWithHeader('Bearer bad-token')),
    ).rejects.toThrow(ForbiddenException);
  });
});
