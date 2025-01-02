import { IsString, IsNumber, Min } from 'class-validator';

export class RedeemVoucherDto {
  @IsString()
  code: string;

  @IsNumber()
  @Min(0)
  orderAmount: number;

  @IsString()
  userId: string;
}
