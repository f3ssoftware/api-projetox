import { ApiProperty } from '@nestjs/swagger';
import { CognitoStates } from '../enums/cognito-states.enum';
import { IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CognitoAddress {
  @ApiProperty()
  @IsEnum(CognitoStates)
  state: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsNumberString()
  zipcode: string;

  @ApiProperty()
  @IsNumber()
  number: string;

  @ApiProperty()
  @IsString()
  complement: string;
}
