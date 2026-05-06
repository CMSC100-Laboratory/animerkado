import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  orderId: {
    type: String,
    ref: "OrderTransaction"
  },
  productId: {
    type: String,
    ref: "Product"
  },
  productName: String,
  quantity: Number,
  price: Number,
  total: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Sale", saleSchema);