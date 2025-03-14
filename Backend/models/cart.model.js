const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const CartSchema = new Schema({
  customerId: { type: String, ref: 'User', required: true },
  items: [
    {
      productId: { type: String, ref: 'Product', required: true },
      sellerId: { type: String, ref: 'User', required: true }, 
      quantity: { type: Number, required: true, min: 1 },
      price:{ type: Number, required: true, min: 0 },
      isAvailable: { type: Boolean, default: true },
    }
  ],
  totalAmount: { type: Number, required: true },
}, { timestamps: true }); 

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
