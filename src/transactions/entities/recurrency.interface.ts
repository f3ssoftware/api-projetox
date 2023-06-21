import { TransactionType } from 'aws-sdk/clients/lakeformation';
import { FrequencyType } from '../enums/frequency-type.enum';

export interface RecurrencyKey {
  id?: string;
}

export interface Recurrency extends RecurrencyKey {
  frequency: FrequencyType;
  base_date: Date;
  active: boolean;
  paid: boolean;
  amount: number;
  reference: string;
  type: TransactionType;
  observation: string;
  wallet_id: string;
}
