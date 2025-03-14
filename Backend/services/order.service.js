const orderRepo = require('../repos/order.repo');
const CartRepo = require('../repos/cart.repo');
const Product = require('../models/product.model');
const CartService = require('./cart.service');
const { Error } = require('mongoose');
const Order = require('../models/order.model');
const Inventory =require('../models/Inventory.model')

class OrderService {
    //1-create order
    static async createOrder(customerId, PhoneNumber, paymentMethod, shippingAddress,CreditCardNumber,ExpiryMonth,ExpiryYear,CVVCode) {
        try {
            const cart = await CartRepo.findCartByCustomerId(customerId);
            const inventory=await Inventory.findOne({branchLocation:"online"}); 
            if(!inventory)
            {
                throw new Error("Inventory not found for this branch.");
            }
            //1-check again if every nproduct is still avaliable
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
                customerId,
                PhoneNumber,
                items: cart.items,
                paymentDetails: { totalAmount: cart.totalAmount, paymentMethod, shippingAddress,CreditCardNumber,ExpiryMonth,ExpiryYear,CVVCode },
            })

            //4-update in order stock
            for (const item of order.items) {
                const product = await Product.findById(item.productId);
                product.stockQuantity -= item.quantity;
                await product.save();
            }

            //5-update in online branch
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
            await CartService.clearCart(customerId);

            //6-return the order
            return order;
        } catch (error) {
            throw new Error(`Failed to place order:${error.message}`)
        }
    }

    //2-Get all order (admin)
    static async findAllorder(options) {
        try {
            return await orderRepo.findAllOrder(options);
        } catch (error) {
            throw new Error(`Failed to fetch orders: ${error.message}`)
        }

    }

    //3-get all customer order =>(customer order history)
    static async getOrdersByCustomerId(customerId) {
        try {
            return orderRepo.findOrderByCustomerId(customerId);
        } catch (error) {
            throw new Error(`Failed to fetch customer orders: ${error.message}`);
        }
    }

    //4-get orders by sellerid ==> for seller
    static async getOrdersbySellerId(sellerId) {
        try {
            const orders = await orderRepo.findOrderBySellerId(sellerId);

            //return only item that belong to that seller
            const filtereOrders = orders.map(order => {
                const sellerItems = order.items.filter(item => item.sellerId === sellerId);
                return { ...order.toObject(), items: sellerItems };
            })
            return filtereOrders;
        }
        catch (error) {
            throw new Error(`Failed to fetch customer orders: ${error.message}`)
        }
    }
    //4-update order payment
    // static async updatePaymentStatus(orderId, status) {
    //     try {
    //         const order = await orderRepo.updatepayment(orderId, status);
    //         await orderRepo.changeOrderStatues(orderId);
    //         return order;
    //     } catch (error) {
    //         throw new Error(`Faild to updated payment status ${error.message}`);
    //     }
    // }
    //5-change order item status
    static async updateItem(orderId, productId, statues) {
        try {
            const order = await orderRepo.getOrderById(orderId);
           

            if (statues === "rejected") {
                //find item in order 
                const item = order.items.find(item => item.productId === productId);
                if (item) {
                    //handel mouney
                    if (item.itemStatus !== "rejected") {
                        order.paymentDetails.totalAmount -= item.price * item.quantity;
                        order.paymentDetails.theRest += item.price * item.quantity;
                        //add back stockquantity

                    }
                }
                //update product stock
                if (item.itemStatus !== "rejected"){
                const product = await Product.findById(productId);
                if(!product){
                    throw new Error("Product not found")
                }else{
                    product.stockQuantity +=item.quantity;
                    await product.save();
                }

                //update inventory stock
                const inventory = await Inventory.findOne({ branchLocation: "online" });
                if (!inventory) {
                    throw new Error("Inventory not found for this branch.");
                }
                const inventoryItem = inventory.products.find(p => String(p.productId) === String(productId));
                if(inventoryItem){
                    inventoryItem.stock += item.quantity;
                    await inventory.save();
                }else{
                    throw new Error(`Product ${productId} not found in inventory`);
                }

            }


                //handel order 
                if (order.paymentDetails.totalAmount === 0) {
                    order.Orderstatus = "canceled";
                    // if (order.paymentDetails.paymentStatus === "pending") { order.paymentDetails.paymentStatus = "failed" }
                }

                //handel payment statued
                // if (order.paymentDetails.paymentStatus === "paid") {
                //     order.paymentDetails.paymentStatus = "restoration";
                // }

                //save
                await order.save();

            }
            await orderRepo.changeOrderStatues(orderId);
            return await orderRepo.updateItemStatus(orderId, productId, statues);;
        } catch (error) {
            throw new Error(`Faild to update item statues ${error.message}`);
        }
    }


}

module.exports = OrderService;
