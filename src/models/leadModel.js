import mongoose from 'mongoose';
import { connectLeadsDB } from '../config/db.js';

const leadSchema = new mongoose.Schema({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    campaign: { type: String, required: false },
    portal: { type: String, required: false },
    notes: { type: String, required: false }
}, {
    timestamps: true,
    collection: 'leads'
});

const getLead = async () => {
    const leadsConnection = await connectLeadsDB();
    if (!leadsConnection) {
        throw new Error('Failed to connect and initialize the Leads model.');
    }
    return leadsConnection.model('Lead', leadSchema);  // Ensure we are returning a constructor
};

export { getLead };
