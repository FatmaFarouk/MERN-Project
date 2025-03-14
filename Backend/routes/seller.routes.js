const express=require('express');
const authConrroller = require('../controllers/authController');
const SellerProductsController=require ('../controllers/products.controller');

const router=express.Router();

//esraa
router.get('/products',SellerProductsController.getAllProducts); //seller id 
router.put('/products/:id',SellerProductsController.updateAProduct);
router.post('/products',SellerProductsController.AddProduct);
router.delete('/products/:id',SellerProductsController.DeleteProduct);
router.get('/products/:id',SellerProductsController.GetProductByID); //check seller id 
router.get('/products/seller/:sellerId', SellerProductsController.GetProductsBySellercontroller);
router.patch('/products/:id/stock', SellerProductsController.updateStock);


//fatma
router.get('/filteredProducts', SellerProductsController.getFilteredProducts);
router.get("/onlineProducts", SellerProductsController.getOnlineProducts);


module.exports=router;