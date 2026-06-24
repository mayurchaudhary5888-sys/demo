import mongoose from "mongoose";

const contactQuerySchema = new mongoose.Schema({}, { strict: false, timestamps: true, collection: "queries" });

export const ContactQuery = mongoose.models.ContactQuery || mongoose.model("ContactQuery", contactQuerySchema);
