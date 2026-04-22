import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @MaxLength(80)
  @MinLength(6)
  email: string;

  @IsString()
  @MaxLength(30)
  @MinLength(8)
  password: string;
}
