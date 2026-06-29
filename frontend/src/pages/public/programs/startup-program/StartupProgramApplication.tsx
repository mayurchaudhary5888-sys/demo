/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, ArrowRight, Circle, CircleCheckBig, FileText } from "lucide-react";
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
  role: string;
  email: string;
  mobile: string;
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
  raisedFunding: "Yes" | "No";
  fundingAmount: string;
  fundingInstrument: string;
  incubator1: string;
  incubator2: string;
  incubator3: string;
  pitchDeckName?: string;
  videoUrl: string;
  otherDocumentName?: string;
  declarationAccepted: boolean;
};

const entityOptions = ["Private Limited Company", "LLP", "Partnership", "Proprietorship", "Section 8 / Non-profit", "Other"];
const fundingInstrumentOptions = ["Grant", "Equity", "Debt", "Convertible", "Bootstrapped", "Other"];
const incubatorOptions = incubatorPreferences as string[];
type StartupApplicationRecord = Application & Partial<StartupWizardFields> & Record<string, any>;

const splitName = (name = "") => {
  const [firstName = "", ...rest] = name.trim().split(/\s+/).filter(Boolean);
  return { firstName, lastName: rest.join(" ") };
};

const yesNoValue = (value: unknown, fallback: "Yes" | "No"): "Yes" | "No" => (value === "Yes" || value === "No" ? value : fallback);

const normalizeTeamMembers = (value: unknown): TeamMember[] => {
  if (!Array.isArray(value)) return [{ name: "", role: "", email: "", mobile: "" }];
  const members = value
    .map((member) => ({
      name: String(member?.name || ""),
      role: String(member?.role || ""),
      email: String(member?.email || ""),
      mobile: String(member?.mobile || ""),
    }))
    .filter((member) => member.name || member.role || member.email || member.mobile);
  return members.length ? members : [{ name: "", role: "", email: "", mobile: "" }];
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
  raisedFunding: yesNoValue(application?.raisedFunding, "No"),
  fundingAmount: application?.fundingAmount || "",
  fundingInstrument: application?.fundingInstrument || "",
  incubator1: application?.incubator1 || application?.incubatorPreferences?.find((pref: any) => pref.preferenceOrder === 1)?.incubatorName || "",
  incubator2: application?.incubator2 || application?.incubatorPreferences?.find((pref: any) => pref.preferenceOrder === 2)?.incubatorName || "",
  incubator3: application?.incubator3 || application?.incubatorPreferences?.find((pref: any) => pref.preferenceOrder === 3)?.incubatorName || "",
  pitchDeckName: application?.pitchDeckName || "",
  videoUrl: application?.videoUrl || "",
  otherDocumentName: application?.otherDocumentName || application?.additionalDocumentsName || "",
  declarationAccepted: application?.declarationAccepted ?? true,
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
  const [otherFile, setOtherFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successApplication, setSuccessApplication] = useState<{ id: string; programName: string } | null>(null);
  const [profileReviewOpen, setProfileReviewOpen] = useState(false);

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
    setOtherFile(null);
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
    updateField("teamMembers", [...fields.teamMembers, { name: "", role: "", email: "", mobile: "" }]);
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
    updateField("teamMembers", next.length ? next : [{ name: "", role: "", email: "", mobile: "" }]);
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
    }
    if (step === 1) {
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
      if (fields.raisedFunding === "Yes" && !fields.fundingAmount.trim()) {
        nextErrors.fundingAmount = "Funding amount is required.";
      }
      if (fields.raisedFunding === "Yes" && !fields.fundingInstrument) {
        nextErrors.fundingInstrument = "Funding instrument is required.";
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
    if (!fields.teamMembers.some((member) => member.name.trim() || member.role.trim() || member.email.trim() || member.mobile.trim())) {
      nextErrors.teamMembers = "Add at least one team member.";
    }
    if (!fields.raisedFunding) nextErrors.raisedFunding = "Select funding status.";
    if (fields.raisedFunding === "Yes" && !fields.fundingAmount.trim()) nextErrors.fundingAmount = "Funding amount is required.";
    if (fields.raisedFunding === "Yes" && !fields.fundingInstrument) nextErrors.fundingInstrument = "Select funding instrument.";
    if (!fields.incubator1) nextErrors.incubator1 = "Select incubator preference 1.";
    if (!fields.incubator2) nextErrors.incubator2 = "Select incubator preference 2.";
    if (!fields.incubator3) nextErrors.incubator3 = "Select incubator preference 3.";
    if (!pitchDeckFile && !fields.pitchDeckName) nextErrors.pitchDeck = "Upload a pitch deck.";
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

  const handleFile = (file: File | null, kind: "pitch" | "other") => {
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
    } else {
      setOtherFile(file);
      updateField("otherDocumentName", file.name);
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
        ["authorFirstName", "authorLastName", "designation", "mobile", "email"],
        ["entityName", "natureOfEntity", "incorporationDate", "panNumber", "state", "city", "address"],
        ["problemStatement", "valueProposition", "uniqueSellingPoint", "targetCustomer", "marketSize", "scalePlan", "revenueModel"],
        ["teamMembers"],
        ["raisedFunding", "fundingAmount", "fundingInstrument"],
        ["incubator1", "incubator2", "incubator3"],
        ["pitchDeck", "declarationAccepted"],
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
        programId: program.id,
        programName: program.name,
        startupId: user?.startupId || "",
        startupName: fields.entityName || userStartup?.startupName || userStartup?.name || "Startup",
        selectedProgram: program.id,
        pitchDeckName: pitchDeckFile?.name || "PitchDeck.pdf",
        additionalDocumentsName: otherFile?.name,
        _pitchDeckFile: pitchDeckFile,
        _additionalDocumentsFile: otherFile,
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
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] overflow-hidden">
        
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
          <div className="max-w-3xl mx-auto relative">
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
                      className={`w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        active 
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
                      className={`mt-3 text-[10px] font-extrabold max-w-[110px] text-center transition-all duration-300 leading-tight ${
                        active 
                          ? "text-[#0B2A5B] font-black underline decoration-2 underline-offset-4" 
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
                          className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                            errors.authorFirstName ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
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
                          className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                            errors.authorLastName ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
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
                          className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                            errors.mobile ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
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

                  {/* Board Resolution / Authorisation letter / PoA */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100 last:border-b-0">
                    <div className="md:col-span-4 pt-2">
                      <label className="text-sm font-extrabold text-[#0B2A5B]">
                        Board Resolution / Authorisation letter / PoA<span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="md:col-span-8 space-y-3">
                      {isViewMode ? (
                        <div className="flex flex-col items-center justify-center border border-slate-200 rounded-lg bg-slate-50 p-4 max-w-sm">
                          <FileText className="h-6 w-6 text-[#FF6B00]" />
                          <span className="mt-1 text-xs font-bold text-slate-650">BoardResolution.pdf</span>
                          <span className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">Download File</span>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="text-xs font-bold text-[#F05A28] underline cursor-pointer">
                              Sample Download
                            </span>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-full border border-[#0B2A5B] px-6 py-2 text-xs font-black uppercase tracking-wider text-[#0B2A5B] hover:bg-slate-50 transition"
                            >
                              Upload
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 font-bold">Supported file format - PDF only</p>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            For the person filling this form and signing other self-declaration documents from authorised signatory of the applicant for filling and representing the organisation for this application
                          </p>
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
                    onChange={() => {}}
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
                  <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#0B2A5B]">Promoter Details</h4>
                        <p className="text-xs text-slate-500 font-medium">Add at least one promoter or founding member.</p>
                      </div>
                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={addTeamMember}
                          className="rounded-full border border-[#F05A28] px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#F05A28] hover:bg-orange-50 transition"
                        >
                          Add Promoter
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {fields.teamMembers.map((member, index) => (
                        <div key={index} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Promoter #{index + 1}</span>
                            {!isViewMode && (
                              <button
                                type="button"
                                onClick={() => removeTeamMember(index)}
                                className="text-xs font-bold text-red-500 hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="block space-y-1">
                              <span className="text-xs font-bold text-slate-600">Name</span>
                              <input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                                  readOnly={isViewMode}
                                  className="w-full bg-[#EDF0F5] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#F05A28] focus:bg-white transition-all font-semibold"
                                />
                            </label>
                            <label className="block space-y-1">
                              <span className="text-xs font-bold text-slate-600">Role</span>
                              <input
                                  type="text"
                                  value={member.role}
                                  onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                                  readOnly={isViewMode}
                                  className="w-full bg-[#EDF0F5] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#F05A28] focus:bg-white transition-all font-semibold"
                                />
                            </label>
                            <label className="block space-y-1">
                              <span className="text-xs font-bold text-slate-600">Email</span>
                              <input
                                  type="text"
                                  value={member.email}
                                  onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                                  readOnly={isViewMode}
                                  className="w-full bg-[#EDF0F5] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#F05A28] focus:bg-white transition-all font-semibold"
                                />
                            </label>
                            <label className="block space-y-1">
                              <span className="text-xs font-bold text-slate-600">Mobile</span>
                              <input
                                  type="text"
                                  value={member.mobile}
                                  onChange={(e) => updateTeamMember(index, "mobile", e.target.value)}
                                  readOnly={isViewMode}
                                  className="w-full bg-[#EDF0F5] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#F05A28] focus:bg-white transition-all font-semibold"
                                />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <FormRow label="No. of full-time employees" required>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={isViewMode}
                        onClick={() => updateField("fullTimeEmployees", Math.max(1, fields.fullTimeEmployees - 1))}
                        className="h-8 w-8 rounded-full border border-[#F05A28] text-[#F05A28] font-bold disabled:opacity-40 flex items-center justify-center hover:bg-orange-50 transition"
                      >
                        -
                      </button>
                      <span className="min-w-[60px] rounded-lg bg-slate-100 px-4 py-2 text-center font-bold text-slate-800">
                        {fields.fullTimeEmployees}
                      </span>
                      <button
                        type="button"
                        disabled={isViewMode}
                        onClick={() => updateField("fullTimeEmployees", fields.fullTimeEmployees + 1)}
                        className="h-8 w-8 rounded-full border border-[#F05A28] text-[#F05A28] font-bold disabled:opacity-40 flex items-center justify-center hover:bg-orange-50 transition"
                      >
                        +
                      </button>
                    </div>
                  </FormRow>
                </div>
              </StepSection>
            )}

            {step === 4 && (
              <StepSection title="Funding Details" subtitle="Share the current capital and funding profile.">
                <div className="space-y-1">
                  <Toggle
                    label="Have you cumulatively received more than ₹10 lakhs?"
                    value={fields.raisedFunding}
                    onChange={(value) => updateField("raisedFunding", value)}
                    disabled={isViewMode}
                    required
                  />
                  <Input
                    label="Current Funding Requirement"
                    value={fields.fundingAmount}
                    onChange={(value) => updateField("fundingAmount", value)}
                    error={errors.fundingAmount}
                    readOnly={isViewMode}
                  />
                  <Select
                    label="Funding Instrument"
                    value={fields.fundingInstrument}
                    onChange={(value) => updateField("fundingInstrument", value)}
                    error={errors.fundingInstrument}
                    options={fundingInstrumentOptions}
                    disabled={isViewMode}
                  />
                  <Input
                    label="Your current revenue / traction note"
                    value={fields.revenueModel}
                    onChange={(value) => updateField("revenueModel", value)}
                    readOnly={isViewMode}
                  />
                </div>
              </StepSection>
            )}

            {step === 5 && (
              <StepSection title="Incubator Preference" subtitle="Choose your preferred incubators in order.">
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#FCD88C] bg-[#FFF8E7] p-4 text-xs font-semibold text-slate-700 leading-relaxed">
                    Please note that once your application is submitted, you cannot modify incubator preferences, or the amount and instrument of funding requested.
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
                <div className="space-y-1">
                  {isViewMode ? (
                    <FormRow label="Pitch Deck of your Business Idea" required>
                      <div 
                        onClick={() => handleDownloadFile("pitchDeck", fields.pitchDeckName || "PitchDeck.pdf")}
                        className="flex flex-col items-center justify-center border border-slate-200 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100 cursor-pointer max-w-sm"
                      >
                        <FileText className="h-6 w-6 text-[#FF6B00]" />
                        <span className="mt-1 text-xs font-bold text-slate-650 text-center truncate w-full">
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
                      sampleText="Download Sample Pitch Deck"
                      disabled={isViewMode}
                      required
                    />
                  )}

                  <Input
                    label="Video URL showcasing your product and/or business model (Optional)"
                    value={fields.videoUrl}
                    onChange={(value) => updateField("videoUrl", value)}
                    readOnly={isViewMode}
                  />

                  {isViewMode ? (
                    fields.otherDocumentName ? (
                      <FormRow label="Other relevant document">
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
                      label="Upload any other relevant document (Optional)"
                      file={otherFile}
                      fileName={fields.otherDocumentName}
                      onFile={handleFile}
                      kind="other"
                      helper="Supported format - PDF only | Max size: 15 MB"
                      disabled={isViewMode}
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
                      <span className="font-semibold text-xs text-slate-650">
                        We are in compliance with the provisions of the various Acts, Rules, Regulations, Guidelines, Standards applicable to the entity from time to time. All information provided by us is true, correct and complete.
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
    <div className="border-b border-slate-200 pb-3">
      <h2 className="text-lg font-black text-[#0B2A5B]">{title}</h2>
      <p className="mt-1 text-xs font-semibold text-slate-400">{subtitle}</p>
    </div>
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
      className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
        error ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
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
      className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
        error ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
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
      className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
        error ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#F05A28] focus:bg-white"
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
}> = ({ label, value, onChange, disabled = false, required = false }) => (
  <FormRow label={label} required={required}>
    <div className="inline-flex rounded-full border border-[#FDBA74] bg-[#FFF4EA] p-1">
      {(["Yes", "No"] as const).map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option)}
          className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider transition ${
            value === option ? "bg-[#F05A28] text-white" : "text-slate-500"
          } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
        >
          {option}
        </button>
      ))}
    </div>
  </FormRow>
);

const FileUpload: React.FC<{
  label: string;
  helper?: string;
  sampleText?: string;
  file: File | null;
  fileName?: string;
  kind: "pitch" | "other";
  onFile: (file: File | null, kind: "pitch" | "other") => void;
  disabled?: boolean;
  required?: boolean;
}> = ({ label, helper, sampleText, file, fileName, kind, onFile, disabled = false, required = false }) => (
  <FormRow label={label} required={required}>
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
          className={`inline-flex items-center gap-2 rounded-full border border-[#0B2A5B] px-6 py-2 text-xs font-black uppercase tracking-wider text-[#0B2A5B] hover:bg-slate-50 transition ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
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
