import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';
import { IsDate, IsEnum, IsObject, IsString } from 'class-validator';
import { PhoneNumberDto } from './phone-number.dto';
import { PagarmeDocumentTypes } from '../enums/pagarme-document-types.enum';
import { PagarmeCustomerTypes } from '../enums/pagarme-customer-types.enum';

export class CustomerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsObject()
  phone_number: PhoneNumberDto;

  @ApiProperty()
  @IsString()
  document: string;

  @ApiProperty()
  @IsEnum(PagarmeDocumentTypes)
  document_type: PagarmeDocumentTypes;

  @ApiProperty()
  @IsEnum(PagarmeCustomerTypes)
  type: PagarmeCustomerTypes;

  @ApiProperty()
  @IsObject()
  address: AddressDto;

  @ApiProperty()
  @IsDate()
  birthDate: Date;

  @ApiProperty()
  @IsString()
  gender: string;
}
