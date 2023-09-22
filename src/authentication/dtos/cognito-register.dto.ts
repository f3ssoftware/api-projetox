import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEmail, IsString } from 'class-validator';

export class CognitoRegister {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsString()
  given_name: string;

  @ApiProperty()
  @IsString()
  family_name: string;

  @ApiProperty()
  @IsDateString()
  birthdate: string;

  @ApiPropertyOptional()
  address: {
    state: string;
    city: string;
    district: string;
    zipcode: string;
    number: string;
    complement: string;
  };
}
