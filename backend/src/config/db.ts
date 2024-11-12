import mongoose from "mongoose";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      String(process.env.MONGO_URI || "mongodb://localhost:27017/forminit")
    );
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error:", error);
    }
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
