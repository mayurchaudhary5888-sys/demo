import mongoose from "mongoose";

const financialStatementSchema = new mongoose.Schema({
  yearEnding: String,
  currency: String,
  totalRevenue: String,
  operatingRevenue: String,
  netProfit: String,
});

const globalImpactApplicationSchema = new mongoose.Schema(
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
    registeredBusinessName: String,
    localBusinessName: String,
    incorporationDate: String,
    legalEntity: String,
    placeOfOperations: String,
    industry: String,
    website: String,
    email: String,
    awardsRecognition: String,
    businessPitch: String,
    businessStage: String,
    financialOne: financialStatementSchema,
    financialTwo: financialStatementSchema,
    receivedFinancialSupport: String,
    financialSupportDetails: String,
    coreTeam: String,
    theoryOfChange: String,
    impactAreas: [String],
    impactSegments: [String],
    individualsImpacted: String,
    businessPlans: String,
    grantUsage: String,
    estimatedReach: String,
    pitchDeckName: String,
  },
  { timestamps: true, collection: "global_impact_applications" }
);

export const GlobalImpactApplication =
  mongoose.models.GlobalImpactApplication ||
  mongoose.model("GlobalImpactApplication", globalImpactApplicationSchema);
