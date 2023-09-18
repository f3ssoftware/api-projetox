import { PagarmeCustomerDto } from './pagarme-customer.dto';
import { PagarmeItemDto } from './pagarme-item.dto';
import { PagarmePaymentDto } from './pagarme-payment.dto';

export interface PagarmeOrderDto {
  customer: PagarmeCustomerDto;
  items: PagarmeItemDto[];
  payments: PagarmePaymentDto[];
  closed: boolean;
  anti_fraud_enabled: boolean;
}
