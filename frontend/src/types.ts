/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ApplicationStatus {
  SUBMITTED = "Submitted",
  UNDER_REVIEW = "Under Review",
  DOCUMENT_REQUESTED = "Document Requested",
  SHORTLISTED = "Shortlisted",
  APPROVED = "Approved",
  REJECTED = "Rejected"
}

export enum StartupStage {
  IDEATION = "Ideation",
  VALIDATION = "Validation",
  EARLY_TRACTION = "Early Traction",
  SCALING = "Scaling"
}

export enum FundingType {
  BOOTSTRAPPED = "Bootstrapped",
  FUNDED = "Funded"
}

export enum UserRole {
  GUEST = "Guest",
  FOUNDER = "Founder",
  ADMIN = "Admin"
}

export interface StartupProfile {
  id: string;
  name: string;
  logoUrl?: string;
  logoPreview?: string;
  logoName?: string;
  founderName?: string;
  startupName?: string;
  legalName?: string;
  startupBrief?: string;
  fundingStatus?: string;
  industry?: string;
  nature?: string;
  services?: string[];
  interests?: string[];
  selectedProgram?: string;
  cin?: string;
  udhyogAadhaar?: string;
  hasCompanyLogo?: boolean;
  registrationNumber?: string;
  registeredAt?: number;
  agreeTerms?: boolean;
  stage: StartupStage;
  fundingType: FundingType;
  description: string;
  email: string;
  mobile: string;
  state: string;
  city: string;
  website?: string;
  appLink?: string;
  sector: string;
  startupType: string;
  isDpiitRecognized: boolean;
  dpiitNumber?: string;
  isMsmeRegistered: boolean;
  msmeNumber?: string;
  interestedPrograms: string[];
  supportRequired: string[];
  isApproved: boolean; // Approved by admin to appear in public network
  registrationDate: string;
}

export interface InvestorProfile {
  id: string;
  name: string;
  organization: string;
  investmentFocus: string[];
  website?: string;
  linkedInUrl?: string;
  type: "Partner Investor" | "Angel Investor" | "VC Partner" | "Funding Partner";
}

export interface Program {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  eligibility: string[];
  requiredDocuments: string[];
  processSteps: string[];
  isOpen: boolean;
  startDate: string;
  endDate: string;
  iconName: string;
  disclaimer?: string;
  isActive?: boolean;
  description?: string;
}

export interface Application {
  id: string;
  programId: string;
  programName: string;
  startupId: string;
  startupName: string;
  submittedDate: string;
  lastUpdated: string;
  status: ApplicationStatus;
  problemStatement: string;
  solutionDescription: string;
  currentStage: string;
  teamSize: number;
  fundingStatus: string;
  pitchDeckName: string;
  additionalDocumentsName?: string;
  adminRemarks?: string;
  rejectedAt?: string;
  selectedProgram?: string;
  submittedByEmail?: string;
  submittedByName?: string;
  updatedAt?: string;
  createdAt?: string;
  timeline: {
    status: ApplicationStatus;
    timestamp: string;
    remarks?: string;
  }[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: "admin" | "founder";
  startupId?: string | null;
  dept?: string;
  isOnboarded?: boolean;
  isEmailVerified?: boolean;
  isActive?: boolean;
  selectedProgram?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  isRead: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: "Policy" | "Scheme" | "Event" | "Notification";
  publishDate: string;
  isPublished: boolean;
}

export interface ContactQuery {
  id: string;
  entityType: string;
  entityName: string;
  contactName: string;
  email: string;
  state: string;
  city: string;
  queryType: string;
  message: string;
  submittedDate: string;
  isResolved: boolean;
  adminReply?: string;
}
