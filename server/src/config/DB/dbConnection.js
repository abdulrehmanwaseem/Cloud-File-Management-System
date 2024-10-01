import mongoose from "mongoose";

const connectToDatabase = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      retryWrites: true,
      bufferCommands: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log(`MongoDB connection Failed:: ${error}`);
    process.exit(1);
  }
};

export default connectToDatabase;
