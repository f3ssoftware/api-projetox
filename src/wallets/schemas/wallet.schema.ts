import { Schema } from 'dynamoose';

export const WalletSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  currency: {
    type: String,
  },
  user_id: {
    type: String,
  },
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
