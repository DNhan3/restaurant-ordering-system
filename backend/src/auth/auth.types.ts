export type UserRole = 'customer' | 'shipper' | 'admin';

export type AuthUser = {
  sub: number;
  id?: number;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
};

export type JwtPayload = AuthUser & {
  iat: number;
  exp: number;
};
