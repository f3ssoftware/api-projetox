import { Schema } from 'dynamoose';
import { InstallmentSchema } from './installment.schema';

export const TransactionSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  amount: {
    type: Number,
  },
  due_date: {
    type: Date,
    default: new Date(),
    index: {
      name: 'due-date-index',
    },
    rangeKey: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  paid: {
    type: Boolean,
    default: false,
  },
  observation: {
    type: String,
    required: false,
  },
  installments: {
    type: Array,
    schema: [InstallmentSchema],
    required: false,
  },
  reference: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  parent_transaction_id: {
    type: String,
  },
  wallet_id: {
    type: String,
    index: {
      name: 'wallet-id-index',
    },
  },
});
