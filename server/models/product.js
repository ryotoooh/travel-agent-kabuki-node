import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ProductSchema = new Schema({
  region: {
    type: String
  },
  city: {
    type: String
  },
  description: {
    type: String
  },
  cite: {
    type: String
  },
  price: {
    type: Number
  },
  image: {
    type: String
  },
  caption: {
    type: String
  }
});

ProductSchema.index({ description: 'text', city: 'text', region: 'text' });