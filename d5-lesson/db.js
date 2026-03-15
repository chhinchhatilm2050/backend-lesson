import dns from 'dns';
import { MongoClient, ServerApiVersion } from 'mongodb';
dns.setServers(['8.8.8.8', '8.8.4.4']);
const uri = process.env.MONGO_ATLAS;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 5000,
});
export async function connectDB() {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("✅ Successfully connected to MongoDB!");
}
export { client }; 