const Product = require('../models/product.model');
const Order = require('../models/order.model');
const User =require('../models/user.model');
const CashierOrder=require('../models/CashierOrder.model');
const  Branches =require('../models/Inventory.model')
const { analysis } = require('../controllers/analysis.controller');


class AnalysisService {

    static async  getallordersinmonths(params) {
        //try get number of oredrs and create array contain number of orders in every month  
        try{
            const orders=await Order.find({},{"paymentDetails.totalAmount":1 ,Orderstatus:1, updatedAt:1});
            
            const ordersnumber=orders.length;
           
            let ordersallmonths = new Array(12).fill(0); 
            let salesallmonths = new Array(12).fill(0); 
            
            let ordersStatus = new Array(3).fill(0)


            let month;
            console.log(ordersnumber);
            orders.forEach((order)=> {
                month=order.updatedAt.getMonth()+1;
                salesallmonths[month-1]+=order.paymentDetails.totalAmount;
                ordersallmonths[month-1]++;
                console.log(order.Orderstatus);
                switch (order.Orderstatus){
                    case "pending":
                        console.log("pending")
                        ordersStatus[0]++;
                        break;
                    case "shipped":
                        ordersStatus[1]++;
                        break;
                    case "canceled":
                        ordersStatus[2]++;
                        break;
                   
                }

              });
            console.log(ordersStatus);
            const totalSales = salesallmonths.reduce((sum, value) => sum + value, 0);
             const  allAnalysis={
                "ordersallmonths":ordersallmonths,
                "ordersnumber":ordersnumber,
                "salesallmonths":salesallmonths,
                "totalSales":totalSales,
                "ordersStatus":ordersStatus,
                "pendingorders":ordersStatus[0],
                "shippedorders":ordersStatus[1],
                "canceled":ordersStatus[2]
              }
            
            return allAnalysis;
        }catch(error){
            throw new Error(error);
        }

       
    }

    static async UseraAnalysis(params){
        try{
            const Users=await User.find({role:'customer'},{createdAt:1});
            console.log(Users);
            const customerCount=Users.length;
            let customersAllMonths=new Array(12).fill(0);
            Users.forEach(customer=>{
                if(customer.createdAt.getMonth()){
                customersAllMonths[customer.createdAt.getMonth()]++;
                }

            })
            const allUsersAnalysis={
                "customersAllMonths":customersAllMonths,
                "customerCount":customerCount
            }
            return allUsersAnalysis;
        }catch{
            console.log("error from useranalysisservice");
            throw new error("couldnt connect to db")
        }
    }


    static async allAnalysisorders(){


        try{
            const orders=await Order.find({},{"paymentDetails.totalAmount":1 ,Orderstatus:1, updatedAt:1});
            
            
           
            let ordersallmonths = new Array(12).fill(0); 
            let salesallmonths = new Array(12).fill(0); 
            
            let ordersStatus = new Array(3).fill(0)


            let month;
           
            orders.forEach((order)=> {
                month=order.updatedAt.getMonth()+1;
                salesallmonths[month-1]+=order.paymentDetails.totalAmount;
                ordersallmonths[month-1]++;
                console.log(order.Orderstatus);
                switch (order.Orderstatus){
                    case "pending":
                        console.log("pending")
                        ordersStatus[0]++;
                        break;
                    case "shipped":
                        ordersStatus[1]++;
                        break;
                    case "canceled":
                        ordersStatus[2]++;
                        break;
                   
                }

              });

              const branchesorders= await CashierOrder.find({},{"paymentDetails.totalAmount":1 , updatedAt:1})

              branchesorders.forEach((order)=> {
                month=order.updatedAt.getMonth()+1;
                salesallmonths[month-1]+=order.paymentDetails.totalAmount;
                ordersallmonths[month-1]++;
            })

            console.log(ordersStatus);
            const totalSales = salesallmonths.reduce((sum, value) => sum + value, 0);
            const ordersnumber=orders.length+ branchesorders.length;
             const  allAnalysis={
                "ordersallmonths":ordersallmonths,
                "ordersnumber":ordersnumber,
                "salesallmonths":salesallmonths,
                "totalSales":totalSales,
                "ordersStatus":ordersStatus,
                "pendingorders":ordersStatus[0],
                "shippedorders":ordersStatus[1],
                "canceled":ordersStatus[2]
              }
            
            return allAnalysis;
        }catch(error){
            throw new Error(error);
        }


    }



      static async getBarnchAnalysis(BranchId){
        try{

            const branch=await Branches.findOne({_id:BranchId},{staff:1});
            
            console.log(branch);
            const CashierId=branch.staff.cashier;
            
            console.log(CashierId);

            let ordersallmonths = new Array(12).fill(0); 
            let salesallmonths = new Array(12).fill(0); 
            let month;

            const Brancheorders=await CashierOrder.find({CashierId:CashierId},{"paymentDetails.totalAmount":1 , updatedAt:1})
            Brancheorders.forEach((order)=> {
                month=order.updatedAt.getMonth()+1;
                salesallmonths[month-1]+=order.paymentDetails.totalAmount;
                ordersallmonths[month-1]++;
            })

            const totalSales = salesallmonths.reduce((sum, value) => sum + value, 0);
            const ordersnumber= Brancheorders.length;

            const  allAnalysis={
                "ordersallmonths":ordersallmonths,
                "ordersnumber":ordersnumber,
                "salesallmonths":salesallmonths,
                "totalSales":totalSales,
                
              }
            
            return allAnalysis;

        }catch(error){
            throw new Error(error)
        }
        
      }

      
      static async getProductAnalysis(productId){

        try{
            const AllBranches=await Branches.find({},{products:1 , branchLocation: 1})
            const ProductStockBranches=new Array(AllBranches.length).fill(0);
            const BranchesNames= new Array(AllBranches.length);

            
            AllBranches.forEach((branch,i)=>{
                console.log(branch);
                BranchesNames[i]=branch.branchLocation
                branch.products.forEach(product=>{
                    if(product.productId==productId){
                        ProductStockBranches[i]=product.stock;
                    }
                })
                
                
            })
            return {"ProductStockBranches":ProductStockBranches,
                     "BranchesNames":BranchesNames
            }
        }catch(error){
            throw new Error(error);
        }
      }

      static async RevenueProducAnalysis(productId) {
        try {
            
            const revenueByCashiers = await CashierOrder.aggregate([
            
                { $match: { "items.productId": productId } },
    
             
                { $unwind: "$items" },
    
               
                { $match: { "items.productId": productId } },
    
                
                {
                    $group: {
                        _id: "$CashierId", 
                        totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } } 
                    }
                },
    
               
    
                
                { $unwind: { path: "$cashierInfo", preserveNullAndEmptyArrays: true } },
    
                
                {
                    $project: {
                        cashierId: "$_id", 
                        
                        totalRevenue: 1,
                        _id: 0 
                    }
                }
            ]);

            const AllBranches=await Branches.find({},{staff:1})
            const ProductRevenueBranches=new Array(AllBranches.length).fill(0);

            revenueByCashiers.forEach(item=>{
                AllBranches.forEach((branch,i)=>{
                    if(branch.staff.cashier==item.cashierId){
                        ProductRevenueBranches[i]=item.totalRevenue;
                    }
                })
            })
            




            const result = await Order.aggregate([
                
                { $match: { "items.productId": productId } },
          
                
                { $unwind: "$items" },
          
                
                { $match: { "items.productId": productId } },
          
                
                {
                  $group: {
                    _id: null, 
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } } 
                  }
                },
          
              
                {
                  $project: {
                    _id: 0, 
                    totalRevenue: 1 
                  }
                }
              ]);
              if(result.totalRevenue){
                ProductRevenueBranches[0]=result.totalRevenue;
              }

              const Analysis={
                "ProductRevenueBranches":ProductRevenueBranches
              }
             
            return Analysis;
        } catch (error) {
            throw new Error(`Error calculating total revenue for product by all cashiers: ${error.message}`);
        }
    }

    



}

module.exports=AnalysisService;