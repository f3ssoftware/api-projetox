import { PagarmeAddress } from './pagarme-address.dto';

export interface PagarmePlasticDto {
  number: string;
  holder_name: string;
  holder_document: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  brand: string;
  billing_address: PagarmeAddress;
}
