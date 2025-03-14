const {getProducts, AddProduct, DeleteProduct, UpdateProduct, getById,getProductsBySeller_, getFilteredProducts,getUnActiveProducts, getOnlineProducts}= require ('../repos/products.repos');
const ProductRepo = require('../repos/products.repos');
const {upload} =require ('./media.service');
const mongoose=require ('mongoose');
const Product = require('../models/product.model');
const Stock = require('../models/stock.model');

const getOnlineProductsService = async () => {
    const products = await getOnlineProducts();
    if (products.error) {
      throw new Error(products.error);  
    }
    return products;
  };

//fetch filtered products
const getFilteredProductsServices = async (filter) => {
    try {
        const products = await Product.find(filter);
        return products;
    }
    catch(error) {
        console.log('error in get filtered products: ', error);
    }
}

const getAllProductUnactive=async ()=>{
    try{
        const AllProducts= getUnActiveProducts();
        return AllProducts;
    }catch(error){
            throw new Error(error);
    }
   
}

const SoftDeleteProduct=async (id)=>{
    try{
      const productTodelete= await  Product.findByIdAndUpdate(
            id,
            { isActive: false }, 
            { new: true }  
        )
        if(!productTodelete){
            throw new Error(`couldnt find product with id :${id}`)
        }
        return true;
    }catch(error){
        throw new Error("Fialed To Update Product ")
    }
}
const DeleteAllproductsSeller=async (seller_id)=>{
    try{
        const DeletedProducts=await Product.updateMany({"sellerinfo.id":seller_id}, {$set: { isActive: false }});
        if(DeletedProducts.modifiedCount==0){
            throw new Error("no  any Products deleted for this Seller")
        }
        return {success:true ,message :"Products Deleted Successfuly"};
    }catch(error){
        throw new Error("couldnt connect to DB Server ");
    }
}


///////////////Esraa

const GetUproducts=async ()=>{
    console.log("Inside getproducts service");
    return getProducts();
};

const GetProductById = async (id) => {
    const product = await getById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
};

//get prod by sel id 
const GetProductsBySeller = async (sellerId) => {
    console.log("Inside GetProductsBySeller service for sellerId:", sellerId);
    return getProductsBySeller_(sellerId);
};


const CreateProduct = async (req) => {
    console.log(`Inside createproduct service`);
    console.log(req.body._id);
    console.log(req.files?.images);
    if (!req.files?.images) {
        console.log('error');
        throw new Error("Please upload at least one image");
    }
    else
        console.log('uploaded');

    const imagesArray = Array.isArray(req.files.images) 
    ? req.files.images 
    : [req.files.images];

    const imageUrls = await upload(imagesArray);


    console.log("Parsed Seller Info:", req.body.sellerInfo);
console.log("Final Seller Info:", JSON.parse(req.body.sellerInfo));

    //const productId = new mongoose.Types.ObjectId();

    const productData = {
        _id: req.body._id,
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        category: req.body.category,
        images: imageUrls,
        stockQuantity: Number(req.body.stockQuantity),
        sellerinfo:JSON.parse(req.body.sellerInfo),
        // sellerinfo: {
        //     id: req.body.sellerinfoid, 
        //     name: req.body.sellerinfoname
        // }
    };

    console.log(productData);

    console.log('from service :'+productData);

    return AddProduct(productData);
};

const deleteProduct = async (id) => {
    console.log("Inside delete product service");
    const deletedproduct= DeleteProduct(id);
    if(!deletedproduct){
        throw new Error('Product not found');
    }
    return deletedproduct;
};

const updateProduct=async(id, data)=>{
    console.log("Inside delete product service");
    const updatedproduct= UpdateProduct(id,data);
    if(!updatedproduct)
        throw new Error('product not found');
    return updatedproduct;
};





module.exports={

    //esraa
    GetUproducts,
    CreateProduct,
    deleteProduct,
    updateProduct,
    GetProductById,
    GetProductsBySeller,

    //fatma
    getFilteredProductsServices,
    getAllProductUnactive,
    SoftDeleteProduct,
    DeleteAllproductsSeller,
    getOnlineProductsService
};

