import { PagarmePlasticDto } from './pagarme-plastic.dto';

export interface PagarmeCreditCardDto {
  operation_type: string;
  installments: number;
  statement_descriptor: string;
  card?: PagarmePlasticDto;
  card_id?: string;
  card_token?: string;
}
