import { z } from "zod";

const cleanString = z.string().trim();
const optionalString = cleanString.max(5000).optional();
const stringList = z.array(cleanString.max(300)).max(50).optional();
const booleanValue = z.boolean().optional();

const dateString = cleanString.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format.").optional();
const applicationStatuses = [
  "Submitted",
  "Under Review",
  "Document Requested",
  "Shortlisted",
  "Approved",
  "Rejected",
];

export const validateBody = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return next({
      statusCode: 422,
      message: "Validation failed.",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  req.body = parsed.data;
  return next();
};

export const programSchema = z.object({
  id: cleanString.max(120).optional(),
  name: cleanString.min(2).max(160),
  shortDescription: optionalString,
  longDescription: optionalString,
  description: optionalString,
  benefits: stringList,
  eligibility: stringList,
  requiredDocuments: stringList,
  documentsRequired: stringList,
  processSteps: stringList,
  isOpen: booleanValue,
  isActive: booleanValue,
  startDate: dateString,
  endDate: dateString,
  iconName: cleanString.max(80).optional(),
  disclaimer: optionalString,
});

export const startupProfileSchema = z.object({
  id: cleanString.max(120).optional(),
  name: optionalString,
  founderName: optionalString,
  startupName: optionalString,
  legalName: optionalString,
  logoUrl: optionalString,
  logoPreview: optionalString,
  logoName: optionalString,
  hasCompanyLogo: booleanValue,
  stage: optionalString,
  fundingType: optionalString,
  fundingStatus: optionalString,
  description: optionalString,
  startupBrief: optionalString,
  email: cleanString.email().max(160).optional(),
  mobile: cleanString.regex(/^\d{10}$/, "Mobile number must be 10 digits.").optional(),
  state: optionalString,
  city: optionalString,
  website: optionalString,
  appLink: optionalString,
  sector: optionalString,
  industry: optionalString,
  startupType: optionalString,
  nature: optionalString,
  services: stringList,
  supportRequired: stringList,
  interestedPrograms: stringList,
  interests: stringList,
  selectedProgram: optionalString,
  isDpiitRecognized: booleanValue,
  dpiitNumber: optionalString,
  isMsmeRegistered: booleanValue,
  msmeNumber: optionalString,
  udhyogAadhaar: optionalString,
  cin: optionalString,
  registrationNumber: optionalString,
  registrationDate: dateString,
  registeredAt: z.number().optional(),
  agreeTerms: booleanValue,
});

export const applicationSchema = z.object({
  id: cleanString.max(120).optional(),
  programId: cleanString.min(1).max(120),
  programName: cleanString.min(1).max(180),
  startupId: cleanString.max(120).optional(),
  startupName: cleanString.min(1).max(180),
  selectedProgram: optionalString,
  submittedByEmail: cleanString.email().max(160).optional(),
  submittedByName: optionalString,
  problemStatement: optionalString,
  solutionDescription: optionalString,
  currentStage: optionalString,
  teamSize: z.coerce.number().int().min(1).max(10000).optional(),
  fundingStatus: optionalString,
  pitchDeckName: optionalString,
  additionalDocumentsName: optionalString,
  incubator1: optionalString,
  incubator2: optionalString,
  incubator3: optionalString,
  incubatorPreferences: z.array(z.any()).optional(),
}).passthrough();


export const applicationStatusSchema = z.object({
  status: z.enum(applicationStatuses),
  remarks: optionalString,
});

export const contactQuerySchema = z.object({
  id: cleanString.max(120).optional(),
  name: cleanString.min(2).max(120),
  email: cleanString.email().max(160),
  phone: cleanString.max(30).optional(),
  subject: cleanString.min(2).max(180).optional(),
  entityType: cleanString.max(120).optional(),
  entityName: cleanString.max(180).optional(),
  state: cleanString.max(120).optional(),
  city: cleanString.max(120).optional(),
  queryType: cleanString.max(180).optional(),
  message: cleanString.min(5).max(5000),
});

export const queryReplySchema = z.object({
  reply: cleanString.min(2).max(5000),
});



export const userStatusSchema = z.object({
  isActive: z.boolean(),
});

export const investorProfileSchema = z.object({
  name: cleanString.min(2).max(120),
  designation: cleanString.min(2).max(120),
  email: cleanString.email().max(160),
  phone: cleanString.min(10).max(30),
  firmName: cleanString.min(2).max(180),
  website: optionalString,
  linkedin: cleanString.min(5).max(300),
  investorType: cleanString.min(2).max(120),
  investmentStages: z.array(cleanString).optional(),
  sectors: z.array(cleanString).optional(),
  ticketSize: cleanString.min(2).max(120),
  investmentThesis: cleanString.min(5).max(5000),
  portfolioCompanies: optionalString,
});
