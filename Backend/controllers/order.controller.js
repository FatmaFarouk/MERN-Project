const OrderService = require('../services/order.service');

class orderController {
    //1-create order
    static async createOrder(req, res) {
        try {
            const { customerId, PhoneNumber, paymentMethod, shippingAddress ,CreditCardNumber,ExpiryMonth,ExpiryYear,CVVCode} = req.body;

            //Validate body
            if (!customerId || !PhoneNumber || !paymentMethod || !shippingAddress || !CreditCardNumber|| !ExpiryMonth  || !ExpiryYear || !CVVCode) {
                console.log(customerId, PhoneNumber, paymentMethod, shippingAddress ,CreditCardNumber,ExpiryMonth,ExpiryYear,CVVCode)
                return res.status(400).json({ message: `Missing required fieldsssss`})
            };

            //call service
            const order = await OrderService.createOrder(customerId, PhoneNumber, paymentMethod, shippingAddress,CreditCardNumber,ExpiryMonth,ExpiryYear,CVVCode);

            return res.status(201).json(order);
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }

    }
 
    //2-get all order by filter
    static async getAllOrders(req,res){
        try{
            const{page,limit,sortBy,sortedOrder,...filters}=req.query;

            const orders=await OrderService.findAllorder({
                page,
                limit,
                sortBy,
                sortedOrder,
                filter:filters,
            });

            return res.status(200).json(orders);
        }catch(error){
            return res.status(500).json({ message: error.message });
        }
    }

    //3-get all orders customerId
    static async getOrdersByCustomerId(req,res){
        try{
            const{customerId}=req.params;
            const orders = await OrderService.getOrdersByCustomerId(customerId);

            if(!orders.length){
                return res.status(404).json({message:"No orders found"});
            }

            return res.status(200).json(orders);
        }catch(error){
            return res.status(500).json({ message: error.message });
        }
    }

    //4-get all orders by sellerId
    static async getOrdersBySellerId(req,res){
        try{
            const{sellerId}=req.params;
            const orders=await OrderService.getOrdersbySellerId(sellerId);

            if(!orders.length){
                return res.status(404).json({message:"No orders found"});
            }
            return res.status(200).json(orders);
        }catch(error){
            return res.status(500).json({ message: error.message });
        }
    }

    //5-update payment status
    static async updatePaymentStatus(req,res){
        try{
            const{orderId,newStatus}=req.body;
            const order = await OrderService.updatePaymentStatus(orderId,newStatus);

            return res.status(201).json(order);
        }catch(error){
            return res.status(500).json({ message: error.message });
        }
    }

    //6-update item statues
    static async updateItemStatus(req,res){
        try {
            const{orderId,productId,newStatus}=req.body;
            const order=await OrderService.updateItem(orderId,productId,newStatus);
            return res.status(201).json(order);
        } catch (error) {
            return res.status(500).json({message : error.message});
        }
    }

    static async getAllordersGeneral(req,res){
        try{
            const orders= await OrderService.findAllorder();
            res.status(200).json(orders);
        }catch(error){
            res.status(500).json({message:error.message})
        }
    }

    static async getOrderById(req,res){
        try{
            const id=req.body.id;
            const order=await OrderService.getOrderById(id);
            res.status(200).json(order);
            
        }catch(error){
            res.status(500).json({error:error.message})

        }
    }

    static async getOrdersByBranchId(req, res, next) {
        try {
            const { branchId } = req.params;
    
            // Fetch orders where at least one item belongs to the specified branchId
            const orders = await Order.find({
                items: { $elemMatch: { sellerId: branchId } }
            })
            .populate('items.product') // Populate product details
            .sort({ createdAt: -1 }); // Sort by creation date (newest first)
    
            res.status(200).json({
                status: 'success',
                data: orders,
            });
        } catch (err) {
            next(err);
        }
    };

        static async uuupdateItemStatus  (req, res, next) {
        try {
            const { orderId, itemId, status } = req.body;
    
            // Find the order
            const order = await Order.findById(orderId);
    
            if (!order) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Order not found',
                });
            }
    
            // Find the specific item in the order
            const item = order.items.id(itemId);
            if (!item) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Item not found in the order',
                });
            }
    
            // Update the item's status
            item.itemStatus = status;
    
            // Save the updated order
            await order.save();
    
            res.status(200).json({
                status: 'success',
                message: 'Item status updated successfully',
            });
        } catch (err) {
            next(err);
        }
    };

}




module.exports = orderController;