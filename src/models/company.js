// company.js
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pointsPerDollar: { type: Number, default: 1 },
  systems: [{ type: String, required: true }],
  levelingConfig: {
    type: {
      auto: { type: Boolean, default: true },
      initialAmount: { type: Number, default: 100 },
      manualConfig: [{ level: Number, amount: Number }]
    },
    default: { auto: true, initialAmount: 100 }
  },
  branding: {
    logoUrl: { type: String },
    primaryColor: { type: String },
    secondaryColor: { type: String }
  }
});

export default mongoose.model('Company', companySchema);
