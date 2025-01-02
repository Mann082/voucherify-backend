import { IsString, IsDateString, IsArray, IsOptional } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsArray()
  vouchers?: string[];
}
