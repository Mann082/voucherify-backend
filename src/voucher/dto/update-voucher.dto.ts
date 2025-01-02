import { IsOptional, IsString, IsNumber, Min, Max, IsIn, IsDateString } from 'class-validator';

export class UpdateVoucherDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  @IsIn(['PERCENTAGE', 'AMOUNT'])
  type?: 'PERCENTAGE' | 'AMOUNT';

  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUsagePerUser?: number;

  
  @IsNumber()
  @IsOptional()
  maxDiscount: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  totalUsages?: number;

  @IsOptional()
  @IsString()
  @IsIn(['ACTIVE', 'EXPIRED', 'USED'])
  status?: 'ACTIVE' | 'EXPIRED' | 'USED';

  @IsOptional()
  @IsDateString()
  expirationDate?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentUsage?: number;

  @IsString()
  campaignId?: string;
}
