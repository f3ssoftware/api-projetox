import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEmail, IsString, Matches } from 'class-validator';
import { CognitoAddress } from './cognito-address.dto';

export class CognitoRegister {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z]).{8,}$/, {
    message: 'Senha precisa ter pelo menos 1 número, 1 caracter especial, 1 letra maiuscula e 1 letra minúscula.'
  })
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
