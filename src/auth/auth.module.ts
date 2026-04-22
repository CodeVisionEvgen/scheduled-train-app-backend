import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from 'straregies/refresh-jwt.strategy';
import { AccessTokenStrategy } from 'straregies/access-jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenStrategy, AccessTokenStrategy],
  imports: [UserModule, JwtModule],
})
export class AuthModule {}
