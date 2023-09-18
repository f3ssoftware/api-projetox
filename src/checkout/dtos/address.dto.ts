import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PagarmeCountries } from '../enums/pagarme-country-enum';

export class AddressDto {
  @ApiProperty()
  @IsString()
  zipcode: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  address: string;
  @ApiProperty()
  @IsNumber()
  number: number;

  @ApiProperty()
  @IsEnum(PagarmeCountries)
  country: PagarmeCountries;
}
