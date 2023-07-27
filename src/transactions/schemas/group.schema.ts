import { Schema } from 'dynamoose';

export const GroupSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  wallet_id: {
    type: String,
    required: true,
  },
});
