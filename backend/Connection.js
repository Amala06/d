const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);

const connectDB = async () => {
  try {
    await mongoose.connect(
`mongodb+srv://shubham:shubham@cluster0.idhijls.mongodb.net/`
    );
    console.log("Connected to MongoDB Atlas");
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
