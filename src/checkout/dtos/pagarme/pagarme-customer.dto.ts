import { PagarmeAddress } from './pagarme-address.dto';
import { PagarmePhoneDto } from './pagarme-phone.dto';

export interface PagarmeCustomerDto {
  name: string;
  type: string;
  email: string;
  code: string;
  document: string;
  document_type: string;
  gender: string;
  address?: PagarmeAddress;
  phones: {
    home_phone?: PagarmePhoneDto;
    mobile_phone?: PagarmePhoneDto;
  };
  birthdate: Date;
}
