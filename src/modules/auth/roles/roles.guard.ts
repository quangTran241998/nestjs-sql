import { AuthService } from 'src/modules/auth/auth.service';
import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { ROLE_ID_ENUM } from './roles.enum';
import { ResponseService } from 'src/modules/response-common/response-common.service';
import { HttpStatusMessages } from 'src/constants/http-status-message';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private readonly responseService: ResponseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE_ID_ENUM[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      await this.responseService.error(
        'test.response.notToken',
        HttpStatus.UNAUTHORIZED,
        HttpStatusMessages[HttpStatus.UNAUTHORIZED],
      );
    }

    try {
      const decoded = await this.authService.decodeToken(token);
      const userRoleId = decoded.roleId;
      const isPermisson = requiredRoles.includes(userRoleId);
      if (isPermisson) {
        return isPermisson;
      } else {
        await this.responseService.error(
          'test.response.notPermisson',
          HttpStatus.FORBIDDEN,
          HttpStatusMessages[HttpStatus.FORBIDDEN],
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
