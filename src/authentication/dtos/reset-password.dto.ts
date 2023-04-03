import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O atributo "password" não pode ser vazio' })
  @IsString({ message: 'O atributo "password" deve ser uma string' })
  password?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O atributo "isTemporary" não pode ser vazio' })
  @IsBoolean()
  isTemporary: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'O atributo "isTemporary" não pode ser vazio' })
  @IsBoolean()
  isGenerated = false;
}
