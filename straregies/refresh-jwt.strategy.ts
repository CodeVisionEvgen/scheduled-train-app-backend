import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TransferJwt } from 'src/auth/dto/transfer-jwt.dto';
import { UserService } from 'src/user/user.service';

const refreshTokenExtractor = (req: Request): string | null => {
  if (!req?.cookies) return null;
  return req.cookies['RefreshToken'] ?? null;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([refreshTokenExtractor]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') || '',
    });
  }

  async validate(payload: TransferJwt) {
    return this.userService.findOneById(payload.id);
  }
}
