import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { PagarmePaymentMethods } from '../enums/pagarme-payment-methods.enum';
import { CardDto } from './card.dto';
import { CustomerDto } from './customer.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '../entities/product.inteface';
import { Type } from 'class-transformer';

export class CheckoutDto {
  @ApiProperty()
  @IsEnum(PagarmePaymentMethods)
  payment_method: PagarmePaymentMethods;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CardDto)
  card?: CardDto;

  @ApiProperty()
  @IsArray({})
  products: string[];
}
