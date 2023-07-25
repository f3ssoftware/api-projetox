import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDateString } from 'class-validator';

export class PayTransactionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fine_amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fee_amount?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  payment_date: Date;
}
