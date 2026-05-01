import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'] as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({
        success: false,
        message: 'Not Authorized Login Again',
      });
    }

    const token = authHeader.slice(7);
    try {
      const payload = await this.jwtService.verifyAsync<{
        id: string;
        role: string;
      }>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      (req.body as Record<string, string>).userId = payload.id;
      next();
    } catch (error) {
      const err = error as Error;
      return res.json({ success: false, message: err.message });
    }
  }
}
