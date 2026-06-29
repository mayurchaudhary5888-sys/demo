import mongoose from "mongoose";

const msmeApplicationSchema = new mongoose.Schema(
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

    // Specific Step 1 (Personal Info)
    name: String,
    email: String,
    mobile: String,
    permanentAddress: String,
    country: String,
    state: String,
    city: String,
    pinCode: String,
    gender: String,
    dateOfBirth: String,
    employmentStatus: String,
    currentCompany: String,
    highestEducation: String,
    heardFrom: String,
    familyIncome: String,
    linkedInUrl: String,

    // Specific Step 2 (Company Details)
    registeredCompany: String,
    companyName: String,
    incorporationDate: String,
    companyState: String,
    companyCity: String,
    dpiitAvailable: String,
    website: String,

    // Specific Step 3 (Project / Product Details)
    projectName: String,
    applicationVertical: String,
    technologyUsed: String,
    productLevel: String,
    painPoint: String,
    productDescription: String,
    innovationDetails: String,
    ipFiled: String,
    videoLink: String,
    supportRequired: String,
    programsApplied: [String],
    requestedFunding: String,

    // Documents
    pitchDeckName: String,
    prototypePhotosName: String,
    blockDiagramName: String,
  },
  { timestamps: true, collection: "msme_applications" }
);

export const MsmeApplication =
  mongoose.models.MsmeApplication ||
  mongoose.model("MsmeApplication", msmeApplicationSchema);
