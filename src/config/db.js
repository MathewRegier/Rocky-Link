import mongoose from 'mongoose';

const connectLeadsDB = async () => {
    try {
        const leadsConnection = await mongoose.createConnection(process.env.MONGODB_URI_LEADS, {});
        console.log(`Leads MongoDB Connected: ${leadsConnection.client.s.options.dbName}`);
        return leadsConnection;
    } catch (error) {
        console.error(`Error connecting to Leads MongoDB: ${error}`);
        return undefined;
    }
};

const connectLoyaltyDB = async () => {
    try {
        const loyaltyConnection = await mongoose.createConnection(process.env.MONGODB_URI_LOYALTY, {});
        console.log(`Loyalty MongoDB Connected: ${loyaltyConnection.client.s.options.dbName}`);
        return loyaltyConnection;
    } catch (error) {
        console.error(`Error connecting to Loyalty MongoDB: ${error}`);
        return undefined;
    }
};

const loyaltySchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    points: Number,
    totalPointsGained: Number,
    phone: { type: String, unique: true },
    email: String
});

const LoyaltyUser = mongoose.model('LoyaltyUser', loyaltySchema);

export { connectLeadsDB, connectLoyaltyDB, LoyaltyUser };
