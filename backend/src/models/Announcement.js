import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({}, { strict: false, timestamps: true, collection: "announcements" });

export const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
