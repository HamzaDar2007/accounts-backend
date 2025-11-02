import { UserRole, Language } from '../enums/country.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  companyId: string;
  role: UserRole;
  language: Language;
  iat?: number;
  exp?: number;
}

export interface TenantRequest extends Request {
  user: JwtPayload;
  tenantId: string;
}