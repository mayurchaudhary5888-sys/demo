import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({}, { strict: false, timestamps: true, collection: "connections" });

export const Connection = mongoose.models.Connection || mongoose.model("Connection", connectionSchema);
