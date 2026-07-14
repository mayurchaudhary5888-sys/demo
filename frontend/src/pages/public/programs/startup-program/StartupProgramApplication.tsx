/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, ArrowRight, Circle, CircleCheckBig, FileText, X, Calendar } from "lucide-react";
import { useAppState } from "../../../../context/AppContext";
import type { Application, Program } from "../../../../types";
import { ApplicationSuccessModal } from "../../../../components/common/ApplicationSuccessModal";
import { ProfileUnderReviewModal } from "../../../../components/common/ProfileUnderReviewModal";
import incubatorPreferences from "../../../../data/incubatorPreferences.json";
import { downloadStoredFile } from "../../../../utils/documentStorage";

type StartupProgramApplicationProps = {
  program: Program;
  onCancel: () => void;
  mode?: "apply" | "view";
  application?: Application | null;
};

type TeamMember = {
  name: string;
  aadhaarNumber: string;
};

type TeamRow = {
  teamName: string;
  employeeCount: number;
};

type StartupWizardFields = {
  authorFirstName: string;
  authorLastName: string;
  designation: string;
  mobile: string;
  email: string;
  dpiitNumber: string;
  entityName: string;
  natureOfEntity: string;
  incorporationDate: string;
  panNumber: string;
  state: string;
  city: string;
  address: string;
  technologyStartup: "Yes" | "No";
  problemStatement: string;
  valueProposition: string;
  uniqueSellingPoint: string;
  targetCustomer: string;
  marketSize: string;
  scalePlan: string;
  revenueModel: string;
  competitors: string;
  websiteUrl: string;
  linkedInUrl: string;
  teamMembers: TeamMember[];
  fullTimeEmployees: number;
  teams: TeamRow[];
  raisedFunding: "Yes" | "No";
  fundingAmount: string;
  fundingInstrument: string;
  incubator1: string;
  incubator2: string;
  incubator3: string;
  pitchDeckName?: string;
  marketReportName?: string;
  videoUrl: string;
  otherDocumentName?: string;
  aoaMoaName?: string;
  declarationAccepted: boolean;
  fundsDeploymentPlan: FundsDeploymentPlan[];
};

type FundsDeploymentPlan = {
  expenseBucket: string;
  amount: string;
  startDate: string;
  endDate: string;
};

const entityOptions = ["Private Limited Company", "LLP", "Partnership", "Section 8 / Non-profit"];
const fundingInstrumentOptions = ["Grant", "Equity", "Debt", "Convertible", "Bootstrapped", "Other"];
const incubatorOptions = incubatorPreferences as string[];
type StartupApplicationRecord = Application & Partial<StartupWizardFields> & Record<string, any>;

const splitName = (name = "") => {
  const [firstName = "", ...rest] = name.trim().split(/\s+/).filter(Boolean);
  return { firstName, lastName: rest.join(" ") };
};

const yesNoValue = (value: unknown, fallback: "Yes" | "No"): "Yes" | "No" => (value === "Yes" || value === "No" ? value : fallback);

const normalizeTeamMembers = (value: unknown): TeamMember[] => {
  if (!Array.isArray(value)) return [{ name: "", aadhaarNumber: "" }];
  const members = value
    .map((member) => ({
      name: String(member?.name || ""),
      aadhaarNumber: String(member?.aadhaarNumber || ""),
    }))
    .filter((member) => member.name || member.aadhaarNumber);
  return members.length ? members : [{ name: "", aadhaarNumber: "" }];
};

const normalizeTeams = (value: unknown): TeamRow[] => {
  if (!Array.isArray(value)) return [{ teamName: "", employeeCount: 1 }];
  const teams = value
    .map((t) => ({
      teamName: String(t?.teamName || ""),
      employeeCount: Number(t?.employeeCount || 1),
    }))
    .filter((t) => t.teamName || t.employeeCount);
  return teams.length ? teams : [{ teamName: "", employeeCount: 1 }];
};

const normalizeFundsDeploymentPlan = (value: unknown): FundsDeploymentPlan[] => {
  if (!Array.isArray(value)) return [{ expenseBucket: "", amount: "", startDate: "30/06/2026", endDate: "30/06/2026" }];
  const plans = value
    .map((p) => ({
      expenseBucket: String(p?.expenseBucket || ""),
      amount: String(p?.amount || ""),
      startDate: String(p?.startDate || "30/06/2026"),
      endDate: String(p?.endDate || "30/06/2026"),
    }))
    .filter((p) => p.expenseBucket || p.amount || p.startDate || p.endDate);
  return plans.length ? plans : [{ expenseBucket: "", amount: "", startDate: "30/06/2026", endDate: "30/06/2026" }];
};

const initialFields = (
  user?: { name?: string; email?: string; startupId?: string | null },
  startupName = "",
  application?: StartupApplicationRecord | null
): StartupWizardFields => ({
  authorFirstName: application?.authorFirstName || splitName(application?.submittedByName || user?.name).firstName,
  authorLastName: application?.authorLastName || splitName(application?.submittedByName || user?.name).lastName,
  designation: application?.designation || "",
  mobile: application?.mobile || "",
  email: application?.email || application?.submittedByEmail || user?.email || "",
  dpiitNumber: application?.dpiitNumber || user?.startupId || "",
  entityName: application?.entityName || application?.startupName || startupName,
  natureOfEntity: application?.natureOfEntity || "",
  incorporationDate: application?.incorporationDate || "",
  panNumber: application?.panNumber || "",
  state: application?.state || "",
  city: application?.city || "",
  address: application?.address || "",
  technologyStartup: yesNoValue(application?.technologyStartup, "Yes"),
  problemStatement: application?.problemStatement || "",
  valueProposition: application?.valueProposition || application?.solutionDescription || "",
  uniqueSellingPoint: application?.uniqueSellingPoint || "",
  targetCustomer: application?.targetCustomer || "",
  marketSize: application?.marketSize || "",
  scalePlan: application?.scalePlan || "",
  revenueModel: application?.revenueModel || application?.fundingStatus || "",
  competitors: application?.competitors || "",
  websiteUrl: application?.websiteUrl || "",
  linkedInUrl: application?.linkedInUrl || "",
  teamMembers: normalizeTeamMembers(application?.teamMembers),
  fullTimeEmployees: Number(application?.fullTimeEmployees || application?.teamSize || 1),
  teams: normalizeTeams(application?.teams),
  raisedFunding: yesNoValue(application?.raisedFunding, "No"),
  fundingAmount: application?.fundingAmount || "",
  fundingInstrument: application?.fundingInstrument || "",
  incubator1: application?.incubator1 || application?.incubatorPreferences?.find((pref: any) => pref.preferenceOrder === 1)?.incubatorName || "",
  incubator2: application?.incubator2 || application?.incubatorPreferences?.find((pref: any) => pref.preferenceOrder === 2)?.incubatorName || "",
  incubator3: application?.incubator3 || application?.incubatorPreferences?.find((pref: any) => pref.preferenceOrder === 3)?.incubatorName || "",
  pitchDeckName: application?.pitchDeckName || "",
  marketReportName: application?.marketReportName || "",
  videoUrl: application?.videoUrl || "",
  otherDocumentName: application?.otherDocumentName || application?.additionalDocumentsName || "",
  aoaMoaName: application?.aoaMoaName || "",
  declarationAccepted: application?.declarationAccepted ?? true,
  fundsDeploymentPlan: normalizeFundsDeploymentPlan(application?.fundsDeploymentPlan),
});

export const StartupProgramApplication: React.FC<StartupProgramApplicationProps> = ({ program, onCancel, mode = "apply", application = null }) => {
  const { user, startups, applyToProgram, showToast } = useAppState();
  const navigate = useNavigate();
  const userStartup = startups.find((startup) => startup.id === user?.startupId);
  const [step, setStep] = useState(0);
  const isViewMode = mode === "view";
  const applicationRecord = application as StartupApplicationRecord | null;
  const [fields, setFields] = useState<StartupWizardFields>(() =>
    initialFields(user || undefined, userStartup?.startupName || userStartup?.name || "", applicationRecord)
  );
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);
  const [marketReportFile, setMarketReportFile] = useState<File | null>(null);
  const [otherFile, setOtherFile] = useState<File | null>(null);
  const [aoaMoaFile, setAoaMoaFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successApplication, setSuccessApplication] = useState<{ id: string; programName: string } | null>(null);
  const [profileReviewOpen, setProfileReviewOpen] = useState(false);
  const [priorFundingNA, setPriorFundingNA] = useState(true);
  const [priorFundings, setPriorFundings] = useState([
    { date: "30/06/2026", amount: "", instrument: "", agencyName: "", agencyType: "" }
  ]);

  const addPriorFunding = () => {
    setPriorFundings([...priorFundings, { date: "30/06/2026", amount: "", instrument: "", agencyName: "", agencyType: "" }]);
  };

  const steps = useMemo(
    () => [
      "Authorized Representative",
      "Entity Details",
      "Startup Details",
      "Startup Team",
      "Funding Details",
      "Incubator Preference",
      "Upload Documents",
    ],
    []
  );

  useEffect(() => {
    setFields(initialFields(user || undefined, userStartup?.startupName || userStartup?.name || "", applicationRecord));
    setPitchDeckFile(null);
    setMarketReportFile(null);
    setOtherFile(null);
    setAoaMoaFile(null);
    setErrors({});
    setStep(0);
  }, [application?.id, mode, user?.email, user?.name, user?.startupId, userStartup?.name, userStartup?.startupName]);

  const updateField = <K extends keyof StartupWizardFields>(field: K, value: StartupWizardFields[K]) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleDownloadFile = (fieldKey: string, filename: string) => {
    if (!applicationRecord) return;
    const success = downloadStoredFile(applicationRecord.id || applicationRecord._id, fieldKey, filename);
    if (!success) {
      showToast(`Simulated download of ${filename}`, "info");
    } else {
      showToast(`Downloading ${filename}`, "success");
    }
  };

  const addTeamMember = () => {
    if (isViewMode) return;
    updateField("teamMembers", [...fields.teamMembers, { name: "", aadhaarNumber: "" }]);
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    if (isViewMode) return;
    const next = [...fields.teamMembers];
    next[index] = { ...next[index], [field]: value };
    updateField("teamMembers", next);
  };

  const removeTeamMember = (index: number) => {
    if (isViewMode) return;
    const next = fields.teamMembers.filter((_, i) => i !== index);
    updateField("teamMembers", next.length ? next : [{ name: "", aadhaarNumber: "" }]);
  };

  const addFundsDeploymentPlan = () => {
    if (isViewMode) return;
    updateField("fundsDeploymentPlan", [
      ...fields.fundsDeploymentPlan,
      { expenseBucket: "", amount: "", startDate: "30/06/2026", endDate: "30/06/2026" },
    ]);
  };

  const removeFundsDeploymentPlan = (index: number) => {
    if (isViewMode) return;
    const next = fields.fundsDeploymentPlan.filter((_, i) => i !== index);
    updateField("fundsDeploymentPlan", next.length ? next : [{ expenseBucket: "", amount: "", startDate: "30/06/2026", endDate: "30/06/2026" }]);
  };

  const updateFundsDeploymentPlan = (index: number, key: keyof FundsDeploymentPlan, value: string) => {
    if (isViewMode) return;
    const next = [...fields.fundsDeploymentPlan];
    next[index] = { ...next[index], [key]: value };
    updateField("fundsDeploymentPlan", next);
  };

  const addTeam = () => {
    if (isViewMode) return;
    updateField("teams", [...fields.teams, { teamName: "", employeeCount: 1 }]);
  };

  const updateTeam = (index: number, field: keyof TeamRow, value: any) => {
    if (isViewMode) return;
    const next = [...fields.teams];
    next[index] = { ...next[index], [field]: value };
    updateField("teams", next);
  };

  const removeTeam = (index: number) => {
    if (isViewMode) return;
    const next = fields.teams.filter((_, i) => i !== index);
    updateField("teams", next.length ? next : [{ teamName: "", employeeCount: 1 }]);
  };

  const setIncubatorPreference = (preferenceOrder: number, incubatorName: string) => {
    if (isViewMode) return;
    if (preferenceOrder === 1) {
      setFields((prev) => ({
        ...prev,
        incubator1: incubatorName,
        incubator2: prev.incubator2 === incubatorName ? "" : prev.incubator2,
        incubator3: prev.incubator3 === incubatorName ? "" : prev.incubator3,
      }));
    } else if (preferenceOrder === 2) {
      setFields((prev) => ({
        ...prev,
        incubator2: incubatorName,
        incubator1: prev.incubator1 === incubatorName ? "" : prev.incubator1,
        incubator3: prev.incubator3 === incubatorName ? "" : prev.incubator3,
      }));
    } else {
      setFields((prev) => ({
        ...prev,
        incubator3: incubatorName,
        incubator1: prev.incubator1 === incubatorName ? "" : prev.incubator1,
        incubator2: prev.incubator2 === incubatorName ? "" : prev.incubator2,
      }));
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`incubator${preferenceOrder}`];
      return next;
    });
  };

  const incubatorChoices = (preferenceOrder: number) => {
    const selected = [fields.incubator1, fields.incubator2, fields.incubator3];
    return incubatorOptions.filter((name) => {
      const currentVal = preferenceOrder === 1 ? fields.incubator1 : preferenceOrder === 2 ? fields.incubator2 : fields.incubator3;
      if (name === currentVal) return true;
      return !selected.includes(name);
    });
  };

  const validateCurrentStep = () => {
    const nextErrors: Record<string, string> = {};
    if (step === 0) {
      if (!fields.authorFirstName.trim()) nextErrors.authorFirstName = "First name is required.";
      if (!fields.authorLastName.trim()) nextErrors.authorLastName = "Last name is required.";
      if (!fields.designation.trim()) nextErrors.designation = "Designation is required.";
      if (!fields.mobile.trim()) nextErrors.mobile = "Mobile number is required.";
      if (!fields.email.trim()) nextErrors.email = "Email is required.";
      if (!aoaMoaFile && !fields.aoaMoaName) nextErrors.aoaMoa = "MOA/AOA document is required.";
    }
    if (step === 1) {
      if (!fields.dpiitNumber.trim()) nextErrors.dpiitNumber = "DPIIT Recognition Number is required.";
      if (!fields.entityName.trim()) nextErrors.entityName = "Entity name is required.";
      if (!fields.natureOfEntity) nextErrors.natureOfEntity = "Nature of entity is required.";
      if (!fields.incorporationDate) nextErrors.incorporationDate = "Incorporation date is required.";
      if (!fields.panNumber.trim()) nextErrors.panNumber = "PAN number is required.";
      if (!fields.state.trim()) nextErrors.state = "State is required.";
      if (!fields.city.trim()) nextErrors.city = "City is required.";
      if (!fields.address.trim()) nextErrors.address = "Address is required.";
    }
    if (step === 2) {
      if (!fields.problemStatement.trim()) nextErrors.problemStatement = "Problem description is required.";
      if (!fields.valueProposition.trim()) nextErrors.valueProposition = "Value proposition is required.";
      if (!fields.uniqueSellingPoint.trim()) nextErrors.uniqueSellingPoint = "USP is required.";
      if (!fields.targetCustomer.trim()) nextErrors.targetCustomer = "Target customer is required.";
      if (!fields.marketSize.trim()) nextErrors.marketSize = "Market size is required.";
      if (!fields.scalePlan.trim()) nextErrors.scalePlan = "Scale plan is required.";
      if (!fields.revenueModel.trim()) nextErrors.revenueModel = "Revenue model is required.";
    }
    if (step === 3) {
      const hasMember = fields.teamMembers.some((member) => member.name.trim());
      if (!hasMember) nextErrors.teamMembers = "Add at least one promoter name.";
    }
    if (step === 4) {
      if (!fields.fundingInstrument) {
        nextErrors.fundingInstrument = "Funding instrument is required.";
      }
      if (!fields.fundingAmount.trim()) {
        nextErrors.fundingAmount = "Funding amount is required.";
      } else {
        const amountNum = parseFloat(fields.fundingAmount.replace(/,/g, "").trim());
        if (isNaN(amountNum)) {
          nextErrors.fundingAmount = "Please enter a valid numeric amount.";
        } else if (fields.fundingInstrument === "Grant" && amountNum > 2000000) {
          nextErrors.fundingAmount = "Maximum funding amount for Grant is ₹20 Lakhs (2,000,000).";
        } else if ((fields.fundingInstrument === "Convertible Debenture" || fields.fundingInstrument === "Debt") && amountNum > 5000000) {
          nextErrors.fundingAmount = "Maximum funding amount for this instrument is ₹50 Lakhs (5,000,000).";
        }
      }
      if (!fields.fundsDeploymentPlan || fields.fundsDeploymentPlan.length === 0 || fields.fundsDeploymentPlan.some(p => !p.expenseBucket.trim() || !p.amount.trim() || !p.startDate.trim() || !p.endDate.trim())) {
        nextErrors.fundsDeploymentPlan = "Please fill in all funds deployment plan fields.";
      }
    }
    if (step === 5) {
      if (!fields.incubator1) nextErrors.incubator1 = "Select incubator preference 1.";
      if (!fields.incubator2) nextErrors.incubator2 = "Select incubator preference 2.";
      if (!fields.incubator3) nextErrors.incubator3 = "Select incubator preference 3.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateAllSteps = () => {
    const nextErrors: Record<string, string> = {};
    if (!fields.authorFirstName.trim()) nextErrors.authorFirstName = "First name is required.";
    if (!fields.authorLastName.trim()) nextErrors.authorLastName = "Last name is required.";
    if (!fields.designation.trim()) nextErrors.designation = "Designation is required.";
    if (!fields.mobile.trim()) nextErrors.mobile = "Mobile number is required.";
    if (!fields.email.trim()) nextErrors.email = "Email is required.";
    if (!aoaMoaFile && !fields.aoaMoaName) nextErrors.aoaMoa = "MOA/AOA document is required.";
    if (!fields.dpiitNumber.trim()) nextErrors.dpiitNumber = "DPIIT Recognition Number is required.";
    if (!fields.entityName.trim()) nextErrors.entityName = "Entity name is required.";
    if (!fields.natureOfEntity) nextErrors.natureOfEntity = "Nature of entity is required.";
    if (!fields.incorporationDate) nextErrors.incorporationDate = "Incorporation date is required.";
    if (!fields.panNumber.trim()) nextErrors.panNumber = "PAN number is required.";
    if (!fields.state.trim()) nextErrors.state = "State is required.";
    if (!fields.city.trim()) nextErrors.city = "City is required.";
    if (!fields.address.trim()) nextErrors.address = "Address is required.";
    if (!fields.problemStatement.trim()) nextErrors.problemStatement = "Problem statement is required.";
    if (!fields.valueProposition.trim()) nextErrors.valueProposition = "Value proposition is required.";
    if (!fields.uniqueSellingPoint.trim()) nextErrors.uniqueSellingPoint = "Unique selling point is required.";
    if (!fields.targetCustomer.trim()) nextErrors.targetCustomer = "Target customer is required.";
    if (!fields.marketSize.trim()) nextErrors.marketSize = "Market size is required.";
    if (!fields.scalePlan.trim()) nextErrors.scalePlan = "Scale plan is required.";
    if (!fields.revenueModel.trim()) nextErrors.revenueModel = "Revenue model is required.";
    if (!fields.teamMembers || fields.teamMembers.length === 0 || fields.teamMembers.some((member) => !member.name.trim() || !member.aadhaarNumber.trim())) {
      nextErrors.teamMembers = "Please fill in all promoter details.";
    }
    if (!fields.teams || fields.teams.length === 0 || fields.teams.some((team) => !team.teamName.trim())) {
      nextErrors.teams = "Please fill in all team names.";
    }
    if (!fields.raisedFunding) nextErrors.raisedFunding = "Select funding status.";
    if (!fields.fundingInstrument) {
      nextErrors.fundingInstrument = "Select funding instrument.";
    }
    if (!fields.fundingAmount.trim()) {
      nextErrors.fundingAmount = "Funding amount is required.";
    } else {
      const amountNum = parseFloat(fields.fundingAmount.replace(/,/g, "").trim());
      if (isNaN(amountNum)) {
        nextErrors.fundingAmount = "Please enter a valid numeric amount.";
      } else if (fields.fundingInstrument === "Grant" && amountNum > 2000000) {
        nextErrors.fundingAmount = "Maximum funding amount for Grant is ₹20 Lakhs (2,000,000).";
      } else if ((fields.fundingInstrument === "Convertible Debenture" || fields.fundingInstrument === "Debt") && amountNum > 5000000) {
        nextErrors.fundingAmount = "Maximum funding amount for this instrument is ₹50 Lakhs (5,000,000).";
      }
    }
    if (!fields.fundsDeploymentPlan || fields.fundsDeploymentPlan.length === 0 || fields.fundsDeploymentPlan.some(p => !p.expenseBucket.trim() || !p.amount.trim() || !p.startDate.trim() || !p.endDate.trim())) {
      nextErrors.fundsDeploymentPlan = "Please fill in all funds deployment plan fields.";
    }
    if (!fields.incubator1) nextErrors.incubator1 = "Select incubator preference 1.";
    if (!fields.incubator2) nextErrors.incubator2 = "Select incubator preference 2.";
    if (!fields.incubator3) nextErrors.incubator3 = "Select incubator preference 3.";
    if (!pitchDeckFile && !fields.pitchDeckName) nextErrors.pitchDeck = "Upload a pitch deck.";
    if (!marketReportFile && !fields.marketReportName) nextErrors.marketReport = "Upload a market research report.";
    if (!otherFile && !fields.otherDocumentName) nextErrors.otherDocument = "Upload a financial projection report.";
    if (!fields.declarationAccepted) nextErrors.declarationAccepted = "Declaration is required.";

    return nextErrors;
  };

  const handleNext = () => {
    if (isViewMode) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
      return;
    }
    if (!validateCurrentStep()) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleFile = (file: File | null, kind: "pitch" | "market" | "other" | "aoaMoa") => {
    if (isViewMode) return;
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      showToast("Maximum document upload size is 15MB.", "error");
      return;
    }
    if (kind === "pitch") {
      setPitchDeckFile(file);
      updateField("pitchDeckName", file.name);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.pitchDeck;
        return next;
      });
    } else if (kind === "market") {
      setMarketReportFile(file);
      updateField("marketReportName", file.name);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.marketReport;
        return next;
      });
    } else if (kind === "aoaMoa") {
      setAoaMoaFile(file);
      updateField("aoaMoaName", file.name);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.aoaMoa;
        return next;
      });
    } else {
      setOtherFile(file);
      updateField("otherDocumentName", file.name);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.otherDocument;
        return next;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isViewMode) return;
    if (user?.isActive === false) {
      setProfileReviewOpen(true);
      return;
    }
    const allErrors = validateAllSteps();
    if (Object.keys(allErrors).length) {
      setErrors(allErrors);
      const stepOrder = [
        ["authorFirstName", "authorLastName", "designation", "mobile", "email", "aoaMoa"],
        ["entityName", "natureOfEntity", "incorporationDate", "panNumber", "state", "city", "address"],
        ["problemStatement", "valueProposition", "uniqueSellingPoint", "targetCustomer", "marketSize", "scalePlan", "revenueModel"],
        ["teamMembers", "teams"],
        ["raisedFunding", "fundingAmount", "fundingInstrument", "fundsDeploymentPlan"],
        ["incubator1", "incubator2", "incubator3"],
        ["pitchDeck", "marketReport", "otherDocument", "declarationAccepted"],
      ];
      const firstErrorIndex = stepOrder.findIndex((keys) =>
        keys.some((key) => Object.keys(allErrors).some((errorKey) => errorKey === key || errorKey.startsWith(`${key}.`)))
      );
      if (firstErrorIndex >= 0) setStep(firstErrorIndex);
      return;
    }

    setSubmitting(true);
    try {
      const created = await applyToProgram({
        ...fields,
        fullTimeEmployees: fields.teams.reduce((sum, t) => sum + t.employeeCount, 0),
        programId: program.id,
        programName: program.name,
        startupId: user?.startupId || "",
        startupName: fields.entityName || userStartup?.startupName || userStartup?.name || "Startup",
        selectedProgram: program.id,
        pitchDeckName: pitchDeckFile?.name || "PitchDeck.pdf",
        marketReportName: marketReportFile?.name || "MarketReport.pdf",
        additionalDocumentsName: otherFile?.name,
        aoaMoaName: aoaMoaFile?.name || fields.aoaMoaName || "AoA_MoA.pdf",
        _pitchDeckFile: pitchDeckFile,
        _marketReportFile: marketReportFile,
        _additionalDocumentsFile: otherFile,
        _aoaMoaFile: aoaMoaFile,
      });
      setSuccessApplication({ id: created.id, programName: created.programName || program.name });
      setSuccessModalOpen(true);
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("under review")) {
        setProfileReviewOpen(true);
        return;
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const currentTitle = steps[step];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8" id="startup-program-application">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] overflow-hidden">

        {/* Header Block */}
        <div className="text-center py-10 bg-slate-50 border-b border-slate-200">
          <h1 className="text-3xl font-black text-[#0B2A5B] tracking-tight">Startup Application</h1>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            All form fields are <span className="font-extrabold text-[#0B2A5B]">mandatory</span>, unless mentioned as <span className="italic font-extrabold">'optional'</span>
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">Application form to be filled in English language</p>
        </div>

        {/* Horizontal Stepper */}
        <div className="border-b border-slate-200 bg-white py-8 px-4 relative">
          <div className="max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="absolute top-[10px] left-[5%] right-[5%] h-[1.5px] bg-[#FCE5B2] z-0" />
            <div
              className="absolute top-[10px] left-[5%] h-[1.5px] bg-[#FDBA74] z-0 transition-all duration-300"
              style={{ width: `${(step / (steps.length - 1)) * 90}%` }}
            />

            <div className="relative z-10 flex justify-between">
              {steps.map((label, index) => {
                const active = index === step;
                const done = index < step;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setStep(index)}
                    className="flex flex-col items-center flex-1 group focus:outline-none"
                  >
                    <div
                      className={`w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 transition-all duration-300 ${active
                          ? "border-[#F05A28] bg-[#FCD88C] shadow-sm"
                          : done
                            ? "border-[#F05A28] bg-[#F05A28]"
                            : "border-[#FCD88C] bg-white"
                        }`}
                    >
                      {active && <div className="w-[10px] h-[10px] rounded-full bg-[#F05A28]" />}
                      {done && <CircleCheckBig className="h-3.5 w-3.5 text-white" />}
                    </div>

                    <span
                      className={`mt-3 text-[10px] font-extrabold max-w-[110px] text-center transition-all duration-300 leading-tight ${active
                          ? "text-[#0B2A5B] font-black"
                          : "text-slate-400 group-hover:text-slate-600"
                        }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white">
          <div className="space-y-6">

            {step === 0 && (
              <StepSection title="Authorized Representative" subtitle="Who is filing this application?">
                <div className="space-y-1">

                  {/* Name of Authorised representative */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
                    <div className="md:col-span-4 pt-2">
                      <label className="text-sm font-extrabold text-[#0B2A5B]">
                        Name of Authorised representative<span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="First Name"
                          value={fields.authorFirstName}
                          onChange={(e) => updateField("authorFirstName", e.target.value)}
                          readOnly={isViewMode}
                          className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${errors.authorFirstName ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
                            } ${isViewMode ? "opacity-75 cursor-not-allowed" : ""}`}
                        />
                        {errors.authorFirstName && <p className="text-red-500 font-bold text-xs mt-1">{errors.authorFirstName}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={fields.authorLastName}
                          onChange={(e) => updateField("authorLastName", e.target.value)}
                          readOnly={isViewMode}
                          className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${errors.authorLastName ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
                            } ${isViewMode ? "opacity-75 cursor-not-allowed" : ""}`}
                        />
                        {errors.authorLastName && <p className="text-red-500 font-bold text-xs mt-1">{errors.authorLastName}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Designation */}
                  <Input
                    label="Designation"
                    value={fields.designation}
                    onChange={(value) => updateField("designation", value)}
                    error={errors.designation}
                    readOnly={isViewMode}
                    required
                  />

                  {/* Mobile No. */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
                    <div className="md:col-span-4 pt-2">
                      <label className="text-sm font-extrabold text-[#0B2A5B]">
                        Mobile No.<span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="md:col-span-8 flex gap-3">
                      <span className="bg-[#EDF0F5] border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-500 font-bold shrink-0">
                        +91
                      </span>
                      <div className="w-full">
                        <input
                          type="text"
                          value={fields.mobile}
                          onChange={(e) => updateField("mobile", e.target.value)}
                          readOnly={isViewMode}
                          className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${errors.mobile ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
                            } ${isViewMode ? "opacity-75 cursor-not-allowed" : ""}`}
                        />
                        {errors.mobile && <p className="text-red-500 font-bold text-xs mt-1">{errors.mobile}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Email ID */}
                  <Input
                    label="Email ID"
                    value={fields.email}
                    onChange={(value) => updateField("email", value)}
                    error={errors.email}
                    readOnly={isViewMode}
                    required
                  />

                  {/* AoA/MoA */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100 last:border-b-0">
                    <div className="md:col-span-4 pt-2">
                      <label className="text-sm font-extrabold text-[#0B2A5B]">
                        Memorandum of Association (MOA)/Articles of Association (AOA)<span className="text-red-500 ml-0.5">*</span>
                      </label>
                    </div>
                    <div className="md:col-span-8 space-y-3">
                      {isViewMode ? (
                        <div
                          onClick={() => handleDownloadFile("aoaMoa", fields.aoaMoaName || "AoA_MoA.pdf")}
                          className="flex flex-col items-center justify-center border border-slate-200 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100 cursor-pointer max-w-sm"
                        >
                          <FileText className="h-6 w-6 text-[#FF6B00]" />
                          <span className="mt-1 text-xs font-bold text-slate-650 truncate w-full text-center">
                            {fields.aoaMoaName || "AoA_MoA.pdf"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">Click to Download</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              className="hidden"
                              id="aoaMoa-file-input"
                              onChange={(event) => handleFile(event.target.files?.[0] || null, "aoaMoa")}
                              accept=".pdf"
                            />
                            <label
                              htmlFor="aoaMoa-file-input"
                              className="inline-flex items-center gap-2 rounded-full border border-[#0B2A5B] px-6 py-2 text-xs font-black uppercase tracking-wider text-[#0B2A5B] hover:bg-slate-50 transition cursor-pointer"
                            >
                              Upload
                            </label>
                          </div>
                          <p className="text-xs text-slate-400 font-bold">Supported file format - PDF only</p>
                          {(aoaMoaFile || fields.aoaMoaName) && (
                            <p className="text-xs font-extrabold text-[#FF6B00]">
                              Selected: {aoaMoaFile?.name || fields.aoaMoaName}
                            </p>
                          )}
                          {errors.aoaMoa && <p className="text-red-500 font-bold text-xs mt-1">{errors.aoaMoa}</p>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </StepSection>
            )}

            {step === 1 && (
              <StepSection title="Entity Details" subtitle="Capture your company identity and registration details.">
                <div className="space-y-1">
                  <Input
                    label="DPIIT Recognition Number"
                    value={fields.dpiitNumber}
                    onChange={(value) => updateField("dpiitNumber", value)}
                    readOnly={isViewMode}
                    required
                  />
                  <Input
                    label="Name of the Entity"
                    value={fields.entityName}
                    onChange={(value) => updateField("entityName", value)}
                    error={errors.entityName}
                    readOnly={isViewMode}
                    required
                  />
                  <Select
                    label="Nature of Entity"
                    value={fields.natureOfEntity}
                    onChange={(value) => updateField("natureOfEntity", value)}
                    error={errors.natureOfEntity}
                    options={entityOptions}
                    disabled={isViewMode}
                    required
                  />
                  <Input
                    label="Incorporation / Registration Date"
                    type="date"
                    value={fields.incorporationDate}
                    onChange={(value) => updateField("incorporationDate", value)}
                    error={errors.incorporationDate}
                    readOnly={isViewMode}
                    required
                  />
                  <Input
                    label="PAN Number"
                    value={fields.panNumber}
                    onChange={(value) => updateField("panNumber", value)}
                    error={errors.panNumber}
                    readOnly={isViewMode}
                    required
                  />
                  <Input
                    label="State"
                    value={fields.state}
                    onChange={(value) => updateField("state", value)}
                    error={errors.state}
                    readOnly={isViewMode}
                    required
                  />
                  <Input
                    label="City"
                    value={fields.city}
                    onChange={(value) => updateField("city", value)}
                    error={errors.city}
                    readOnly={isViewMode}
                    required
                  />
                  <TextArea
                    label="Startup Address"
                    value={fields.address}
                    onChange={(value) => updateField("address", value)}
                    error={errors.address}
                    readOnly={isViewMode}
                    required
                  />
                </div>
              </StepSection>
            )}

            {step === 2 && (
              <StepSection title="Startup Details" subtitle="Summarize what you build, for whom, and why it matters.">
                <div className="space-y-1">
                  <Toggle
                    label="Is it a Technology Startup?"
                    value={fields.technologyStartup}
                    onChange={(value) => updateField("technologyStartup", value)}
                    disabled={isViewMode}
                    required
                    description="Startups should be using technology in it’s core product or service or business model or distribution model or methodology to solve the problem being targetted"
                  />
                  <TextArea
                    label="What is the problem you are solving?"
                    value={fields.problemStatement}
                    onChange={(value) => updateField("problemStatement", value)}
                    error={errors.problemStatement}
                    readOnly={isViewMode}
                    required
                  />
                  <TextArea
                    label="What is your value proposition?"
                    value={fields.valueProposition}
                    onChange={(value) => updateField("valueProposition", value)}
                    error={errors.valueProposition}
                    readOnly={isViewMode}
                    required
                  />
                  <TextArea
                    label="What is your unique selling point?"
                    value={fields.uniqueSellingPoint}
                    onChange={(value) => updateField("uniqueSellingPoint", value)}
                    error={errors.uniqueSellingPoint}
                    readOnly={isViewMode}
                    required
                  />
                  <TextArea
                    label="What is your target customer segment?"
                    value={fields.targetCustomer}
                    onChange={(value) => updateField("targetCustomer", value)}
                    error={errors.targetCustomer}
                    readOnly={isViewMode}
                    required
                  />
                  <Input
                    label="What is the market size of the opportunity?"
                    value={fields.marketSize}
                    onChange={(value) => updateField("marketSize", value)}
                    error={errors.marketSize}
                    readOnly={isViewMode}
                    required
                  />
                  <TextArea
                    label="How do you aim to scale-up?"
                    value={fields.scalePlan}
                    onChange={(value) => updateField("scalePlan", value)}
                    error={errors.scalePlan}
                    readOnly={isViewMode}
                    required
                  />
                  <TextArea
                    label="What will be the revenue model?"
                    value={fields.revenueModel}
                    onChange={(value) => updateField("revenueModel", value)}
                    error={errors.revenueModel}
                    readOnly={isViewMode}
                    required
                  />
                  <Input
                    label="Who are your key competitors?"
                    value={fields.competitors}
                    onChange={(value) => updateField("competitors", value)}
                    readOnly={isViewMode}
                  />
                  <Input
                    label="Website URL (Optional)"
                    value={fields.websiteUrl}
                    onChange={(value) => updateField("websiteUrl", value)}
                    readOnly={isViewMode}
                  />
                </div>
              </StepSection>
            )}

            {step === 3 && (
              <StepSection title="Startup Team" subtitle="List the core people working on the startup.">
                <div className="space-y-4">
                  <Input
                    label="Name & Background of the CEO"
                    value={fields.authorFirstName ? `${fields.authorFirstName} ${fields.authorLastName}`.trim() : ""}
                    onChange={() => { }}
                    readOnly
                    required
                  />
                  <Input
                    label="LinkedIn Profile (Optional)"
                    value={fields.linkedInUrl}
                    onChange={(value) => updateField("linkedInUrl", value)}
                    readOnly={isViewMode}
                  />

                  {/* Promoter details list */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                    <div className="md:col-span-1">
                      <label className="text-sm font-extrabold text-[#0B2A5B]">
                        Promoter Details
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        Fill in details of each promoter of the startup.
                      </p>
                      {errors.teamMembers && (
                        <p className="text-red-500 font-bold text-[11px] mt-1">{errors.teamMembers}</p>
                      )}
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      {/* Headers */}
                      <div className="flex gap-4 items-center">
                        <div className="w-1/2 text-xs font-bold text-slate-700">Name of Promoter</div>
                        <div className="w-1/2 text-xs font-bold text-slate-700">Aadhaar Card Number</div>
                      </div>

                      {/* Rows */}
                      <div className="space-y-3">
                        {fields.teamMembers.map((member, index) => (
                          <div key={index} className="flex gap-4 items-center">
                            <div className="w-1/2">
                              <input
                                type="text"
                                value={member.name}
                                placeholder="Enter Promoter Name"
                                onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                                readOnly={isViewMode}
                                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] focus:bg-white transition"
                              />
                            </div>
                            <div className="w-1/2 flex items-center justify-between gap-3">
                              <input
                                type="text"
                                value={member.aadhaarNumber}
                                placeholder="Enter Aadhaar Number"
                                onChange={(e) => updateTeamMember(index, "aadhaarNumber", e.target.value)}
                                readOnly={isViewMode}
                                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] focus:bg-white transition"
                              />
                              
                              {!isViewMode && fields.teamMembers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeTeamMember(index)}
                                  className="text-slate-400 hover:text-red-500 transition px-2"
                                  title="Remove Promoter"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {!isViewMode && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={addTeamMember}
                            className="text-xs font-bold text-[#F05A28] hover:text-[#d04a18] transition flex items-center gap-1"
                          >
                            + Add Promoter
                          </button>
                        </div>
                      )}
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                    <div className="md:col-span-1">
                      <label className="text-sm font-extrabold text-[#0B2A5B]">
                        List of all teams along with the number of full-time employees in each team
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      {errors.teams && (
                        <p className="text-red-500 font-bold text-[11px] mt-1">{errors.teams}</p>
                      )}
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-1/2 text-xs font-bold text-slate-700">Team Name</div>
                        <div className="w-1/2 text-xs font-bold text-slate-700">No. of full time employees</div>
                      </div>

                      <div className="space-y-3">
                        {fields.teams.map((team, index) => (
                          <div key={index} className="flex gap-4 items-center">
                            <div className="w-1/2">
                              <input
                                type="text"
                                value={team.teamName}
                                placeholder="Enter Team Name"
                                onChange={(e) => updateTeam(index, "teamName", e.target.value)}
                                readOnly={isViewMode}
                                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] focus:bg-white transition"
                              />
                            </div>
                            <div className="w-1/2 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  disabled={isViewMode}
                                  onClick={() => updateTeam(index, "employeeCount", Math.max(1, team.employeeCount - 1))}
                                  className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-[#0B2A5B] font-bold flex items-center justify-center hover:bg-slate-200 transition disabled:opacity-50"
                                >
                                  -
                                </button>
                                <div className="w-14 h-9 flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-700 font-bold rounded text-xs">
                                  {team.employeeCount}
                                </div>
                                <button
                                  type="button"
                                  disabled={isViewMode}
                                  onClick={() => updateTeam(index, "employeeCount", team.employeeCount + 1)}
                                  className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-[#0B2A5B] font-bold flex items-center justify-center hover:bg-slate-200 transition disabled:opacity-50"
                                >
                                  +
                                </button>
                              </div>
                              
                              {!isViewMode && fields.teams.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeTeam(index)}
                                  className="text-slate-400 hover:text-red-500 transition px-2"
                                  title="Remove Team"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {!isViewMode && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={addTeam}
                            className="text-xs font-bold text-[#F05A28] hover:text-[#d04a18] transition flex items-center gap-1"
                          >
                            + Add Team
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </StepSection>
            )}

            {step === 4 && (
              <StepSection title="Funding Details" subtitle="Share the current capital and funding profile.">
                <div className="space-y-1">
                  <Toggle
                    label="Have you cumulatively received more than ₹10 lakhs of monetary support under any Central or State government scheme?"
                    value={fields.raisedFunding}
                    onChange={(value) => updateField("raisedFunding", value)}
                    disabled={isViewMode}
                    required
                    description="Startup should not have received more than Rs 10 lakh of monetary support under any other Central or State Government scheme. This does not include prize money from competitions and grand challenges, subsidized working space, founder monthly allowance, access to labs, or access to prototyping facility"
                  />
                  <FormRow label="Current Funding Requirement" required>
                    <div className="space-y-4">
                      {/* Instrument applying for */}
                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-slate-700">Instrument applying for</span>
                        <div className="flex gap-6 items-center">
                          {(["Grant", "Convertible Debenture", "Debt"] as const).map((opt) => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-655">
                              <input
                                type="radio"
                                name="fundingInstrument"
                                value={opt}
                                checked={fields.fundingInstrument === opt}
                                disabled={isViewMode}
                                onChange={() => updateField("fundingInstrument", opt)}
                                className="h-4 w-4 text-[#F05A28] border-slate-300 focus:ring-[#F05A28] accent-[#F05A28]"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                        {errors.fundingInstrument && (
                          <p className="text-red-500 font-bold text-[11px] mt-1">{errors.fundingInstrument}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5 text-[11px] text-slate-500 font-medium leading-relaxed">
                        <p>
                          <strong className="text-slate-650 font-bold">Grant:</strong> It is for Proof of Concept or prototype development or product trials.
                        </p>
                        <p>
                          <strong className="text-slate-650 font-bold">Convertible Debentures/Debt/Debt-linked Instruments:</strong> They are for market entry, commercialization or scaling up
                        </p>
                      </div>

                      {/* Quantum of Funds Required */}
                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-slate-700">Quantum of Funds Required</span>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={fields.fundingAmount}
                            onChange={(e) => updateField("fundingAmount", e.target.value)}
                            disabled={isViewMode}
                            placeholder="Enter Amount"
                            className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] focus:bg-white transition w-44"
                          />
                          <span className="text-xs text-slate-400 font-semibold">Enter in (₹)</span>
                        </div>
                        {fields.fundingInstrument && (
                          <p className="text-[10px] text-slate-400 font-semibold italic mt-0.5">
                            {fields.fundingInstrument === "Grant"
                              ? "Maximum allowed: ₹20 Lakhs (2,000,000)"
                              : "Maximum allowed: ₹50 Lakhs (5,000,000)"}
                          </p>
                        )}
                        {errors.fundingAmount && (
                          <p className="text-red-500 font-bold text-[11px] mt-1">{errors.fundingAmount}</p>
                        )}
                      </div>
                    </div>
                  </FormRow>

                  <FormRow label="Prior Funding Details">
                    <div className="space-y-4">
                      {/* Checkbox NA */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={priorFundingNA}
                          onChange={(e) => setPriorFundingNA(e.target.checked)}
                          className="h-4 w-4 rounded text-[#F05A28] border-slate-300 focus:ring-[#F05A28] accent-[#F05A28]"
                        />
                        <span>NA</span>
                      </label>

                      <p className="text-xs text-slate-400 font-semibold">
                        Please give details of all the funding details received by the startup across different rounds of funding.
                      </p>

                      <div className="space-y-4">
                        {priorFundings.map((funding, idx) => (
                          <div key={idx} className="space-y-4 relative">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-slate-700">Date</label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={funding.date}
                                    disabled={priorFundingNA || isViewMode}
                                    onChange={(e) => {
                                      const next = [...priorFundings];
                                      next[idx].date = e.target.value;
                                      setPriorFundings(next);
                                    }}
                                    className="w-full bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] transition"
                                    placeholder="DD/MM/YYYY"
                                  />
                                  <Calendar className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-slate-700">Amount (in ₹)</label>
                                <input
                                  type="text"
                                  value={funding.amount}
                                  disabled={priorFundingNA || isViewMode}
                                  onChange={(e) => {
                                    const next = [...priorFundings];
                                    next[idx].amount = e.target.value;
                                    setPriorFundings(next);
                                  }}
                                  className="w-full bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] transition"
                                  placeholder="Enter Amount"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-slate-700">Financial Instrument</label>
                                <select
                                  value={funding.instrument}
                                  disabled={priorFundingNA || isViewMode}
                                  onChange={(e) => {
                                    const next = [...priorFundings];
                                    next[idx].instrument = e.target.value;
                                    setPriorFundings(next);
                                  }}
                                  className="w-full bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] transition"
                                >
                                  <option value="">Select</option>
                                  <option value="Grant">Grant</option>
                                  <option value="Equity">Equity</option>
                                  <option value="Debt">Debt</option>
                                  <option value="Convertible Debenture">Convertible Debenture</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-slate-700">Name of Funding Agency</label>
                                <input
                                  type="text"
                                  value={funding.agencyName}
                                  disabled={priorFundingNA || isViewMode}
                                  onChange={(e) => {
                                    const next = [...priorFundings];
                                    next[idx].agencyName = e.target.value;
                                    setPriorFundings(next);
                                  }}
                                  className="w-full bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] transition"
                                  placeholder="Enter Name"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-slate-700">Funding Agency Type</label>
                                <select
                                  value={funding.agencyType}
                                  disabled={priorFundingNA || isViewMode}
                                  onChange={(e) => {
                                    const next = [...priorFundings];
                                    next[idx].agencyType = e.target.value;
                                    setPriorFundings(next);
                                  }}
                                  className="w-full bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] transition"
                                >
                                  <option value="">Select</option>
                                  <option value="Government">Government</option>
                                  <option value="Private VC">Private VC</option>
                                  <option value="Angel Investor">Angel Investor</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>

                            {!priorFundingNA && !isViewMode && priorFundings.length > 1 && (
                              <div className="pt-1 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setPriorFundings(priorFundings.filter((_, i) => i !== idx))}
                                  className="text-[11px] font-bold text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {!priorFundingNA && !isViewMode && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={addPriorFunding}
                            className="text-xs font-bold text-[#F05A28] hover:text-[#d04a18] transition flex items-center gap-1"
                          >
                            + Add More
                          </button>
                        </div>
                      )}
                    </div>
                  </FormRow>

                  <FormRow label="Funds Deployment Plan with Broad Expense Categories" required>
                    <div className="space-y-6">
                      {fields.fundsDeploymentPlan.map((plan, idx) => (
                        <div key={idx} className="space-y-4 p-4 bg-slate-50/50 rounded-xl border border-slate-200 relative">
                          {!isViewMode && fields.fundsDeploymentPlan.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFundsDeploymentPlan(idx)}
                              className="absolute top-2 right-2 text-slate-400 hover:text-red-500 font-black text-sm"
                              title="Remove category"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-700">Expense Bucket</label>
                              <input
                                type="text"
                                value={plan.expenseBucket}
                                disabled={isViewMode}
                                onChange={(e) => updateFundsDeploymentPlan(idx, "expenseBucket", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] transition"
                                placeholder="Enter Expense Category"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-700">Amount</label>
                              <input
                                type="text"
                                value={plan.amount}
                                disabled={isViewMode}
                                onChange={(e) => updateFundsDeploymentPlan(idx, "amount", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] transition"
                                placeholder="Enter Amount"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-700">Deployment Start Date</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={plan.startDate}
                                  disabled={isViewMode}
                                  onChange={(e) => updateFundsDeploymentPlan(idx, "startDate", e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] transition"
                                  placeholder="DD/MM/YYYY"
                                />
                                <Calendar className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-700">Deployment End Date</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={plan.endDate}
                                  disabled={isViewMode}
                                  onChange={(e) => updateFundsDeploymentPlan(idx, "endDate", e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-[#F05A28] transition"
                                  placeholder="DD/MM/YYYY"
                                />
                                <Calendar className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {errors.fundsDeploymentPlan && (
                        <p className="text-red-500 font-bold text-[11px] mt-1">{errors.fundsDeploymentPlan}</p>
                      )}

                      {!isViewMode && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={addFundsDeploymentPlan}
                            className="text-xs font-bold text-[#F05A28] hover:text-[#d04a18] transition flex items-center gap-1"
                          >
                            + Add More
                          </button>
                        </div>
                      )}
                    </div>
                  </FormRow>

                </div>
              </StepSection>
            )}

            {step === 5 && (
              <StepSection title="Incubator Preference" subtitle="Choose your preferred incubators in order.">
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#FCD88C] bg-[#FFF8E7] p-4 text-xs font-semibold text-slate-700 leading-relaxed space-y-3">
                    <p>
                      <span className="text-red-500 font-bold">Note: </span>
                      Please note that once your application is submitted, you cannot modify your incubator preferences, or the amount and instrument of funding requested. If your application is selected by more than one preferred incubator, it will be allocated to the highest preferred incubator that you selected and cannot be shifted to another incubator.
                    </p>
                    <p>
                      Before submitting the application, we encourage startups to carefully review our portfolio.This will help applicant startups to make an informed decision about the incubator preferences based on relevant parameters such as sector alignment, available funding balance, city/state, or any other relevant parameters. You may also contact the incubators directly using the contact details provided in the portfolio selection.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Select
                      label="Incubator Preference #1"
                      value={fields.incubator1}
                      onChange={(value) => setIncubatorPreference(1, value)}
                      error={errors.incubator1}
                      options={incubatorChoices(1)}
                      disabled={isViewMode}
                      required
                    />
                    <Select
                      label="Incubator Preference #2"
                      value={fields.incubator2}
                      onChange={(value) => setIncubatorPreference(2, value)}
                      error={errors.incubator2}
                      options={incubatorChoices(2)}
                      disabled={isViewMode}
                      required
                    />
                    <Select
                      label="Incubator Preference #3"
                      value={fields.incubator3}
                      onChange={(value) => setIncubatorPreference(3, value)}
                      error={errors.incubator3}
                      options={incubatorChoices(3)}
                      disabled={isViewMode}
                      required
                    />
                  </div>
                </div>
              </StepSection>
            )}

            {step === 6 && (
              <StepSection title="Upload Documents" subtitle="Final attachments before submit.">
                <div className="space-y-4">
                  {isViewMode ? (
                    <FormRow label="Pitch Deck of your Business Idea" required>
                      <div 
                        onClick={() => handleDownloadFile("pitchDeck", fields.pitchDeckName || "PitchDeck.pdf")}
                        className="flex flex-col items-center justify-center border border-slate-200 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100 cursor-pointer max-w-sm"
                      >
                        <FileText className="h-6 w-6 text-[#FF6B00]" />
                        <span className="mt-1 text-xs font-bold text-slate-655 text-center truncate w-full">
                          {fields.pitchDeckName || "PitchDeck.pdf"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">Click to Download</span>
                      </div>
                    </FormRow>
                  ) : (
                    <FileUpload
                      label="Upload Pitch Deck of your Business Idea"
                      file={pitchDeckFile}
                      fileName={fields.pitchDeckName}
                      onFile={handleFile}
                      kind="pitch"
                      helper="Supported format - PDF only | Max size: 15 MB"
                      disabled={isViewMode}
                      required
                      error={errors.pitchDeck}
                    />
                  )}

                  <Input
                    label="Video URL showcasing your product and/or business model (Optional)"
                    value={fields.videoUrl}
                    onChange={(value) => updateField("videoUrl", value)}
                    readOnly={isViewMode}
                  />

                  {isViewMode ? (
                    fields.marketReportName ? (
                      <FormRow label="Market Research Report of your Company" required>
                        <div 
                          onClick={() => handleDownloadFile("marketReport", fields.marketReportName || "MarketReport.pdf")}
                          className="flex flex-col items-center justify-center border border-slate-200 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100 cursor-pointer max-w-sm"
                        >
                          <FileText className="h-6 w-6 text-[#FF6B00]" />
                          <span className="mt-1 text-xs font-bold text-slate-650 text-center truncate w-full">
                            {fields.marketReportName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">Click to Download</span>
                        </div>
                      </FormRow>
                    ) : null
                  ) : (
                    <FileUpload
                      label="Upload Market research report of your company"
                      file={marketReportFile}
                      fileName={fields.marketReportName}
                      onFile={handleFile}
                      kind="market"
                      helper="Supported format - PDF only | Max size: 15 MB"
                      disabled={isViewMode}
                      required
                      error={errors.marketReport}
                    />
                  )}

                  {isViewMode ? (
                    fields.otherDocumentName ? (
                      <FormRow label="Financial Projection Report Document" required>
                        <div
                          onClick={() => handleDownloadFile("otherDocument", fields.otherDocumentName || "Attachment.pdf")}
                          className="flex flex-col items-center justify-center border border-slate-200 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100 cursor-pointer max-w-sm"
                        >
                          <FileText className="h-6 w-6 text-[#FF6B00]" />
                          <span className="mt-1 text-xs font-bold text-slate-650 text-center truncate w-full">
                            {fields.otherDocumentName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">Click to Download</span>
                        </div>
                      </FormRow>
                    ) : null
                  ) : (
                    <FileUpload
                      label="Upload financial projection report document"
                      file={otherFile}
                      fileName={fields.otherDocumentName}
                      onFile={handleFile}
                      kind="other"
                      helper="Supported format - PDF only | Max size: 15 MB"
                      disabled={isViewMode}
                      required
                      error={errors.otherDocument}
                    />
                  )}

                  <div className="py-4">
                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fields.declarationAccepted}
                        onChange={(e) => updateField("declarationAccepted", e.target.checked)}
                        disabled={isViewMode}
                        className="mt-1.5 h-4 w-4 rounded border-slate-350 text-[#F05A28] focus:ring-[#F05A28]"
                      />
                      <span className="font-semibold text-xs text-slate-655">
                        We are in compliance with the provisions of the various Acts, Rules, Regulations, Guidelines, Standards applicable to the entity from time to time. All information provided by us in the application is true, correct and complete and no information material to the subject matter of this form has been suppressed or concealed.
                      </span>
                    </label>
                    {errors.declarationAccepted && (
                      <p className="text-red-500 font-bold text-xs mt-1">{errors.declarationAccepted}</p>
                    )}
                  </div>
                </div>
              </StepSection>
            )}

            {/* Footer Buttons Bar */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-6 mt-8">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full border-2 border-[#5B75A6] px-8 py-2 text-sm font-bold uppercase text-[#5B75A6] hover:bg-slate-50 transition-colors duration-200"
              >
                {isViewMode ? "Close" : "Cancel"}
              </button>

              <div className="text-sm font-semibold text-slate-500">
                Step {step + 1} / {steps.length}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={step === 0}
                  className="rounded-full border-2 border-slate-300 px-6 py-2 text-sm font-bold uppercase text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition-colors duration-200"
                >
                  Previous
                </button>

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-[#FCE5B2] px-8 py-2 text-sm font-bold uppercase text-[#735A1A] hover:bg-[#FCD88C] transition-colors duration-200"
                  >
                    {isViewMode ? "Next" : "Save and Next"}
                  </button>
                ) : isViewMode ? null : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-[#F05A28] px-8 py-2 text-sm font-bold uppercase text-white hover:bg-[#E04F20] transition-colors duration-200 shadow-md disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
            </div>

          </div>
        </form>
      </div>

      <ApplicationSuccessModal
        open={successModalOpen}
        applicationId={successApplication?.id}
        programName={successApplication?.programName}
        onClose={() => setSuccessModalOpen(false)}
        onContinue={() => {
          setSuccessModalOpen(false);
          navigate("/startup/dashboard");
        }}
      />
      <ProfileUnderReviewModal open={profileReviewOpen} onClose={() => setProfileReviewOpen(false)} />
    </div>
  );
};

const StepSection: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="space-y-6">
    <div className="bg-white">{children}</div>
  </div>
);

const FormRow: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ label, required = false, error, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100 last:border-b-0">
    <div className="md:col-span-4 pt-2">
      <label className="text-sm font-extrabold text-[#0B2A5B]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    </div>
    <div className="md:col-span-8">
      {children}
      {error && <p className="text-red-500 font-bold text-xs mt-1">{error}</p>}
    </div>
  </div>
);

const Input: React.FC<{
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  readOnly?: boolean;
  required?: boolean;
}> = ({ label, value, onChange, error, type = "text", readOnly = false, required = false }) => (
  <FormRow label={label} required={required} error={error}>
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      aria-readonly={readOnly}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${error ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
        } ${readOnly ? "opacity-75 cursor-not-allowed" : ""}`}
    />
  </FormRow>
);

const TextArea: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  readOnly?: boolean;
  required?: boolean;
}> = ({ label, value, onChange, error, readOnly = false, required = false }) => (
  <FormRow label={label} required={required} error={error}>
    <textarea
      rows={4}
      value={value}
      readOnly={readOnly}
      aria-readonly={readOnly}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${error ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
        } ${readOnly ? "opacity-75 cursor-not-allowed" : ""}`}
    />
  </FormRow>
);

const Select: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  disabled?: boolean;
  required?: boolean;
}> = ({ label, value, onChange, options, error, disabled = false, required = false }) => (
  <FormRow label={label} required={required} error={error}>
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${error ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
        } ${disabled ? "cursor-not-allowed opacity-75" : ""}`}
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </FormRow>
);

const Toggle: React.FC<{
  label: string;
  value: string;
  onChange: (value: "Yes" | "No") => void;
  disabled?: boolean;
  required?: boolean;
  description?: string;
}> = ({ label, value, onChange, disabled = false, required = false, description }) => (
  <FormRow label={label} required={required}>
    <div className="space-y-2">
      <div className="inline-flex rounded-full border border-[#FDBA74] bg-[#FFF4EA] p-1">
        {(["Yes", "No"] as const).map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option)}
            className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider transition ${value === option ? "bg-[#F05A28] text-white" : "text-slate-500"
              } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {option}
          </button>
        ))}
      </div>
      {description && <p className="text-xs text-slate-500 font-semibold leading-relaxed">{description}</p>}
    </div>
  </FormRow>
);

const FileUpload: React.FC<{
  label: string;
  helper?: string;
  sampleText?: string;
  file: File | null;
  fileName?: string;
  kind: "pitch" | "market" | "other";
  onFile: (file: File | null, kind: "pitch" | "market" | "other") => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}> = ({ label, helper, sampleText, file, fileName, kind, onFile, disabled = false, required = false, error }) => (
  <FormRow label={label} required={required} error={error}>
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <input
          type="file"
          className="hidden"
          id={`${kind}-file-input`}
          disabled={disabled}
          onChange={(event) => onFile(event.target.files?.[0] || null, kind)}
          accept=".pdf,.ppt,.pptx"
        />
        <label
          htmlFor={`${kind}-file-input`}
          className={`inline-flex items-center gap-2 rounded-full border border-[#0B2A5B] px-6 py-2 text-xs font-black uppercase tracking-wider text-[#0B2A5B] hover:bg-slate-50 transition ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
        >
          Upload
        </label>
        {sampleText && (
          <span className="text-xs font-bold text-[#F05A28] underline cursor-pointer">
            {sampleText}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 font-semibold leading-relaxed">{helper}</p>
      {(file || fileName) && (
        <p className="text-xs font-extrabold text-[#FF6B00]">
          Selected: {file?.name || fileName}
        </p>
      )}
    </div>
  </FormRow>
);
