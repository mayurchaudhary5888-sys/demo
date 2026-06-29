import mongoose from "mongoose";

const foundationApplicationSchema = new mongoose.Schema(
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

    // Specific Fields
    focusArea: String,
    applicantName: String,
    designation: String,
    email: String,
    phone: String,
    organisationName: String,
    establishmentYear: String,
    innovationArea: String,
    users: [String],
    beneficiaries: [String],
    impactApproach: String,
    totalRegisteredUsers: String,
    currentPricePoint: String,
    totalPaidUsers: String,
    monthlyActiveUsers: String,
    userRetentionRate: String,
    evidenceOfImpact: String,
    pitchDeckName: String,
  },
  { timestamps: true, collection: "foundation_applications" }
);

export const FoundationApplication =
  mongoose.models.FoundationApplication ||
  mongoose.model("FoundationApplication", foundationApplicationSchema);
