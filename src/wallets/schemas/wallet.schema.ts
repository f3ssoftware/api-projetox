import { Schema } from 'dynamoose';

export const WalletSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  currency: {
    type: String,
  },
  user_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
