import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGO_DB_URL;
export const client = new MongoClient(uri);

export const connectToMongo = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return "successful";
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err; // Rethrow the error to handle it in the caller function
  }
};


export async function closeMongoConnection() {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    throw err; // Rethrow the error to handle it in the caller function
  }
}
