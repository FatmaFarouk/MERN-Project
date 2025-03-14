const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const InventorySchema = new Schema({
  branchLocation:{type: String, required: true },
  //branchId:{type :Types.ObjectId,required:true},
  products: [
    {
      productId: {type: String, ref: "Product", required: true },
      stock: { type: Number, default: 0, min: 0 }, 
    }
  ],
  staff: {
    cashier: { type: Types.ObjectId, ref: "staff" }, 
    clerk: { type: Types.ObjectId, ref: "staff" } 
  },
}, { timestamps: true }); 

const Inventory = mongoose.model("Inventory", InventorySchema);
module.exports = Inventory;
