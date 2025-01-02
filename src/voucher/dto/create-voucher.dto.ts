import { IsString, IsEnum, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  code: string;

  @IsEnum(['PERCENTAGE', 'AMOUNT'])
  type: 'PERCENTAGE' | 'AMOUNT';

  @IsNumber()
  @Min(0)
  value: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUsage?: number;

  @IsOptional()
  @IsDateString()
  expirationDate?: Date;

  @IsString()
  campaignId: string;
}
