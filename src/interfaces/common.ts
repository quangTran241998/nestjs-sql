import { ROLE_ID_ENUM } from 'src/modules/auth/roles/roles.enum';

export interface ResponseCommon<T> {
  statusCode: number;
  message: string | unknown;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: string;
  size?: string;
}

export interface PaginationResponse {
  page: number;
  size: number;
  total: number;
}

export type PayloadToken = {
  username: string;
  id: string;
  roleId: ROLE_ID_ENUM;
  isActive: boolean;
  isEmailVerified: boolean;
  email: string;
};
