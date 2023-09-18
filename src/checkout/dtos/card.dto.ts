import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CardDto {
  @ApiProperty()
  @IsString()
  card_name: string;

  @ApiProperty()
  @IsString()
  card_number: string;

  @ApiProperty()
  @IsString()
  exp_month: string;

  @ApiProperty()
  @IsString()
  exp_year: string;

  @ApiProperty()
  @IsString()
  cvv: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(12)
  installments: number;
}
