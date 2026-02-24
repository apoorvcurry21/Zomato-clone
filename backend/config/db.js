import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('SERVER WARNING: Database connection failed. Please check your MongoDB URI and IP whitelisting.');
    // process.exit(1);
  }
};

export default connectDB;
