import { PagarmeCreditCardDto } from './pagarme-credit-card.dto';
import { PagarmePixDto } from './pagarme-pix.dto';

export interface PagarmePaymentDto {
  payment_method: string;
  credit_card?: PagarmeCreditCardDto;
  pix?: PagarmePixDto;
  amount: number;
}
