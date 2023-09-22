import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CognitoConfirmPasswordDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}
