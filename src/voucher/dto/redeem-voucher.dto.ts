import { IsString, IsNotEmpty } from 'class-validator';

export class RedeemVoucherDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
