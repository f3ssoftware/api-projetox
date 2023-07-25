import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'aws-sdk/clients/lakeformation';
import { Installment } from './installment.interface';

export interface TransactionKey {
  id?: string;
}

export interface Transaction extends TransactionKey {
  wallet_id?: string;
  amount?: number;
  created_at?: Date;
  paid?: boolean;
  type?: TransactionType;
  observation?: string;
  reference?: string;
  installments?: Installment[];
  due_date?: Date;
  parent_transaction_id?: string;
  fine_amount?: number;
  fee_amount?: number;
  payment_date?: Date;
}

//     createdAt: new Date(),
//     supplier: 'Magnâmio de Amorim',
//     amount: 30982.3,
//     paid: false,
//     type: 'BILLING',
//     observation: 'Empréstimo',
//     installments:
