import mongoose from "mongoose";

const programSchema = new mongoose.Schema({}, { strict: false, timestamps: true, collection: "programs" });

export const Program = mongoose.models.Program || mongoose.model("Program", programSchema);
