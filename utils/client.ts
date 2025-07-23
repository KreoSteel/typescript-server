import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const URL = process.env.MONGODB_CONNECTION_STRING;
const cl = new MongoClient(URL!);

const dbName = "home_lib";

const client = cl.db(dbName);

export default client;