import mongoose from "mongoose";

const startupProfileSchema = new mongoose.Schema(
  {
    logoName: String,
    startupName: String,
    startupBrief: String,
    hasCompanyLogo: Boolean,
    fundingStatus: String,
    stage: String,
    mobile: String,
    state: String,
    city: String,
    website: String,
    appLink: String,
    industry: String,
    sector: String,
    services: [String],
    udhyogAadhaar: String,
    cin: String,
    nature: String,
    legalName: String,
    interests: [String],
    agreeTerms: Boolean,
    logoPreview: String,
    registeredAt: Number,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "founder"],
      default: "founder",
    },
    dept: String,
    startupId: {
      type: String,
      default: null,
    },
    startupProfile: startupProfileSchema,
    isOnboarded: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
