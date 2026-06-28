import mongoose from "mongoose";

const contactQuerySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: String,
    contactName: String,
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: String,
    subject: String,
    entityType: String,
    entityName: String,
    state: String,
    city: String,
    queryType: String,
    message: { type: String, required: true },
    submittedDate: String,
    isResolved: { type: Boolean, default: false },
    adminReply: String,
  },
  { timestamps: true, collection: "queries" }
);

export const ContactQuery = mongoose.models.ContactQuery || mongoose.model("ContactQuery", contactQuerySchema);
