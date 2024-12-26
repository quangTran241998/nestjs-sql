import { SetMetadata } from '@nestjs/common';
import { ROLE_ID_ENUM } from './roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLE_ID_ENUM[]) => SetMetadata(ROLES_KEY, roles);
