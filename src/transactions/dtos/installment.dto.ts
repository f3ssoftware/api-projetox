import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, Max, Min } from 'class-validator';

export class InstallmentDto {
  @ApiProperty()
  @IsNumber()
  amount?: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(12)
  number?: number;

  @ApiProperty()
  @IsDateString()
  due_date?: Date;

  @ApiProperty()
  @IsBoolean()
  paid?: boolean;
}
