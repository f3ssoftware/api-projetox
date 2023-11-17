import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString } from 'class-validator';

export class CognitoConfirmUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumberString()
  token: string;
}
