import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  transactionId:  { type: String, required: true, unique: true },
  productId:      { type: String, required: true },
  orderQuantity:  { type: Number, required: true },
  orderStatus:    { type: Number, enum: [0, 1, 2], default: 0 }, // 0 Pending, 1 Completed, 2 Canceled
  email:          { type: String, required: true },
  dateOrdered:    { type: Date, default: Date.now },
  time:           { type: String },
});

export const OrderTransaction = mongoose.model('OrderTransaction', orderSchema);