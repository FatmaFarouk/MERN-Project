const express=require('express');
const analysisController = require('../controllers/analysis.controller');

const router=express.Router();

//get all analysis
router.get("/OnlineAnalysis",analysisController.analysis);

//get all analysis
router.get("/AllAnalysis",analysisController.Allanalysis);

//get all BranchAnalysis
router.get("/BranchAnalysis/:BranchId",analysisController.BranchAnalysis)

//get product Analysis
router.get("/ProductAnalysis/:productId",analysisController.ProductAnalysis)
//
//router.get("/ProductAnalysiss/:productId",analysisController.ProductAnal)

module.exports=router;