import mongoose from "mongoose";

const applicationRecordSchema = new mongoose.Schema({}, { strict: false, timestamps: true, collection: "applications" });

export const ApplicationRecord = mongoose.models.ApplicationRecord || mongoose.model("ApplicationRecord", applicationRecordSchema);
