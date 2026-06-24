import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({}, { strict: false, timestamps: true, collection: "notifications" });

export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
