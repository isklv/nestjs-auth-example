import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import config from '../config/config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: config().jwtSecret,
      signOptions: { expiresIn: '3650d' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
