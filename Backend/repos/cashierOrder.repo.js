const Order=require('../models/CashierOrder.model');
const staff=require('../models/staff')
const inventory=require('../models/Inventory.model')
const Cart=require('../models/cart.model')

class CashierOrderRebo{
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

//2-find order by cashier id 
 static async findOrderByCashierId(CashierId) {
    try {
        const orders = await Order.find({ CashierId });
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

//4-cashier detail
static async cashierdetail(CashierId) {
    try {
        const cashier = await staff.findById(CashierId)
        return cashier
    } catch (error) {
        throw new Error (`Error finding cashier ${error.message}`)
    }
}

//5-get product in inventory
static async inventory(inventoryId)
{
    try {
        return await inventory.findById(inventoryId)
    } catch (error) {
        throw new Error (`Error reashing inventory ${error.message}`)
    }
}

//6-Create new cart
static async createCart(cartData) {
    try {
        const cart = new Cart(cartData);
        return await cart.save();
    } catch (error) {
        throw new Error('Error creating cart. Please try again later.');
    }
}
}

module.exports = CashierOrderRebo;
