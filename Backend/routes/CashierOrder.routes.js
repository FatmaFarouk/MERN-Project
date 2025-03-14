const express=require('express');
const orderController=require('../controllers/CashierOrder.Controller');
const AuthController=require('../controllers/authController')
const router=express.Router();

//1-create order
router.post("/add",AuthController.sprotect,AuthController.srestrictTo('cashier'),orderController.createOrder);
//2-find all order =>super Admin
router.get("/getAllOrders",orderController.getAllOrders)
//3-get order by casherid
router.get("/getOrders/:CashierId",orderController.getOrdersByCashierId);
//4-cashier name by id
router.get("/getCashier/:CashierId",orderController.getCashier);
//5-product in inventory
router.get("/getInventory/:branchId",AuthController.sprotect,AuthController.srestrictTo('cashier'),orderController.getInventory);
//6-cart depend on general inventory 
router.post("/addtocart",AuthController.sprotect,AuthController.srestrictTo('cashier'),orderController.addToCart);
//7-get cart
router.get("/:CasherId",AuthController.sprotect,AuthController.srestrictTo('cashier'),orderController.getcart)

module.exports=router; 