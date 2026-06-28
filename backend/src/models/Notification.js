import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "success", "warning", "error"], default: "info" },
    timestamp: String,
    isRead: { type: Boolean, default: false },
    recipientEmail: { type: String, lowercase: true, trim: true, index: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    startupId: { type: String, index: true },
  },
  { timestamps: true, collection: "notifications" }
);

export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
