import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEmail, IsString } from 'class-validator';
import { CognitoAddress } from './cognito-address.dto';

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
  address: CognitoAddress;
}
