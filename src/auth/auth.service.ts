import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from '../config/config';

@Injectable()
export class AuthService {
  private configJwt = { secret: config().jwtSecret, expiresIn: '3650d' };

  constructor(private jwtService: JwtService) {}

  createToken(username: string, _id: string): string {
    return this.jwtService.sign({ username, _id }, this.configJwt);
  }

  validateUser(token: string): any {
    const { _id, username } = this.jwtService.verify(token, this.configJwt);
    return { _id, username };
  }
}
