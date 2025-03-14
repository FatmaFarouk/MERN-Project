const {deleteProduct,CreateProduct,GetUproducts,updateProduct,GetProductById,GetProductsBySeller, getFilteredProductsServices,getAllProductUnactive,SoftDeleteProduct,DeleteAllproductsSeller, getOnlineProductsService} = require('../services/products.sevice');
const Inventory=require('../models/Inventory.model');
const ProductRepo=require('../repos/products.repos');
const Product = require('../models/product.model');
const mongoose = require("mongoose");

class SellerProductsController{
    ///fatma
    static async getOnlineProducts(req, res) {
        try {
            const products = await getOnlineProductsService();
            return res.status(200).json(products);
          } catch (error) {
            console.error("error fetching online products:", error);
            return res.status(500).json("internal server error");
          }
    }

    static async getAllProducts(req,res,next){
        console.log("Before calling products.service getprods");
        try {
            const products= await GetUproducts();
            res.status(200).json(products);
        } catch (execption) {
            console.error("Error in /products route:", exception); 
            res.status(500).json({ message: "Internal server error" });   
        }
    }

    static async updateAProduct(req,res){
        try{
            const updatedproduct=await updateProduct(req.params.id,req.body);
            return res.status(200).json({message: `product updated successfully`});
        }catch(error){
            if(error.message=='product not found')
                return res.status(404).json({ message: error.message });
            console.error("Error in /products route:", error.message);
            return res.status(500).json({message:'updateProducts service error', error: error.message });
        }
    }

    static async AddProduct(req,res){
        try{
            console.log(req.body);
            console.log('Received Data:', req.body); 

            if (req.files) {
              console.log('Received Files:', req.files);
            }
            
            const addedProduct=await CreateProduct(req);
            
            console.log('controller layer '+addedProduct);
            res.status(200).json({message:'product added successfully'});
        }catch(error){
            console.log(error);
            res.status(500).json({message:error.message});
        }
    };

    static async DeleteProduct(req,res){
        try{
            console.log(req.params.id);
            const deletedProduct=await deleteProduct(String(req.params.id));
            res.status(200).json({message:`product ${deletedProduct} deleted successfully`});
        }catch(error){
            if(error.message=='Product not found')
                res.status(404).json({ message: error.message });
            else
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

     static async GetProductByID(req,res){
        try{
            const {id}=req.params;
            const product=await GetProductById(id);
            res.status(200).json(product);
        }catch(error){
            console.log(error.message);
            if(error.message=='Product is not defined'||error.message=='Product not found')
                res.status(404).json({ message: error.message });
            else
                res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

    static async getFilteredProducts(req, res) {
       
        try {
            const { search, category, minPrice, maxPrice } = req.query;
            // console.log("received filters:", req.query); 
        
            let filter = {}; 
            
            if (search) {
                filter.name = { $regex: search, $options: "i" }; 
            }
            if (category) {
                filter.category = category;
            }
            if (minPrice || maxPrice) {
                filter.price = {};
                if (minPrice) filter.price.$gte = Number(minPrice);
                if (maxPrice) filter.price.$lte = Number(maxPrice);
            }
        
            let products = await Product.find(filter); 
        
            // console.log("filtered products:", products); 
            res.status(200).json(products); 
        } 
        catch (error) {
            console.error("error fetching filtered products:", error);
            res.status(500).json({ message: "Server error" });
        }
        
        
    }

    static async ProductsUnActive(req,res){
        try{
             const Products =getAllProductUnactive();
             res.status(200).json(Products)
        }catch(error){
            res.status(500).json({message:error.message})
        }

    }
    static async SoftDeleteProduct(req,res){
        try{

            const id=req.params.id;
            if(SoftDeleteProduct(id)){
                res.status(200).json({message:`Product with id :${id} deleted successfully`})
            }
        }catch(error){
            res.status(500).json({message:error.message});
        }

    }
    static async DeleteAllProductsSeller(req,res){
        try{
        const seller_id=req.params.seller_id;
        if(DeleteAllproductsSeller(seller_id)){
            res.status(200).Json({message:`All products for this Seller Deleted Successfully`})
        }
    }catch(error){
        res.status(500).json({message:error.message});
    }

    }
    static async getBranchProduct(req,res){
        try{
            const {BranchId}=req.params;
            const Products=await ProductRepo.getBranchProducts(BranchId);

            return res.status(200).json(Products);
        }catch(error){
            res.status(500).json({message:error.message})
        }
    }



    //Esraa
    static async getAllProducts(req,res,next){
        console.log("Before calling products.service getprods");
        try {
            const products= await GetUproducts();
            res.status(200).json(products);
        } catch (execption) {
            console.error("Error in /products route:", exception); 
            res.status(500).json({ message: "Internal server error" });   
        }
    }

    static async updateAProduct(req,res){
        try{
            const updatedproduct=await updateProduct(req.params.id,req.body);
            return res.status(200).json({message: `product updated successfully`});
        }catch(error){
            if(error.message=='product not found')
                return res.status(404).json({ message: error.message });
            console.error("Error in /products route:", error.message);
            return res.status(500).json({message:'updateProducts service error', error: error.message });
        }
    }

    static async AddProduct(req,res){
        try{
            console.log(req.body);
            console.log('Received Data:', req.body); 

            if (req.files) {
              console.log('Received Files:', req.files);
            }
            
            const addedProduct=await CreateProduct(req);
            
            console.log('controller layer '+addedProduct);
            res.status(200).json({message:'product added successfully'});
        }catch(error){
            console.log(error);
            res.status(500).json({message:error.message});
        }
    };

    static async DeleteProduct(req,res){
        try{
            console.log(req.params.id);
            const deletedProduct=await deleteProduct(String(req.params.id));
            res.status(200).json({message:`product ${deletedProduct} deleted successfully`});
        }catch(error){
            if(error.message=='Product not found')
                res.status(404).json({ message: error.message });
            else
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

    static async GetProductByID(req,res){
        try{
            const {id}=req.params;
            const product=await GetProductById(id);
            res.status(200).json(product);
        }catch(error){
            console.log(error.message);
            if(error.message=='Product is not defined'||error.message=='Product not found')
                res.status(404).json({ message: error.message });
            else
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

    //get prod by sel id 
    static async GetProductsBySellercontroller(req, res, next) {
        const sellerId = req.params.sellerId;
        console.log("Fetching products for sellerId:", sellerId);
        
        if (!sellerId) {
            return res.status(400).json({ message: "Seller ID is required." });
        }
    
        try {
            const products = await GetProductsBySeller(sellerId);
            res.status(200).json(products);
        } catch (exception) {
            console.error("Error in /products/seller/:sellerId route:", exception);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // product update stock
    static async updateStock  (req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
        
            // Validate input
            if (!quantity || quantity < 1) {
              return res.status(400).json({ message: "Invalid quantity" });
            }
        
           
        
            // Update main product stock
            const product = await Product.findByIdAndUpdate(
              id,
              { $inc: { stockQuantity: quantity } },
              { new: true, runValidators: true }
            );
        
            if (!product) {
              return res.status(404).json({ message: "Product not found" });
            }
        
            const productIdString = product._id.toString();
        
            // Update online branch inventory
            const inventoryUpdate = await Inventory.findOneAndUpdate(
              {
                branchLocation: 'online',
                'products.productId': productIdString
              },
              {
                $inc: { 'products.$.stock': quantity }
              },
              { new: true }
            );
        
            if (!inventoryUpdate) {
              return res.status(404).json({
                message: "Product updated, but not found in online branch inventory"
              });
            }
        
            res.json({
              product,
              inventory: inventoryUpdate
            });
        
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
          }
    }
}

module.exports=SellerProductsController;

