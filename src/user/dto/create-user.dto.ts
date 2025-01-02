import { IsEmail, IsString, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(['ADMIN', 'CUSTOMER'])
  role: 'ADMIN' | 'CUSTOMER';
}
