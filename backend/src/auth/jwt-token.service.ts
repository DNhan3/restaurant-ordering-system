import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AuthUser, JwtPayload } from './auth.types.js';

const base64UrlEncode = (value: string | Buffer) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const base64UrlDecode = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '=',
  );
  return Buffer.from(padded, 'base64').toString('utf8');
};

@Injectable()
export class JwtTokenService {
  constructor(private readonly configService: ConfigService) {}

  sign(user: AuthUser) {
    const now = Math.floor(Date.now() / 1000);
    const expiresInSeconds = this.getTokenTtlSeconds();
    const payload: JwtPayload = {
      ...user,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = this.signData(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  verify(token: string): JwtPayload {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid token');
    }

    const expectedSignature = this.signData(`${encodedHeader}.${encodedPayload}`);
    const expected = Buffer.from(expectedSignature);
    const actual = Buffer.from(signature);

    if (
      expected.length !== actual.length ||
      !timingSafeEqual(expected, actual)
    ) {
      throw new UnauthorizedException('Invalid token');
    }

    let payload: JwtPayload;
    try {
      payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    if (!payload.sub || !payload.role || !payload.exp) {
      throw new UnauthorizedException('Invalid token');
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token expired');
    }

    return payload;
  }

  private signData(data: string) {
    return createHmac('sha256', this.getSecret())
      .update(data)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private getSecret() {
    const secret = this.configService.get<string>('JWT_SECRET');

    if (secret) {
      return secret;
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be configured in production');
    }

    return 'qfood-local-development-secret-change-me';
  }

  private getTokenTtlSeconds() {
    const configured = Number(this.configService.get<string>('JWT_TTL_SECONDS'));
    return Number.isFinite(configured) && configured > 0
      ? configured
      : 60 * 60 * 24;
  }
}

