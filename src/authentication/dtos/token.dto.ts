import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TokenDTO {
  @ApiProperty()
  @IsString()
  access_token: string;

  @ApiProperty()
  @IsNumber()
  expires_in: number;

  @ApiProperty()
  @IsNumber()
  refresh_expires_in: number;

  @ApiProperty()
  @IsString()
  refresh_token: string;

  @ApiProperty()
  @IsString()
  token_type: string;

  @ApiProperty()
  @IsString()
  session_state: string;

  @ApiProperty()
  @IsString()
  scope: string;
}
