import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../src/user/user.service';
import { TransferJwt } from 'src/auth/dto/transfer-jwt.dto';
import { type Request } from 'express';

const accessTokenExtractor = (req: Request): string | null => {
  if (!req?.cookies) return null;
  return req.cookies['AccessToken'] ?? null;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-jwt',
) {
  constructor(
    configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([accessTokenExtractor]),
      secretOrKey: configService.get('JWT_ACCESS_SECRET') || '',
    });
  }

  async validate(payload: TransferJwt) {
    return this.userService.findOneById(payload.id);
  }
}
