const Order = require('../models/order.model');

class orderRepo {
    //1-find all ==> for admin 
    static async findAllOrder({ page = 1, limit = 10, sortBy = "createdAt", sortedOrder = "desc", filter = {} } = {}) {
        try {

            if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1 || limit > 100) {
                throw new Error('Invalid filter parameters');
            }

            if (!['asc', 'desc'].includes(sortedOrder.toLowerCase())) {
                throw new Error("Invalid sortedOrder value. Use 'asc' or 'desc'.");
            }

            const skip = (page - 1) * limit;

            const orders = await Order.find(filter)
                .sort({ [sortBy]: sortedOrder === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limit);

            const totalorders = await Order.countDocuments(filter)

            return {
                orders,
                currentPage: page,
                totalPages: Math.ceil(totalorders / limit),
                totalorders
            };
        } catch (error) {
            throw new Error('Error acessing orders')
        }

    }

    //2-find orders by customer id
    static async findOrderByCustomerId(customerId) {
        try {
            const orders = await Order.find({ customerId });
            return orders
        } catch (error) {
            throw new Error('Error finding order, Please try again later. ');
        }
    }

    //3-Create new Order 
    static async createOrder(orderData) {
        try {
            const order = new Order(orderData);
            return await order.save();
        } catch (error) {
            throw new Error(`Error placing order. Please try again later ${error.message}`)
        }
    }

    
    //4-update payment method
    // static async updatepayment(_id, updateData) {
    //     try {
    //         const updateOrder = await Order.findByIdAndUpdate(
    //             _id,
    //             { $set: { "paymentDetails.paymentStatus": updateData } }, 
    //             { new: true }
    //         );
    //         if (!updateOrder) {
    //             throw new Error("Order not found");
    //         }
    //         return updateOrder
    //     } catch (error) {
    //         throw new Error("order not found")
    //     }
    // }


    //5-get order by sellerId ==> for seller
    static async findOrderBySellerId(sellerId) {
        try {
            const orders = await Order.find({ 'items.sellerId': sellerId });
            return orders
        } catch (error) {
            throw new Error('Error finding orders by sellerId');
        }
    }

    //6-update item statues
    static async updateItemStatus(orderId, productId, newStatus) {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error('Order not Found');
            }
            const item = order.items.find(i => i.productId === productId);
            if (!item) {
                throw new Error('Item not found')
            }
            item.itemStatus = newStatus;
            await order.save();
            return order;
            
        } catch (error) {
            throw new Error(`Error updating item status: ${error.message}`);
        }
    }

    //7-getorderbyid
    static async getOrderById(orderId){
        try {
            const order = Order.findById(orderId);
            return order;
        } catch (error) {
            throw new Error(`Error finding order ${error.message}`)
        }
    }

    //8-change order statues
    static async changeOrderStatues(orderId){
        try {
            const order=await Order.findById(orderId);
            //check items
            let allAproved = true;
                order.items.forEach(item => {
                    if (item.itemStatus == "pending") {
                        allAproved = false;
                    }
                });
                if(allAproved){
                order.Orderstatus="shipped";
                await order.save();
                }
            
        } catch (error) {
            throw new Error(`Failed to change order staues ${error.message}`)
        }
    }

}

module.exports = orderRepo;
