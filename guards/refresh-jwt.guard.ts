import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../src/user/entities/user.entity';
import { INVALID_TOKEN } from 'src/auth/auth.constants';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-jwt') {
  constructor() {
    super();
  }
  handleRequest(
    err: any,
    user: User,
    info: any,
    context: ExecutionContext,
  ): any {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const refreshToken = request.cookies['RefreshToken'];

    function clearCookieAndThrowError() {
      response.clearCookie('AccessToken');
      response.clearCookie('RefreshToken');
      throw new UnauthorizedException(INVALID_TOKEN);
    }

    if (!refreshToken) {
      return clearCookieAndThrowError();
    }

    if (!user || err) {
      return clearCookieAndThrowError();
    }

    return user;
  }
}
