import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const scope = this.reflector.get<string[]>('scope', context.getHandler());

    if (!scope) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const { authorization = '' } = request.headers;
    const [type, token] = authorization.split(' ');
    if (!authorization || type !== 'Bearer' || !token) {
      return false;
    }

    try {
      const userData = await this.authService.validateUser(token);
      const [user] = await this.userService.findAll(userData);
      if (!user) {
        return false;
      }

      return user.scope.some(item => scope.indexOf(item) > -1);
    } catch (error) {
      throw new HttpException('Token: ' + error.message, HttpStatus.FORBIDDEN);
    }
  }
}
