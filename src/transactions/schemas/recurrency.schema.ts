import { Schema } from 'dynamoose';

export const RecurrencySchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  base_date: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  paid: {
    type: Boolean,
  },
  amount: {
    type: Number,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  observation: {
    type: String,
  },
  wallet_id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
// export interface Recurrency {
//   frequency: FrequencyType;
//   base_date: Date;
//   active: boolean;
//   paid: boolean;
//   amount: number;

// }
