import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'O atributo "username" não pode ser vazio' })
  @IsString({ message: 'O atributo "username" deve ser uma string' })
  public username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O atributo "password" não pode ser vazio' })
  @IsString({ message: 'O atributo "password" deve ser uma string' })
  public password: string;
}
