const mongoose = require('mongoose');

const connectToDB = async ({ url, databaseName, callback }) => {
  try {
    await mongoose.connect(url, {
      dbName: databaseName,
    });
    process.nextTick(() => {
      callback();
    });
  } catch (error) {
    console.error('Error connecting to DB:', error.message);
    throw new Error("Error connecting to DB");
  }
};

// Export the function directly
module.exports = { connectToDataBase: connectToDB };
