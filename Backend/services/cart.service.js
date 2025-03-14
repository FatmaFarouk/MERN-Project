const CartRepo = require('../repos/cart.repo');
const Product = require('../models/product.model');
const { Error } = require('mongoose');
const Inventory = require('../models/Inventory.model')


class CartService {
    // Add item to cart
    static async addToCart(customerId, productId, quantity) {
        try {
            // 1. Check if product exists in inventory
            const product=await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            const inventory = await Inventory.findOne({ branchLocation: "online" });
            if (!inventory) {
                throw new Error("Inventory not found for this branch.");
            }

            const productInInventory  =inventory.products.find(p => String(p.productId) === String(productId));
            if (!productInInventory) {
                throw new Error('Product not found in inventory');
            }

            // 2. Check if requested quantity is available in stock
            if (quantity > productInInventory.stock) {
                throw new Error(`Requested quantity exceeds available stock. Available stock is: ${productInInventory.stock}`);
            }

            // 3. Retrieve the cart or create it if it doesn't exist
            let cart;
            try {
                cart = await CartRepo.findCartByCustomerId(customerId);
                if (cart === null) {
                    cart = await CartRepo.createCart({
                        customerId,
                        items: [],
                        totalAmount: 0,
                    })
                }
            } catch (error) {
                throw new Error("Failed to retrieve or create cart");
            }

            // 4. Check if the product is already in the cart
            const itemIndex = cart.items.findIndex(item => item.productId === productId);

            if (itemIndex > -1) {
                // 4.1 If quantity is increased
                if (cart.items[itemIndex].quantity + quantity > productInInventory.stock) {
                    throw new Error(`Requested quantity exceeds available stock. Available stock is: ${ productInInventory.stock}`);
                }
                cart.items[itemIndex].quantity += quantity;
            }
            else {
                // 4.3 Add new item to the cart
                cart.items.push({
                    productId,
                    sellerId: product.sellerinfo.id,
                    quantity,
                    price: product.price,
                });
            }

            // 5. Update total amount
            cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

            // 6. Save the updated cart
            const updatedCart = await CartRepo.updateCart(customerId, {
                items: cart.items,
                totalAmount: cart.totalAmount,
            });

            return updatedCart;
        } catch (error) {
            throw new Error('Error adding item to cart' + error.message);
        }
    }
    //remove item from cart
    static async removeFromCart(customerId, productId) {
        try {
            // 1. Retrieve the cart
            let cart = await CartRepo.findCartByCustomerId(customerId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            // 2. Find the product in the cart
            const itemIndex = cart.items.findIndex(item => item.productId === productId);
            if (itemIndex === -1) {
                throw new Error('Product not found in cart');
            }

            // 3. Remove the product from the cart
            cart.items.splice(itemIndex, 1);

            // 4. Recalculate the total amount
            cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

            // 5. Save the updated cart
            const updatedCart = await CartRepo.updateCart(customerId, {
                items: cart.items,
                totalAmount: cart.totalAmount,
            });

            return updatedCart;
        } catch (error) {
            throw new Error('Error removing item from cart: ' + error.message);
        }
    }
    //get cart
    static async getCart(customerId) {
        try {
            let cart = await CartRepo.findCartByCustomerId(customerId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            //check if every product is still avaliable
            const inventory = await Inventory.findOne({ branchLocation: "online" });
            if (!inventory) {
                throw new Error("Inventory not found for this branch.");
            }
            for (const item of cart.items) {
                const product = await Product.findById(item.productId);
                const productInInventory  =inventory.products.find(p => String(p.productId) === String(item.productId));

                if (!product || !product.isActive || productInInventory.stock < item.quantity) {
                    item.isAvailable = false;
                } else {
                    item.isAvailable = true;
                }
            }

            //update price
            cart.totalAmount = cart.items
                .filter(item => item.isAvailable) // Only include available items
                .reduce((total, item) => total + item.quantity * item.price, 0);

            //save
            await CartRepo.updateCart(customerId, {
                items: cart.items,
                totalAmount: cart.totalAmount,
            });

            return cart;

        } catch (error) {
            throw new Error('Error retrieving cart. Please try again later.');
        }
    }
    //decress from cart
    static async decItemFromCart(customerId, productId, quantity) {
        //1-check if product exist
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        //get cart
        let cart;
        try {
            cart = await CartRepo.findCartByCustomerId(customerId);
            if (!cart) {
                throw new Error("Cart not found");
            }
        } catch (error) {
            throw new Error("Failed to retrieve cart")
        }

        //if product is in cart
        const itemIndex = cart.items.findIndex(item => item.productId === productId);

        if (itemIndex > -1) {
            //decress
            const currentQuantity = cart.items[itemIndex].quantity;

            //ensure that quantity is not less than 0
            if (currentQuantity - quantity < 0) {
                throw new Error('requested it negative')
            }

            //updated quantity
            cart.items[itemIndex].quantity -= quantity;

            //if quantity is 0 remove it from cart
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }

            //update total amount
            cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

            //save cart
            const updatedCart = await CartRepo.updateCart(customerId, {
                items: cart.items,
                totalAmount: cart.totalAmount,
            });

            return updatedCart;
        }
    }

    //clear cart
    static async clearCart(customerId) {
        try {
            //1-get cart by id
            const cart = await CartRepo.findCartByCustomerId(customerId);
            if (!cart) {
                throw new Error('cart not found');
            }

            //clear
            cart.items = [];
            cart.totalAmount = 0;

            const updateCart = await CartRepo.updateCart(customerId,
                {
                    items: cart.items,
                    totalAmount: cart.totalAmount,
                });
            return updateCart
        } catch (error) {
            throw new Error(`Failed to clear cart: ${error.message}`);
        }
    }

}

module.exports = CartService;