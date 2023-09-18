import { IsArray, IsEnum, IsObject } from 'class-validator';
import { PagarmePaymentMethods } from '../enums/pagarme-payment-methods.enum';
import { CardDto } from './card.dto';
import { CustomerDto } from './customer.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '../entities/product.inteface';

export class CheckoutDto {
  @ApiProperty()
  @IsEnum(PagarmePaymentMethods)
  payment_method: PagarmePaymentMethods;

  @ApiProperty()
  @IsObject()
  customer: CustomerDto;

  @ApiPropertyOptional()
  // @IsObject({ message: 'Objeto card não informado' })
  card?: CardDto;

  @ApiProperty()
  @IsArray()
  products: Product[];
}
