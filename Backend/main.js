require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import CORS
const { connectToDataBase } = require("./database/mongo/index");
const { APP_CONFIG } = require("./config/app.config");
const cartRoutes = require("./routes/cart.routes");
const { authenticateToken } = require('./middlewares/authontication.middleware');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const slellerRoutes=require ('./routes/seller.routes');
const orderRoutes=require('./routes/order.routes');
const CashierOrderRouted=require('./routes/CashierOrder.routes')
const fileUpload = require("express-fileupload");
const analysisRoutes=require("./routes/analysis.route")
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const mongoSanatize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const { cashierdetail } = require("./repos/cashierOrder.repo");
const inventoryProductRoute = require('./routes/Invertory.Product.Router');
const branchRoutes=require("./routes/branch.route");


//
const mongoose = require("mongoose");
const Inventory=require("./models/Inventory.model");


const app = express();
const PORT = APP_CONFIG.PORT || 3000;
//http headers security
app.use(helmet());  
//protect against nosql inject
app.use(mongoSanatize());
// protect against html
app.use(xss());

app.use(cors()); // Enable CORS

////////////////////         NEVER EVER MOVE THIS MIDDLEWARE FROM IT IS PLACE/////////////
/// PLEASE LEAVE IT AT FIRST TO BE THE FIRST HANDLER  ///////////
app.use(
  fileUpload({
    useTempFiles: false,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Should come after fileUpload


// decrease number of trial
// const limiter = rateLimit({
//   max: 5,
//   windowMs: 60*60*1000,
//   message: "to many requests, please try again after one hour"
// });
// app.use('/auth', limiter);

//add your rout here......................
app.use("/cart", cartRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/seller',slellerRoutes);
app.use('/order',orderRoutes);
app.use("/analysis",analysisRoutes);
app.use("/cashier",CashierOrderRouted)
app.use("/branch",branchRoutes);
// app.use("/inbranch", inventoryProductRoute );





// Connect to Database and Start Server
(async function () {
  try {
    console.log(`Connecting to database at ${APP_CONFIG.MONGO_DB_URI}...`);

    await connectToDataBase({
      url: APP_CONFIG.MONGO_DB_URI,
      databaseName: APP_CONFIG.DATABASE_NAME,
      callback: () => console.log("✅ Connected to database"),
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    process.exit(1);

  }
})();

// Handle graceful shutdown
process.on("SIGINT", async () => {
    console.log("🛑 Shutting down...");
    await connectToDataBase.close(); // Close DB connection if applicable
    process.exit(0);
});

