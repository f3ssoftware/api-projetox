import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'aws-sdk/clients/lakeformation';

export interface TransactionKey {
  id: string;
}

export interface Transaction extends TransactionKey {
  code: number;
  amount: number;
  createdAt: Date;
  supplier: string;
  paid: boolean;
  type: TransactionType;
  observation: string;
  installments: any[];
}

//     createdAt: new Date(),
//     supplier: 'Magnâmio de Amorim',
//     amount: 30982.3,
//     paid: false,
//     type: 'BILLING',
//     observation: 'Empréstimo',
//     installments:
