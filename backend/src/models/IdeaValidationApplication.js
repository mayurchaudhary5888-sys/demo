import mongoose from "mongoose";

const ideaValidationApplicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    programId: String,
    programName: String,
    startupId: String,
    startupName: String,
    selectedProgram: String,
    submittedByEmail: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    submittedByName: String,
    submittedDate: String,
    lastUpdated: String,
    status: String,
    adminRemarks: String,
    timeline: [
      {
        status: String,
        timestamp: String,
        remarks: String,
      },
    ],

    // Specific Form Fields
    applicantName: String,
    email: String,
    mobile: String,
    residenceCity: String,
    residenceState: String,
    ideaName: String,
    problemStatement: String,
    startupDescription: String,
    sector: String,
    sectorOther: String,
    entityType: String,
    startupStage: String,
    revenue: String,
    priorIncubatorSupport: String,
    pitchDeckName: String,
  },
  { timestamps: true, collection: "idea_validation_applications" }
);

export const IdeaValidationApplication =
  mongoose.models.IdeaValidationApplication ||
  mongoose.model("IdeaValidationApplication", ideaValidationApplicationSchema);
