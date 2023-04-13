import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserRegistrationDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString({ message: 'O atributo "password" deve ser uma string' })
  password: string;

  @ApiProperty()
  @IsString({ message: 'O atributo "firstName" deve ser uma string' })
  firstName?: string;

  @ApiProperty()
  @IsString({ message: 'O atributo "lastName" deve ser uma string' })
  lastName?: string;
}
