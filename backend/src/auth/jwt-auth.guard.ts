import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtTokenService } from './jwt-token.service.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: unknown }>();
    const authHeader = request.header('authorization') ?? '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Authentication required');
    }

    request.user = this.jwtTokenService.verify(token);
    return true;
  }
}
