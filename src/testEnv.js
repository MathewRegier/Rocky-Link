// In a separate test file or function
import { MongoClient } from 'mongodb';

async function testMongoConnection() {
    const uri = "mongodb+srv://mathewregiermail:IFXuAn6e7kdwJumi@cluster0.mbrnmus.mongodb.net/";
    console.log("Testing URI:", uri);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        // Perform additional operations if needed
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    } finally {
        await client.close();
    }
}

testMongoConnection();
