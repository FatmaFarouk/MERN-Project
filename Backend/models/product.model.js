const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
        type: String, 
        required: true, 
        enum: ['forHer', 'forHim', 'all']
    },
    images: { type: [String], required: true }, // Array of image URLs
    stock: { type: Number, required: true },
    stockId: { type: String, ref: 'Stock', required: true },
    sellerinfo: { 
        id: { type: String, ref: 'User' }, 
        name: { type: String } 
    },
    isActive:{type:Boolean,default:true},
    isBestSeller: {type: Boolean, default: false},
    salesCount: {type: Number, default: 0}
}, { timestamps: true });  // added time stamp


const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
