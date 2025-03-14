const AnalysisService = require("../services/analysis.service");

class analysisController{


    static async analysis(req,res) {
        
        try{
            const ordersanalysis=await AnalysisService.getallordersinmonths();
            const UseraAnalysis=await AnalysisService.UseraAnalysis();
            const ordersallmonths=ordersanalysis[0];
            const numberoforders = ordersanalysis[1];
            const AllAnalysis={
                "ordersanalysis":ordersanalysis,  
                "UseraAnalysis":UseraAnalysis
            }
            res.status(200).json(AllAnalysis);

        }catch(error){
            res.status(500).json({message:error.message})
        
        }

    }

    static async Allanalysis(req,res) {
        
        try{
            const ordersanalysis=await AnalysisService.allAnalysisorders();
            const UseraAnalysis=await AnalysisService.UseraAnalysis();
            const ordersallmonths=ordersanalysis[0];
            const numberoforders = ordersanalysis[1];
            const AllAnalysis={
                "ordersanalysis":ordersanalysis,  
                "UseraAnalysis":UseraAnalysis
            }
            res.status(200).json(AllAnalysis);

        }catch(error){
            res.status(500).json({message:error.message})
        
        }

    }

    static async BranchAnalysis(req,res){

        try{
            const {BranchId}=req.params;
            const BranchAnalysis=await AnalysisService.getBarnchAnalysis(BranchId);
            const AllAnalysis={
                "ordersanalysis":BranchAnalysis
            }
            res.status(200).json(AllAnalysis)
        }catch(error){
            res.status(500).json({message : error.message})
        }
       
    }

    

    static async ProductAnalysis(req,res){
        try{
            const {productId}=req.params;
            const StockAnalysis= await AnalysisService.getProductAnalysis(productId);
            const RevenueAnalysis= await AnalysisService.RevenueProducAnalysis(productId);
            const ProductAnalysis={
                "StockAnalysis":StockAnalysis,
                "RevenueAnalysis":RevenueAnalysis
            }

            res.status(200).json(ProductAnalysis);
        }catch(error){
            res.status(500).json({message:error.message})
        }
    }

    
    




}

module.exports=analysisController;




