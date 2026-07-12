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
    const req = {
      headers: { authorization: 'Bearer good-token' },
      body: {},
    } as unknown as Request;

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
    const req = {
      headers: { authorization: 'Bearer bad-token' },
      body: {},
    } as unknown as Request;

    await middleware.use(req, res, next);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: 'jwt expired',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
