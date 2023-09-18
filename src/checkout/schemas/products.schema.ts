import { Schema } from 'dynamoose';

export const ProductSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
});
