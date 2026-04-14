import { MongoClient, ServerApiVersion } from "mongodb";

let client;
let db;

export async function connectDB() {
    if (db) return db; 

    const uri = process.env.MONGO_URI;

    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    await client.connect();

    db = client.db("hospital");

    return db;
}

export function getDB() {
    if (!db) {
        throw new Error("❌ DB not connected. Call connectDB() first.");
    }
    return db;
}