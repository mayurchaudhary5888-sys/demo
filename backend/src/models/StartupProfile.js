import mongoose from "mongoose";

const startupProfileSchema = new mongoose.Schema({}, { strict: false, timestamps: true, collection: "startups" });

export const StartupProfile = mongoose.models.StartupProfile || mongoose.model("StartupProfile", startupProfileSchema);
