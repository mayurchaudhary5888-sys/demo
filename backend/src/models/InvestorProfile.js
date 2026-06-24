import mongoose from "mongoose";

const investorProfileSchema = new mongoose.Schema({}, { strict: false, timestamps: true, collection: "investors" });

export const InvestorProfile = mongoose.models.InvestorProfile || mongoose.model("InvestorProfile", investorProfileSchema);
