import { Schema } from 'dynamoose';

export const TransactionSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  amount: {
    type: Number,
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
    required: false,
  },
  reference: {
    type: String,
    required: false,
  },
  wallet_id: {
    type: String,
  },
});
