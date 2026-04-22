import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { AccessTokenGuard } from 'guards/access-jwt.guard';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  @UseGuards(AccessTokenGuard)
  @Get('me')
  whoame(@Req() req: Request) {
    return { ...req.user, password: '' } as User;
  }
}
