import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({}, { strict: false, timestamps: true, collection: "faqs" });

export const Faq = mongoose.models.Faq || mongoose.model("Faq", faqSchema);
