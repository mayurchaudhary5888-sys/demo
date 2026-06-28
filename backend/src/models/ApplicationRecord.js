import mongoose from "mongoose";

const applicationRecordSchema = new mongoose.Schema(
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
    problemStatement: String,
    solutionDescription: String,
    currentStage: String,
    teamSize: Number,
    fundingStatus: String,
    pitchDeckName: String,
    additionalDocumentsName: String,
    adminRemarks: String,
    rejectedAt: String,
    timeline: [
      {
        status: String,
        timestamp: String,
        remarks: String,
      },
    ],
  },
  { timestamps: true, collection: "applications", strict: false }
);

export const ApplicationRecord = mongoose.models.ApplicationRecord || mongoose.model("ApplicationRecord", applicationRecordSchema);

