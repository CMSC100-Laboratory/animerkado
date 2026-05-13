import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    email: { type: String, required: true},
    productId: {type: String, required: true},
    productName: {type: String, required: true},
    productImage: {type: String},
    quantity: {type: Number, required: true},
    price: { type: Number, required: true}
})

export const Cart = mongoose.model('Cart', cartSchema);