const Inventory = require ('../models/Inventory.model')
const RestockOrder=require('../models/restokeOrder')
const mongoose = require("mongoose");
const { inventory } = require('../repos/cashierOrder.repo');


class branchesService{


    static async getAllBranches(){
        try{
            const branches=await Inventory.find({});
            return branches;
        }catch(error){
            throw new Error(error.message);
        }
    }

    static async AddorderToBranch(order){
        try{
            
            const neworder = {
                branchId: new mongoose.Types.ObjectId(order.To),
                requestedBy: new mongoose.Types.ObjectId(order.from),
                products: [
                  {
                    productId: order.productId,
                    quantity: order.quantity,
                  }
                ]
              };
            const createdOrder = await RestockOrder.create(neworder);
            
            const { productId, quantity, from: branchId } = order;

            
            const result = await Inventory.findOneAndUpdate(
              { _id: branchId }, 
              {
                $inc: { "products.$[product].stock": -quantity }
              },
              {
                arrayFilters: [{ "product.productId": productId }], 
                new: true 
              }
            );
        
            if (!result) {
              throw new Error(`Branch or product not found for branch ID: ${branchId} and product ID: ${productId}`);
            }
        
            
        
            return createdOrder;

        }catch(error){
            throw new Error(error.message)
        }
    }

    static async getAllorders(userId) {
        try {
          const branch = await Inventory.findOne({ "staff.clerk": userId });
          console.log('Branch object:', JSON.stringify(branch, null, 2)); // Log the entire branch object
      
          if (branch) {
            console.log('Branch ID:', branch._id); // Log the branchId directly
            const orders = await RestockOrder.find({ branchId: branch._id ,status:"Pending"});
            console.log('Orders:', orders);
            return orders;
          }
          return [];
        } catch (error) {
          throw new Error(error.message + " from serv catch");
        }
      }
      static async getorder(Id){
        try{
          const order=await RestockOrder.findOne({_id:Id})
          console.log(Id)

          console.log(order)
          return order;
        }catch(erro){
          throw new Error("couldnt connect to db")
        }
      }

        static async getProdInBranche(BranchId){
          try{
            const branch=await Inventory.find({_id:BranchId},{products:1,_id:0});
            console.log(branch);
            console.log(branch[0].products)
            const product=branch[0].products;
            return product;
          }catch(error){
            throw new Error(`${error.message}`)
          }

        }
}

module.exports=branchesService;