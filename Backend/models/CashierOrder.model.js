const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const CashierOrderSchema = new Schema({
  CashierId: { type: String, ref: 'staff', required: true },
  items: [
    {
      productId: { type: String, ref: 'Product', required: true },
      sellerId: { type: String, ref: 'User', required: true }, ////////// Ref to Seller (تعديل هنا)
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, 
      isAvailable: { type: Boolean, default: true },
    }
  ],
  paymentDetails: {
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
      required: true
    },
    CreditCardNumber:{ type: Number, required: true },
    ExpiryMonth:{type: Number, required: true},
    ExpiryYear:{type: Number, required: true},
    CVVCode:{type: Number, required: true},
  },
}, { timestamps: true }); 
const CashierOrder = mongoose.model("CashierOrder", CashierOrderSchema);
module.exports = CashierOrder;
