import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, Max } from 'class-validator';

export class PhoneNumberDto {
  @ApiProperty()
  @IsNumberString()
  @Max(3)
  country_code: string;

  @ApiProperty()
  @IsNumberString()
  @Max(2)
  area_code: string;

  @ApiProperty()
  @IsNumberString()
  number: string;
}
