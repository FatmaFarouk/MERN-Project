const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const RestockOrderSchema = new Schema({
  branchId: { type: Types.ObjectId, ref: "Branch", required: true }, 
  requestedBy: { type: Types.ObjectId, ref: "staff", required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved"],
    default: "Pending"
  }, 
  products: [
    {
      productId: { type: String, ref: "Product", required: true }, 
      quantity: { type: Number, required: true, min: 1 } 
    }
  ],
}, { timestamps: true }); 

const RestockOrder = mongoose.model("RestockOrder", RestockOrderSchema);
module.exports = RestockOrder;
