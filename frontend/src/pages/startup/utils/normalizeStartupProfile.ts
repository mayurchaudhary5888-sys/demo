import { StartupProfile, StartupStage, FundingType } from "../../../types";

const cleanString = (value: any, fallback = ""): string => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
};

const cleanList = (value: any): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanString(String(item)))
    .filter(Boolean);
};

const resolveRegisteredAt = (value: any): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Date.parse(String(value || ""));
  return Number.isNaN(parsed) ? Date.now() : parsed;
};

export const normalizeStartupProfile = (input: any): StartupProfile => {
  if (!input) input = {};
  
  // Handle both: destructured wrapper and flat profile object
  const hasWrappedProfile = typeof input.startupProfile === "object" && input.startupProfile !== null;
  const profile = hasWrappedProfile ? input.startupProfile : input;

  const registeredAt = resolveRegisteredAt(profile.registeredAt || input.registeredAt);
  const startupName =
    cleanString(profile.startupName || input.startupName) ||
    cleanString(profile.legalName || input.legalName) ||
    cleanString(input.founderName || profile.founderName) ||
    "Startup";
  const legalName = cleanString(profile.legalName || input.legalName) || startupName;
  const services = cleanList(profile.services || input.services);
  const interests = cleanList(profile.interests || input.interests);
  const cin = cleanString(profile.cin || input.cin || profile.dpiitNumber || input.dpiitNumber);
  const udhyogAadhaar = cleanString(profile.udhyogAadhaar || input.udhyogAadhaar || profile.msmeNumber || input.msmeNumber);
  const selectedProgram = cleanString(profile.selectedProgram || input.selectedProgram);

  return {
    id: cleanString(input.startupId) || cleanString(input.id) || cleanString(profile.id) || `startup-${registeredAt}`,
    name: startupName,
    founderName: cleanString(input.founderName || profile.founderName) || startupName,
    startupName,
    legalName,
    logoUrl: cleanString(profile.logoPreview || input.logoPreview || profile.logoUrl || input.logoUrl) || undefined,
    logoPreview: cleanString(profile.logoPreview || input.logoPreview) || undefined,
    logoName: cleanString(profile.logoName || input.logoName) || undefined,
    hasCompanyLogo: Boolean(profile.hasCompanyLogo ?? input.hasCompanyLogo),
    stage: cleanString(profile.stage || input.stage, "Validation") as StartupStage,
    fundingType: cleanString(profile.fundingStatus || input.fundingStatus || profile.fundingType || input.fundingType, "Bootstrapped") as FundingType,
    fundingStatus: cleanString(profile.fundingStatus || input.fundingStatus || profile.fundingType || input.fundingType, "Bootstrapped"),
    description: cleanString(profile.startupBrief || input.startupBrief || profile.description || input.description, "Registered through BHASKAR Startup India."),
    startupBrief: cleanString(profile.startupBrief || input.startupBrief),
    email: cleanString(profile.email || input.email),
    mobile: cleanString(profile.mobile || input.mobile),
    state: cleanString(profile.state || input.state, "Other"),
    city: cleanString(profile.city || input.city),
    website: cleanString(profile.website || input.website) || undefined,
    appLink: cleanString(profile.appLink || input.appLink) || undefined,
    sector: cleanString(profile.sector || input.sector, "Other"),
    industry: cleanString(profile.industry || input.industry, "Other"),
    startupType: cleanString(profile.industry || input.industry || profile.nature || input.nature, "Other"),
    nature: cleanString(profile.nature || input.nature),
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
    registrationNumber: cleanString(input.startupId) || cleanString(input.id) || cleanString(profile.id) || undefined,
    registrationDate: new Date(registeredAt).toISOString().split("T")[0],
    registeredAt,
    agreeTerms: Boolean(profile.agreeTerms ?? input.agreeTerms),
    isApproved: Boolean(input.isApproved ?? profile.isApproved ?? false),
  };
};
