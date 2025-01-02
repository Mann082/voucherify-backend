import { IsEmail, IsString, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(['ADMIN', 'CUSTOMER'])
  role: 'ADMIN' | 'CUSTOMER';
}
