import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import {
  EMAIL_OR_PASSWORD_NOT_VALIDE,
  ERROR_USER_EXISTS,
} from './auth.constants';
import { UserService } from 'src/user/user.service';
import { type Request, type Response } from 'express';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from 'guards/refresh-jwt.guard';
import { User } from 'src/user/entities/user.entity';
import { AccessTokenStrategy } from 'straregies/access-jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AccessTokenStrategy)
  @Post('logout')
  async logout(@Res() res: Response) {
    this.clearCookies(res);
    res.json({ status: 'ok' });
  }

  @Post('signin')
  async signin(@Body() signin: SigninDto, @Res() res: Response) {
    const { email, password } = signin;
    const findUser = await this.userService.findOneByEmail(email);

    if (!findUser)
      throw new UnauthorizedException(EMAIL_OR_PASSWORD_NOT_VALIDE);

    const isValidePass = await bcrypt.compare(password, findUser.password);

    if (!isValidePass)
      throw new UnauthorizedException(EMAIL_OR_PASSWORD_NOT_VALIDE);

    const { accessToken, refreshToken } =
      await this.authService.generateTokens(findUser);

    this.setAuthCookies(res, refreshToken, accessToken);

    res.json({
      email,
      status: 'ok',
    });
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    const { email, password } = signupDto;
    const findUser = await this.userService.findOneByEmail(email);

    if (findUser) throw new UnauthorizedException(ERROR_USER_EXISTS);

    const encryptedPasswd = await bcrypt.hash(password, 13);

    const newUser = await this.userService.createUser({
      email: signupDto.email,
      password: encryptedPasswd,
    });

    const { accessToken, refreshToken } =
      await this.authService.generateTokens(newUser);

    this.setAuthCookies(res, refreshToken, accessToken);

    res.json({
      email,
      status: 'ok',
    });
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const findUser = await this.userService.findOneByEmail(user.email);

    if (!findUser) throw new UnauthorizedException();

    const { accessToken, refreshToken } =
      await this.authService.generateTokens(user);

    this.setAuthCookies(res, refreshToken, accessToken);

    res.json({
      email: user.email,
      status: 'ok',
    });
  }
  private clearCookies(res: Response) {
    res.clearCookie('RefreshToken');
    res.clearCookie('AccessToken');
  }
  private setAuthCookies(
    res: Response,
    RefreshToken: string,
    AccessToken: string,
  ) {
    res.cookie('RefreshToken', RefreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.cookie('AccessToken', AccessToken, {
      secure: true,
    });
  }
}
