const Cart = require('../models/cart.model');


class CartRepo {
    //1-Find Cart by customer id
    static async findCartByCustomerId(customerId) {
        try {
            const cart = await Cart.findOne({ customerId });
            return cart
        } catch (error) {
            throw new Error('Error finding cart. Please try again later.');
        }
    }

    //2-Create new cart
    static async createCart(cartData) {
        try {
            const cart = new Cart(cartData);
            return await cart.save();
        } catch (error) {
            throw new Error('Error creating cart. Please try again later.');
        }
    }

    //3-Update cart
    static async updateCart(customerId, updateData) {
        try {
            const updatedCart = await Cart.findOneAndUpdate(
                { customerId },
                { $set: updateData },//update the specified fields
                { new: true }//return the updated cart
            )
            if (!updatedCart) {
                throw new Error("cart not found")
            }
            return updatedCart
        } catch (error) {
            throw new Error('Error updating cart. Please try again later.');
        }
    }

}


module.exports=CartRepo;