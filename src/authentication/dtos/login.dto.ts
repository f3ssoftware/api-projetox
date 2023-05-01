import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Field "username" is required' })
  @IsString({ message: 'Field "username" should be string' })
  public username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Field "password" is required' })
  @IsString({ message: 'Field "password" should be a string' })
  public password: string;
}
