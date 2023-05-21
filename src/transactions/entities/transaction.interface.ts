import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'aws-sdk/clients/lakeformation';
import { Installment } from './installment.interface';

export interface TransactionKey {
  id: string;
}

export interface Transaction extends TransactionKey {
  code: number;
  wallet_id: string;
  amount: number;
  createdAt: Date;
  supplier: string;
  paid: boolean;
  type: TransactionType;
  observation?: string;
  installments?: Installment[];
}

//     createdAt: new Date(),
//     supplier: 'Magnâmio de Amorim',
//     amount: 30982.3,
//     paid: false,
//     type: 'BILLING',
//     observation: 'Empréstimo',
//     installments:
