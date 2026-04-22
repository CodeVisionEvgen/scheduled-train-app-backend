import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async generateTokens(user: User) {
    const refreshToken = await this.jwtService.signAsync(
      { id: user.id, email: user.email },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET') || '',
        expiresIn: '3d',
      },
    );
    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET') || '',
        expiresIn: '15m',
      },
    );

    return { accessToken, refreshToken };
  }
}
