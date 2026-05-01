import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'] as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Admin access required');
    }

    const token = authHeader.slice(7);
    try {
      const payload = await this.jwtService.verifyAsync<{
        id: string;
        role: string;
      }>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      if (payload.role !== 'admin') {
        throw new ForbiddenException('Admin access required');
      }
      return true;
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
      throw new ForbiddenException('Admin access required');
    }
  }
}
