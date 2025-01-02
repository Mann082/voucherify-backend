import { IsString, IsNotEmpty, IsIn, IsNumber, IsOptional, Min, IsDateString, isNumber } from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsIn(['PERCENTAGE', 'AMOUNT'])
  type: 'PERCENTAGE' | 'AMOUNT';

  @IsNumber()
  @Min(0)
  value: number;

  @IsNumber()
  @IsOptional()
  maxDiscount: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxLimit?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  maxUsagePerUser?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  totalUsages?: number;

  @IsString()
  @IsIn(['ACTIVE', 'EXPIRED', 'USED'])
  @IsOptional()
  status?: 'ACTIVE' | 'EXPIRED' | 'USED';

  @IsDateString()
  @IsOptional()
  expirationDate?: Date;

  @IsString()
  campaignId?: string;
}
