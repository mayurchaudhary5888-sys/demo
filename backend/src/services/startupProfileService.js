import { StartupProfile } from "../models/StartupProfile.js";

const cleanString = (value, fallback = "") => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
};

const cleanList = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanString(String(item)))
    .filter(Boolean);
};

const resolveRegisteredAt = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Date.parse(String(value || ""));
  return Number.isNaN(parsed) ? Date.now() : parsed;
};

export const normalizeStartupProfile = ({
  startupId,
  startupProfile,
  email,
  mobile,
  founderName,
  isApproved = false,
}) => {
  const profile = startupProfile || {};
  const registeredAt = resolveRegisteredAt(profile.registeredAt);
  const startupName =
    cleanString(profile.startupName) ||
    cleanString(profile.legalName) ||
    cleanString(founderName) ||
    "Startup";
  const legalName = cleanString(profile.legalName) || startupName;
  const services = cleanList(profile.services);
  const interests = cleanList(profile.interests);
  const cin = cleanString(profile.cin);
  const udhyogAadhaar = cleanString(profile.udhyogAadhaar);
  const selectedProgram = cleanString(profile.selectedProgram);

  return {
    id: cleanString(startupId) || cleanString(profile.id) || `startup-${registeredAt}`,
    name: startupName,
    founderName: cleanString(founderName) || startupName,
    startupName,
    legalName,
    logoUrl: cleanString(profile.logoPreview) || undefined,
    logoPreview: cleanString(profile.logoPreview) || undefined,
    logoName: cleanString(profile.logoName) || undefined,
    hasCompanyLogo: Boolean(profile.hasCompanyLogo),
    stage: cleanString(profile.stage, "Validation"),
    fundingType: cleanString(profile.fundingStatus, "Bootstrapped"),
    fundingStatus: cleanString(profile.fundingStatus, "Bootstrapped"),
    description: cleanString(profile.startupBrief, "Registered through BHASKAR Startup India."),
    startupBrief: cleanString(profile.startupBrief),
    email: cleanString(profile.email) || cleanString(email),
    mobile: cleanString(profile.mobile) || cleanString(mobile),
    state: cleanString(profile.state, "Other"),
    city: cleanString(profile.city),
    website: cleanString(profile.website) || undefined,
    appLink: cleanString(profile.appLink) || undefined,
    sector: cleanString(profile.sector, "Other"),
    industry: cleanString(profile.industry, "Other"),
    startupType: cleanString(profile.industry) || cleanString(profile.nature, "Other"),
    nature: cleanString(profile.nature),
    services,
    supportRequired: services,
    interestedPrograms: interests,
    interests,
    selectedProgram: selectedProgram || undefined,
    isDpiitRecognized: Boolean(cin),
    dpiitNumber: cin || undefined,
    isMsmeRegistered: Boolean(udhyogAadhaar),
    msmeNumber: udhyogAadhaar || undefined,
    udhyogAadhaar: udhyogAadhaar || undefined,
    cin: cin || undefined,
    registrationNumber: cleanString(startupId) || cleanString(profile.id) || undefined,
    registrationDate: new Date(registeredAt).toISOString().split("T")[0],
    registeredAt,
    agreeTerms: Boolean(profile.agreeTerms),
    isApproved,
  };
};

export const syncStartupProfileRecord = async (user) => {
  if (!user?.startupProfile) return null;

  const existingRecord = await StartupProfile.findOne({ id: user.startupId }).lean();

  const normalized = normalizeStartupProfile({
    startupId: user.startupId,
    startupProfile: user.startupProfile,
    email: user.email,
    mobile: user.mobile,
    founderName: user.name,
    isApproved: Boolean(existingRecord?.isApproved),
  });

  const record = await StartupProfile.findOneAndUpdate(
    { id: normalized.id },
    { $set: normalized },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return record.toObject();
};
