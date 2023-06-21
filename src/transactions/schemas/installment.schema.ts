import { Schema } from 'dynamoose';

export const InstallmentSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  paid: {
    type: Boolean,
    required: true,
  },
});
