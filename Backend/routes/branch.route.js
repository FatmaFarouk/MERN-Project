const express=require('express');
const branchesController = require('../controllers/branch.controller');
const Productcontroller =require('../controllers/products.controller')


const router=express.Router();


//getAllBranches
router.get('/getAllbranches',branchesController.getAllBranches)

//Addintervalorder
router.post('/addIntervalorder',branchesController.addIntervalorder)

//getallorders
router.get('/getallclerkorders/:userId',branchesController.getAllorders);

//get order by id
router.get('/getorder/:orderId',branchesController.getorderById);

//get all PRduct Branch
router.get('/getBranchProduct/:BranchId',Productcontroller.getBranchProduct);


//product in branch
router.get('/getProdInBranch/:BranchId',branchesController.getProdInBranch);


module.exports=router;