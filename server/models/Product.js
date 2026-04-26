import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId:          { type: String, required: true, unique: true },
  productName:        { type: String, required: true },
  productDescription: { type: String },
  productType:        { type: Number, enum: [1, 2], required: true }, // 1 Crop, 2 Poultry
  productQuantity:    { type: Number, required: true },
  price:              { type: Number, required: true },
});

export const Product = mongoose.model('Product', productSchema);