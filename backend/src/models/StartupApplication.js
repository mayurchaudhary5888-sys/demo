import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  mobile: String,
});

const startupApplicationSchema = new mongoose.Schema(
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
    authorFirstName: String,
    authorLastName: String,
    designation: String,
    mobile: String,
    email: String,
    dpiitNumber: String,
    entityName: String,
    natureOfEntity: String,
    incorporationDate: String,
    panNumber: String,
    state: String,
    city: String,
    address: String,
    technologyStartup: String,
    problemStatement: String,
    valueProposition: String,
    uniqueSellingPoint: String,
    targetCustomer: String,
    marketSize: String,
    scalePlan: String,
    revenueModel: String,
    competitors: String,
    websiteUrl: String,
    linkedInUrl: String,
    teamMembers: [teamMemberSchema],
    fullTimeEmployees: Number,
    raisedFunding: String,
    fundingAmount: String,
    fundingInstrument: String,
    incubator1: String,
    incubator2: String,
    incubator3: String,
    videoUrl: String,

    // Documents
    pitchDeckName: String,
    otherDocumentName: String,

    // Incubator Preferences
    incubatorPreferences: [
      {
        incubatorName: String,
        preferenceOrder: Number,
        status: String,
        submittedDate: String,
        completenessStatus: String,
        comments: String,
        commentsDate: String,
      },
    ],
  },
  { timestamps: true, collection: "startup_applications" }
);

export const StartupApplication =
  mongoose.models.StartupApplication ||
  mongoose.model("StartupApplication", startupApplicationSchema);
