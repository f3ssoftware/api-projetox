import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class KeycloakUserRepresentationDTO {
  @IsOptional()
  // @IsMap([isString], [isString], {
  //   message: 'O atributo "access" deve ser um Map<string, string>',
  // })
  access?: Map<string, string>;

  @IsOptional()
  // @IsMap([isString], [isString], {
  //   message: 'O atributo "attributes" deve ser um Map<string, string>',
  // })
  attributes?: Map<string, string>;

  @IsOptional()
  @IsArray({ message: 'O atributo "clientConsents" deve ser um array' })
  clientConsents?: any[];

  @IsOptional()
  clientRoles?: Map<string, string>;

  @IsOptional()
  @IsNumber({}, { message: 'O atributo "createdTimestamp" deve ser um número' })
  createdTimestamp?: number;

  @IsOptional()
  @IsArray({ message: 'O atributo "credentials" deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => KeycloakCredentialsDTO)
  credentials?: KeycloakCredentialsDTO[];

  @IsOptional()
  @IsArray({
    message: 'O atributo "disableableCredentialTypes" deve ser um array',
  })
  @ValidateNested({ each: true })
  @Type(() => String)
  disableableCredentialTypes?: string[];

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean({ message: 'O atributo "emailVerified" deve ser um boolean' })
  emailVerified?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'O atributo "enabled" deve ser um boolean' })
  enabled?: boolean;

  @IsOptional()
  @IsArray({ message: 'O atributo "federatedIdentities" deve ser um array' })
  federatedIdentities?: any[];

  @IsOptional()
  @IsString({ message: 'O atributo "federationLink" deve ser uma string' })
  federationLink?: string;

  @IsOptional()
  @IsString({ message: 'O atributo "firstName" deve ser uma string' })
  firstName?: string;

  @IsOptional()
  @IsArray({ message: 'O atributo "groups" deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => String)
  groups?: string[];

  @IsOptional()
  @IsString({ message: 'O atributo "value" deve ser uma string' })
  id?: string;

  @IsOptional()
  @IsString({ message: 'O atributo "value" deve ser uma string' })
  lastName?: string;

  @IsOptional()
  @IsNumber({}, { message: 'O atributo "notBefore" deve ser um número' })
  notBefore?: number;

  @IsOptional()
  @IsString({ message: 'O atributo "value" deve ser uma string' })
  origin?: string;

  @IsOptional()
  @IsArray({ message: 'O atributo "realmRoles" deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => String)
  realmRoles?: string[];

  @IsOptional()
  @IsArray({ message: 'O atributo "requiredActions" deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => String)
  requiredActions?: string[];

  @IsOptional()
  @IsString({ message: 'O atributo "value" deve ser uma string' })
  self?: string;

  @IsOptional()
  @IsString({ message: 'O atributo "value" deve ser uma string' })
  serviceAccountClientId?: string;

  @IsOptional()
  @IsString({ message: 'O atributo "value" deve ser uma string' })
  username?: string;
}

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
