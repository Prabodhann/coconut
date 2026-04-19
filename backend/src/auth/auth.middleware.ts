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
    const token = req.headers['token'] as string;

    if (!token) {
      return res.json({
        success: false,
        message: 'Not Authorized Login Again',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ id: string }>(token, {
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
