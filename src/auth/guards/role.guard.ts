import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthService } from '../auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService
  ) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some(role => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { authorization }: any = request.headers;

    if (!authorization) {
      throw new UnauthorizedException('Provide  token');
    }

    const authToken = authorization.replace(/bearer/gim, '').trim();

    const user = await this.authService.getUserByToken(authToken);

    if (!user) {
      return false;
    }

    return this.matchRoles(roles, user.role);
  }
}
