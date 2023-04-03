import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class KeycloakCredentialsDTO {
  @IsNotEmpty({ message: 'O atributo "type" não pode ser vazio' })
  @IsString({ message: 'O atributo "type" deve ser uma string' })
  type: string;

  @IsNotEmpty({ message: 'O atributo "value" não pode ser vazio' })
  @IsString({ message: 'O atributo "value" deve ser uma string' })
  value: string;

  @IsBoolean({ message: 'O atributo "temporary" deve ser um boolean' })
  temporary: boolean;
}
