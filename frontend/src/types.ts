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
  timeline: {
    status: ApplicationStatus;
    timestamp: string;
    remarks?: string;
  }[];
}

export interface Connection {
  id: string;
  fromId: string;
  fromName: string;
  fromLogo?: string;
  fromSector?: string;
  fromStage?: string;
  toId: string;
  toName: string;
  status: "pending" | "accepted" | "Initiated" | "Approved";
  timestamp: string;
  startupId?: string;
  incubatorName?: string;
  message?: string;
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
