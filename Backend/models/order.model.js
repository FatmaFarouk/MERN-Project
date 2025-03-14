const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const OrderSchema = new Schema({
  customerId: { type: String, ref: 'User', required: true },
  PhoneNumber:{type:Number,require:true},
  items: [
    {
      productId: { type: String, ref: 'Product', required: true },
      sellerId: { type: String, ref: 'User', required: true }, ////////// Ref to Seller (تعديل هنا)
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, 
      isAvailable: { type: Boolean, default: true },
      itemStatus: {  //inn
        type: String,
        enum: ['rejected','pending', 'approved'],
        default: 'pending',
        required: true
      }
    }
  ],
  paymentDetails: {
    totalAmount: { type: Number, required: true },
    theRest:{type: Number,default:0},
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
      required: true
    },
    CreditCardNumber:{ type: Number, required: true },
    ExpiryMonth:{type: Number, required: true},
    ExpiryYear:{type: Number, required: true},
    CVVCode:{type: Number, required: true},
    shippingAddress: { type: String, required: true },
  },
  Orderstatus: {
    type: String,
    enum: ['pending','shipped', 'canceled'],
    default: 'pending',
    required: true
  },

}, { timestamps: true }); 
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;