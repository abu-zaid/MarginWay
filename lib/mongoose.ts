import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGO_DB_URI) return console.log("MongoDB URI is required!");

  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
        isConnected = true;
        console.log("Connected to MongoDB!");
        return isConnected;
  } catch (error: any) {
    console.log(error.message);
  }
  return isConnected;
};
