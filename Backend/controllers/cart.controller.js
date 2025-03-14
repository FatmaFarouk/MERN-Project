const CartService = require('../services/cart.service');

class CartController {
    //1-add to cart
    static async addToCart(req, res) {
        try {
            const { customerId, productId, quantity } = req.body;

            //Validate body
            if (!customerId || !productId || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' })
            };

            const cart = await CartService.addToCart(customerId, productId, quantity);
            res.status(201).json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //2-get cart detail by customerid
    static async getCart(req, res) {
        try {
            const { customerId } = req.params;
            //validate input
            if (!customerId) {
                return res.status(400).json({message:'customer Id is req'})
            }

            const cart=await CartService.getCart(customerId);
            res.status(200).json(cart)
        }catch(error) {
            res.status(500).json({message:error.message})
         }

    }

    //3-Remove item from cart
    static async removeFromCart(req,res){
        try {
            const{customerId,productId}=req.body;

            
            //validate input
            if(!customerId || !productId){
                return res.status(400).json({message:"Missig required fields"})
            }

            const cart =await CartService.removeFromCart(customerId,productId);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({message:error.message})
            
        }
    }

    //4-decrese item from cart
    static async decfromToCart(req, res) {
        try {
            const { customerId, productId, quantity } = req.body;

            //Validate body
            if (!customerId || !productId || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' })
            };

            const cart = await CartService.decItemFromCart(customerId, productId, quantity);
            res.status(201).json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //5-clear cart
    static async clearCart(req, res) {
        try {
            const { customerId } = req.body;

            if (!customerId) {
                return res.status(400).json({message:'customer Id is req'})
            }

            const cart=await CartService.clearCart(customerId);
            res.status(200).json(cart)
        }catch(error) {
            res.status(500).json({message:error.message})
         }

    }


};

module.exports=CartController;