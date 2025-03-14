const orderRepo = require('../repos/cashierOrder.repo');
const CartRepo = require('../repos/cart.repo');
const Product = require('../models/product.model');
const CartService = require('./cart.service')
const { Error } = require('mongoose');
const Inventory =require('../models/Inventory.model')
const staff=require('../models/staff');

//1-place order in branch
class CashierorderService{
    //1-create order
static async createOrder(CashierId ,paymentMethod,CreditCardNumber,ExpiryMonth,ExpiryYear,CVVCode) {
    try {
        const cart = await CartRepo.findCartByCustomerId(CashierId);
        const cashier= await staff.findById(CashierId)
        if (!cashier) {
            throw new Error("this cashier not found in staff.");
        }
        const branchId=cashier.branchId;
        const inventory = await Inventory.findById(branchId);
        if (!inventory) {
            throw new Error("Inventory not found for this branch.");
        }
        //1-check again if every product is still avaliable
        const unavailableItems = [];
        for (const item of cart.items) {
            const product =inventory.products.find(p => String(p.productId) === String(item.productId));;

            if (!product || product.stock < item.quantity) {
                item.isAvailable = false;
                unavailableItems.push(item);
            } else {
                item.isAvailable = true;
            }
        }

        // 1.2 Check if there are any unavailable items
        if (unavailableItems.length > 0) {
            throw new Error('Some products are not available, sorry, order cannot be placed');
        }

        //3-create the order
        let order = await orderRepo.createOrder({
            CashierId,
            items: cart.items,
            paymentDetails: { totalAmount: cart.totalAmount, paymentMethod,CreditCardNumber,ExpiryMonth,ExpiryYear,CVVCode },
        })

        //4-update in order stock
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            product.stockQuantity -= item.quantity;
            await product.save();
        }

        //5-update in branch
        for(const item of order.items)
        {
            const product =inventory.products.find(p => String(p.productId) === String(item.productId));

            if(product){
                if(product.stock >= item.quantity)
                {
                    product.stock -= item.quantity;
                }else{
                    throw new Error(`Not enough stock for product ${item.productId}`);
                }
            }else{
                throw new Error(`Product ${item.productId} not found in inventory`);
            }
        }
        await inventory.save();

        //5-clear cart
        await CartService.clearCart(CashierId);

        //6-return the order
        return order;
    } catch (error) {
        throw new Error(`Failed to place order:${error.message}`)
    }
}
//2-get order by caher id 
static async getOrdersByCashierId(CashierId) {
    try {
        return orderRepo.findOrderByCashierId(CashierId);
    } catch (error) {
        throw new Error(`Failed to fetch Cashier orders: ${error.message}`);
    }
}
//3-find all branchs order
static async findAllorder(options) {
    try {
        return await orderRepo.findAllOrder(options);
    } catch (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`)
    }

}
//4-cashier name by id
static async findCashier(Casherid){
    try {
        const cashier =await orderRepo.cashierdetail(Casherid);
        return cashier
    } catch (error) {
        throw new Error(`Failed to fetch the cashier ${error.message}`)
    }
}

//5-products in inventory
static async findInventory(branchId)
{
    try {
        const inventory=await orderRepo.inventory(branchId);
        return inventory
    } catch (error) {
        throw new Error(`Failed to fetch the inentory ${error.message}`)
    }
}
//6-add to cart
static async addToCart(CashierId, productId, quantity) {
    try {
        // 1. Check if product exists in inventory
        const cashier=await staff.findById(CashierId);
        const product=await Product.findById(productId);
        if(!cashier)
        {
            throw new Error(`Cashier does not exist`)
        }
        const inventoryId= cashier.branchId
        const inventory = await Inventory.findById(inventoryId);
        if (!inventory) {
            throw new Error(" Inventory not found for this branch.");
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
            cart = await CartRepo.findCartByCustomerId(CashierId);
            if (cart === null) {
                cart = await CartRepo.createCart({
                    customerId:CashierId,
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
        const updatedCart = await CartRepo.updateCart(
            CashierId, {
            items: cart.items,
            totalAmount: cart.totalAmount,
        });

        return updatedCart;
    } catch (error) {
        throw new Error('Error adding item to cart' + error.message);
    }
}
//grt cart
static async getCart(CashierId) {
    try {
        //get cart
        let cart = await CartRepo.findCartByCustomerId(CashierId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        //get branchid
        const cashier=await staff.findById(CashierId);
        const branchId=cashier.branchId;
        if(!cashier)
        {
            throw new Error('Cashier not found');
        }

        //check if every product is still avaliable
        const inventory = await Inventory.findById(branchId);
        if (!inventory) {
            throw new Error("Inventory not found for this branch.");
        }
        for (const item of cart.items) {
            const productInInventory  =inventory.products.find(p => String(p.productId) === String(item.productId));

            if (!productInInventory || productInInventory.stock < item.quantity) {
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
        await CartRepo.updateCart(CashierId, {
            items: cart.items,
            totalAmount: cart.totalAmount,
        });

        return cart;

    } catch (error) {
        throw new Error(`Error retrieving cart. Please try again later ${error}`);
    }
}

}

module.exports=CashierorderService