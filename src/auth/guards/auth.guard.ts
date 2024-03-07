import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;

      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please, provide token');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      request.decodedData = await this.authService.validateToken(authToken);
      return true;
    } catch (e) {
      throw new ForbiddenException(e.message || 'Session expired! Please sign In');
    }
  }
}
