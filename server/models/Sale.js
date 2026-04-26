import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderTransaction"
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
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