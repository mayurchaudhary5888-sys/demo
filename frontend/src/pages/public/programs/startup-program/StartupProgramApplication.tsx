/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, ArrowRight, Circle, CircleCheckBig } from "lucide-react";
import { useAppState } from "../../../../context/AppContext";
import type { Application, Program } from "../../../../types";
import { ApplicationSuccessModal } from "../../../../components/common/ApplicationSuccessModal";
import { ProfileUnderReviewModal } from "../../../../components/common/ProfileUnderReviewModal";
import incubatorPreferences from "../../../../data/incubatorPreferences.json";

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

  const addTeamMember = () => {
    if (isViewMode) return;
    updateField("teamMembers", [...fields.teamMembers, { name: "", role: "", email: "", mobile: "" }]);
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    if (isViewMode) return;
    const nextMembers = fields.teamMembers.map((member, idx) => (idx === index ? { ...member, [field]: value } : member));
    updateField("teamMembers", nextMembers);
  };

  const setIncubatorPreference = (index: 1 | 2 | 3, value: string) => {
    if (isViewMode) return;
    const key = `incubator${index}` as const;
    const nextFields = { ...fields, [key]: value } as StartupWizardFields;
    (["incubator1", "incubator2", "incubator3"] as const).forEach((otherKey) => {
      if (otherKey !== key && nextFields[otherKey] === value) {
        nextFields[otherKey] = "";
      }
    });
    setFields(nextFields);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.incubator1;
      delete next.incubator2;
      delete next.incubator3;
      return next;
    });
  };

  const incubatorChoices = (currentIndex: 1 | 2 | 3) => {
    const currentValue =
      currentIndex === 1 ? fields.incubator1 : currentIndex === 2 ? fields.incubator2 : fields.incubator3;
    const excluded = [fields.incubator1, fields.incubator2, fields.incubator3].filter(
      (item) => item && item !== currentValue
    );
    return incubatorOptions.filter((option) => option === currentValue || !excluded.includes(option));
  };

  const removeTeamMember = (index: number) => {
    if (isViewMode) return;
    const nextMembers = fields.teamMembers.filter((_, idx) => idx !== index);
    updateField("teamMembers", nextMembers.length ? nextMembers : [{ name: "", role: "", email: "", mobile: "" }]);
  };

  const validateCurrentStep = () => {
    const nextErrors: Record<string, string> = {};

    if (step === 0) {
      if (!fields.authorFirstName.trim()) nextErrors.authorFirstName = "First name is required.";
      if (!fields.authorLastName.trim()) nextErrors.authorLastName = "Last name is required.";
      if (!fields.designation.trim()) nextErrors.designation = "Designation is required.";
      if (!fields.mobile.trim()) nextErrors.mobile = "Mobile number is required.";
      if (!fields.email.trim()) nextErrors.email = "Email is required.";
    } else if (step === 1) {
      if (!fields.entityName.trim()) nextErrors.entityName = "Entity name is required.";
      if (!fields.natureOfEntity) nextErrors.natureOfEntity = "Select entity type.";
      if (!fields.incorporationDate) nextErrors.incorporationDate = "Incorporation date is required.";
      if (!fields.panNumber.trim()) nextErrors.panNumber = "PAN number is required.";
      if (!fields.state.trim()) nextErrors.state = "State is required.";
      if (!fields.city.trim()) nextErrors.city = "City is required.";
      if (!fields.address.trim()) nextErrors.address = "Address is required.";
    } else if (step === 2) {
      if (!fields.problemStatement.trim()) nextErrors.problemStatement = "Problem statement is required.";
      if (!fields.valueProposition.trim()) nextErrors.valueProposition = "Value proposition is required.";
      if (!fields.uniqueSellingPoint.trim()) nextErrors.uniqueSellingPoint = "Unique selling point is required.";
      if (!fields.targetCustomer.trim()) nextErrors.targetCustomer = "Target customer is required.";
      if (!fields.marketSize.trim()) nextErrors.marketSize = "Market size is required.";
      if (!fields.scalePlan.trim()) nextErrors.scalePlan = "Scale plan is required.";
      if (!fields.revenueModel.trim()) nextErrors.revenueModel = "Revenue model is required.";
    } else if (step === 3) {
      if (!fields.teamMembers.some((member) => member.name.trim() || member.role.trim() || member.email.trim() || member.mobile.trim())) {
        nextErrors.teamMembers = "Add at least one team member.";
      }
      if (fields.teamMembers.some((member) => !member.name.trim() || !member.role.trim())) {
        nextErrors.teamMembers = "Each team member needs a name and role.";
      }
    } else if (step === 4) {
      if (!fields.raisedFunding) nextErrors.raisedFunding = "Select funding status.";
      if (fields.raisedFunding === "Yes" && !fields.fundingAmount.trim()) nextErrors.fundingAmount = "Funding amount is required.";
      if (fields.raisedFunding === "Yes" && !fields.fundingInstrument) nextErrors.fundingInstrument = "Select funding instrument.";
    } else if (step === 5) {
      if (!fields.incubator1) nextErrors.incubator1 = "Select incubator preference 1.";
      if (!fields.incubator2) nextErrors.incubator2 = "Select incubator preference 2.";
      if (!fields.incubator3) nextErrors.incubator3 = "Select incubator preference 3.";
    } else if (step === 6) {
      if (!pitchDeckFile) nextErrors.pitchDeck = "Upload a pitch deck.";
      if (!fields.declarationAccepted) nextErrors.declarationAccepted = "Declaration is required.";
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
    if (!fields.natureOfEntity) nextErrors.natureOfEntity = "Select entity type.";
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
    if (!pitchDeckFile) nextErrors.pitchDeck = "Upload a pitch deck.";
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-6 sm:px-6 lg:px-8" id="startup-program-application">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col overflow-hidden rounded-[28px] border border-[#E4EAF7] bg-white shadow-[0_24px_60px_rgba(69,84,155,0.14)]">
        <div className="border-b border-[#E4EAF7] bg-[linear-gradient(135deg,rgba(11,42,91,0.98),rgba(43,47,134,0.98))] px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/60">Startup Support</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">{program.name}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-white/75">
                {isViewMode
                  ? "Review the submitted 7-step application. Details are locked for view-only access."
                  : "Complete the 7-step application wizard. The form is full-screen, orange-accented, and saved as a single application on submit."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/60">Current Step</p>
              <p className="mt-1 text-sm font-bold">
                Step {step + 1} / {steps.length}
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-[#E4EAF7] px-5 py-4 sm:px-8">
          <div className="grid gap-4 md:grid-cols-7">
            {steps.map((label, index) => {
              const active = index === step;
              const done = index < step;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(index)}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      done || active ? "border-[#F05A28] bg-[#F05A28] text-white" : "border-[#FDBA74] bg-white text-[#FDBA74]"
                    }`}
                  >
                    {done ? <CircleCheckBig className="h-3 w-3" /> : <Circle className="h-2.5 w-2.5" />}
                  </span>
                  <span className={`text-[11px] font-bold leading-4 ${active ? "text-[#0B2A5B]" : "text-slate-500"}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 px-5 py-6 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
            <aside className="rounded-[24px] border border-[#E8ECF6] bg-[linear-gradient(180deg,#fff_0%,#fff8ef_100%)] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#F05A28]">Step {step + 1}</p>
              <h2 className="mt-2 text-xl font-black text-[#0B2A5B]">{currentTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Follow the section below. You can move back and forth before submitting the final application.
              </p>
              <div className="mt-6 rounded-2xl border border-dashed border-[#FDBA74] bg-white px-4 py-4 text-sm text-slate-600">
                <p className="font-bold text-[#0B2A5B]">Need to leave?</p>
                <p className="mt-1">Your data stays in the form until you submit or refresh the page.</p>
              </div>
            </aside>

            <div className="space-y-6">
              {step === 0 && (
                <StepSection title="Authorized Representative" subtitle="Who is filing this application?">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input label="First Name *" value={fields.authorFirstName} onChange={(value) => updateField("authorFirstName", value)} error={errors.authorFirstName} readOnly={isViewMode} />
                    <Input label="Last Name *" value={fields.authorLastName} onChange={(value) => updateField("authorLastName", value)} error={errors.authorLastName} readOnly={isViewMode} />
                    <Input label="Designation *" value={fields.designation} onChange={(value) => updateField("designation", value)} error={errors.designation} readOnly={isViewMode} />
                    <Input label="Mobile No. *" value={fields.mobile} onChange={(value) => updateField("mobile", value)} error={errors.mobile} readOnly={isViewMode} />
                    <Input label="Email ID *" value={fields.email} onChange={(value) => updateField("email", value)} error={errors.email} className="md:col-span-2" readOnly={isViewMode} />
                  </div>
                </StepSection>
              )}

              {step === 1 && (
                <StepSection title="Entity Details" subtitle="Capture your company identity and registration details.">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input label="DPIIT Recognition Number" value={fields.dpiitNumber} onChange={(value) => updateField("dpiitNumber", value)} readOnly={isViewMode} />
                    <Input label="Name of the Entity *" value={fields.entityName} onChange={(value) => updateField("entityName", value)} error={errors.entityName} readOnly={isViewMode} />
                    <Select label="Nature of Entity *" value={fields.natureOfEntity} onChange={(value) => updateField("natureOfEntity", value)} error={errors.natureOfEntity} options={entityOptions} disabled={isViewMode} />
                    <Input label="Incorporation / Registration Date *" type="date" value={fields.incorporationDate} onChange={(value) => updateField("incorporationDate", value)} error={errors.incorporationDate} readOnly={isViewMode} />
                    <Input label="PAN Number *" value={fields.panNumber} onChange={(value) => updateField("panNumber", value)} error={errors.panNumber} readOnly={isViewMode} />
                    <Input label="State *" value={fields.state} onChange={(value) => updateField("state", value)} error={errors.state} readOnly={isViewMode} />
                    <Input label="City *" value={fields.city} onChange={(value) => updateField("city", value)} error={errors.city} readOnly={isViewMode} />
                    <Input label="Startup Address *" value={fields.address} onChange={(value) => updateField("address", value)} error={errors.address} readOnly={isViewMode} />
                  </div>
                </StepSection>
              )}

              {step === 2 && (
                <StepSection title="Startup Details" subtitle="Summarize what you build, for whom, and why it matters.">
                  <div className="grid gap-5">
                    <Toggle label="Is it a Technology Startup? *" value={fields.technologyStartup} onChange={(value) => updateField("technologyStartup", value)} disabled={isViewMode} />
                    <TextArea label="What is the problem you are solving? *" value={fields.problemStatement} onChange={(value) => updateField("problemStatement", value)} error={errors.problemStatement} readOnly={isViewMode} />
                    <TextArea label="What is your value proposition? *" value={fields.valueProposition} onChange={(value) => updateField("valueProposition", value)} error={errors.valueProposition} readOnly={isViewMode} />
                    <TextArea label="What is your unique selling point? *" value={fields.uniqueSellingPoint} onChange={(value) => updateField("uniqueSellingPoint", value)} error={errors.uniqueSellingPoint} readOnly={isViewMode} />
                    <TextArea label="What is your target customer segment? *" value={fields.targetCustomer} onChange={(value) => updateField("targetCustomer", value)} error={errors.targetCustomer} readOnly={isViewMode} />
                    <Input label="What is the market size of the opportunity? *" value={fields.marketSize} onChange={(value) => updateField("marketSize", value)} error={errors.marketSize} readOnly={isViewMode} />
                    <TextArea label="How do you aim to scale-up? *" value={fields.scalePlan} onChange={(value) => updateField("scalePlan", value)} error={errors.scalePlan} readOnly={isViewMode} />
                    <TextArea label="What will be the revenue model? *" value={fields.revenueModel} onChange={(value) => updateField("revenueModel", value)} error={errors.revenueModel} readOnly={isViewMode} />
                    <Input label="Who are your key competitors?" value={fields.competitors} onChange={(value) => updateField("competitors", value)} readOnly={isViewMode} />
                    <Input label="Website URL (Optional)" value={fields.websiteUrl} onChange={(value) => updateField("websiteUrl", value)} readOnly={isViewMode} />
                  </div>
                </StepSection>
              )}

              {step === 3 && (
                <StepSection title="Startup Team" subtitle="List the core people working on the startup.">
                  <div className="space-y-4">
                    <div className="grid gap-5 md:grid-cols-2">
                      <Input label="Name & Background of the CEO *" value={fields.authorFirstName ? `${fields.authorFirstName} ${fields.authorLastName}`.trim() : ""} onChange={() => {}} readOnly />
                      <Input label="LinkedIn Profile (Optional)" value={fields.linkedInUrl} onChange={(value) => updateField("linkedInUrl", value)} readOnly={isViewMode} />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-[#0B2A5B]">Promoter Details</p>
                          <p className="text-xs text-slate-500">Add at least one promoter or founding member.</p>
                        </div>
                        {!isViewMode && (
                          <button type="button" onClick={addTeamMember} className="rounded-full border border-[#F05A28] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#F05A28]">
                            Add Promoter
                          </button>
                        )}
                      </div>
                      <div className="mt-4 space-y-3">
                        {fields.teamMembers.map((member, index) => (
                          <div key={index} className="grid gap-3 md:grid-cols-[1.2fr_1fr_1.1fr_0.9fr_auto]">
                            <Input label="Name of Promoter" value={member.name} onChange={(value) => updateTeamMember(index, "name", value)} readOnly={isViewMode} />
                            <Input label="Role" value={member.role} onChange={(value) => updateTeamMember(index, "role", value)} readOnly={isViewMode} />
                            <Input label="Email" value={member.email} onChange={(value) => updateTeamMember(index, "email", value)} readOnly={isViewMode} />
                            <Input label="Mobile" value={member.mobile} onChange={(value) => updateTeamMember(index, "mobile", value)} readOnly={isViewMode} />
                            {!isViewMode && (
                              <button type="button" onClick={() => removeTeamMember(index)} className="self-end rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-500">
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <label className="block text-sm font-bold text-[#0B2A5B]">No. of full-time employees *</label>
                        <div className="mt-3 flex items-center gap-3">
                          <button type="button" disabled={isViewMode} onClick={() => updateField("fullTimeEmployees", Math.max(1, fields.fullTimeEmployees - 1))} className="h-8 w-8 rounded-full border border-[#F05A28] text-[#F05A28] disabled:opacity-40">-</button>
                          <span className="min-w-12 rounded-lg bg-slate-100 px-4 py-2 text-center font-bold">{fields.fullTimeEmployees}</span>
                          <button type="button" disabled={isViewMode} onClick={() => updateField("fullTimeEmployees", fields.fullTimeEmployees + 1)} className="h-8 w-8 rounded-full border border-[#F05A28] text-[#F05A28] disabled:opacity-40">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </StepSection>
              )}

              {step === 4 && (
                <StepSection title="Funding Details" subtitle="Share the current capital and funding profile.">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Toggle label="Have you cumulatively received more than ₹10 lakhs? *" value={fields.raisedFunding} onChange={(value) => updateField("raisedFunding", value)} disabled={isViewMode} />
                    <Input label="Current Funding Requirement" value={fields.fundingAmount} onChange={(value) => updateField("fundingAmount", value)} error={errors.fundingAmount} readOnly={isViewMode} />
                    <Select label="Funding Instrument" value={fields.fundingInstrument} onChange={(value) => updateField("fundingInstrument", value)} error={errors.fundingInstrument} options={fundingInstrumentOptions} disabled={isViewMode} />
                    <Input label="Your current revenue / traction note" value={fields.revenueModel} onChange={(value) => updateField("revenueModel", value)} readOnly={isViewMode} />
                  </div>
                </StepSection>
              )}

              {step === 5 && (
                <StepSection title="Incubator Preference" subtitle="Choose your preferred incubators in order.">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm leading-7 text-slate-700">
                      Please note that once your application is submitted, you cannot modify incubator preferences, or the amount and instrument of funding requested.
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-3">
                    <Select
                      label="Incubator Preference #1 *"
                      value={fields.incubator1}
                      onChange={(value) => setIncubatorPreference(1, value)}
                      error={errors.incubator1}
                      options={incubatorChoices(1)}
                      disabled={isViewMode}
                    />
                    <Select
                      label="Incubator Preference #2 *"
                      value={fields.incubator2}
                      onChange={(value) => setIncubatorPreference(2, value)}
                      error={errors.incubator2}
                      options={incubatorChoices(2)}
                      disabled={isViewMode}
                    />
                    <Select
                      label="Incubator Preference #3 *"
                      value={fields.incubator3}
                      onChange={(value) => setIncubatorPreference(3, value)}
                      error={errors.incubator3}
                      options={incubatorChoices(3)}
                      disabled={isViewMode}
                    />
                  </div>
                </StepSection>
              )}

              {step === 6 && (
                <StepSection title="Upload Documents" subtitle="Final attachments before submit.">
                  <div className="grid gap-6">
                    <FileUpload
                      label="Upload Pitch Deck of your Business Idea *"
                      file={pitchDeckFile}
                      fileName={fields.pitchDeckName}
                      onFile={handleFile}
                      kind="pitch"
                      helper="Supported format - PDF only | Max size: 15 MB"
                      sampleText="Download Sample Pitch Deck"
                      disabled={isViewMode}
                    />
                    <Input label="Video URL showcasing your product and/or business model (Optional)" value={fields.videoUrl} onChange={(value) => updateField("videoUrl", value)} readOnly={isViewMode} />
                    <FileUpload
                      label="Upload any other relevant document (Optional)"
                      file={otherFile}
                      fileName={fields.otherDocumentName}
                      onFile={handleFile}
                      kind="other"
                      helper="Supported format - PDF only | Max size: 15 MB"
                      disabled={isViewMode}
                    />
                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                      <input
                        type="checkbox"
                        checked={fields.declarationAccepted}
                        onChange={(e) => updateField("declarationAccepted", e.target.checked)}
                        disabled={isViewMode}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#F05A28]"
                      />
                      <span>
                        We are in compliance with the provisions of the various Acts, Rules, Regulations, Guidelines, Standards applicable to the entity from time to time. All information provided by us is true, correct and complete.
                      </span>
                    </label>
                  </div>
                </StepSection>
              )}

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
                <button type="button" onClick={onCancel} className="rounded-full border border-[#0B2A5B] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#0B2A5B]">
                  {isViewMode ? "Close" : "Cancel"}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={step === 0}
                    className="rounded-full border border-[#0B2A5B]/20 px-5 py-3 text-xs font-black uppercase tracking-wider text-[#0B2A5B] disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {step < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-full bg-[#F05A28] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_16px_30px_rgba(240,90,40,0.22)]"
                    >
                      {isViewMode ? "Next" : "Save and Next"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : isViewMode ? null : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-full bg-[#F05A28] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_16px_30px_rgba(240,90,40,0.22)] disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
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
  <section className="rounded-[24px] border border-[#E8ECF6] bg-white p-5 shadow-sm">
    <div className="border-b border-slate-100 pb-4">
      <h2 className="text-lg font-black text-[#0B2A5B]">{title}</h2>
      <p className="mt-1 text-sm leading-7 text-slate-500">{subtitle}</p>
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

const Input: React.FC<{
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  className?: string;
  readOnly?: boolean;
}> = ({ label, value, onChange, error, type = "text", className = "", readOnly = false }) => (
  <label className={`block space-y-1.5 ${className}`}>
    <span className="block text-sm font-bold text-[#0B2A5B]">{label}</span>
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      aria-readonly={readOnly}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
        error ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-[#F05A28]"
      } ${readOnly ? "bg-slate-100" : "bg-white"}`}
    />
    {error && <p className="text-xs font-bold text-red-500">{error}</p>}
  </label>
);

const TextArea: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  readOnly?: boolean;
}> = ({ label, value, onChange, error, readOnly = false }) => (
  <label className="block space-y-1.5">
    <span className="block text-sm font-bold text-[#0B2A5B]">{label}</span>
    <textarea
      rows={4}
      value={value}
      readOnly={readOnly}
      aria-readonly={readOnly}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
        error ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-[#F05A28]"
      } ${readOnly ? "bg-slate-100" : "bg-white"}`}
    />
    {error && <p className="text-xs font-bold text-red-500">{error}</p>}
  </label>
);

const Select: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  disabled?: boolean;
}> = ({ label, value, onChange, options, error, disabled = false }) => (
  <label className="block space-y-1.5">
    <span className="block text-sm font-bold text-[#0B2A5B]">{label}</span>
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
        error ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-[#F05A28]"
      } ${disabled ? "cursor-not-allowed bg-slate-100 text-slate-600" : ""}`}
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && <p className="text-xs font-bold text-red-500">{error}</p>}
  </label>
);

const Toggle: React.FC<{
  label: string;
  value: string;
  onChange: (value: "Yes" | "No") => void;
  disabled?: boolean;
}> = ({ label, value, onChange, disabled = false }) => (
  <div className="space-y-2">
    <span className="block text-sm font-bold text-[#0B2A5B]">{label}</span>
    <div className="inline-flex rounded-full border border-[#FDBA74] bg-[#FFF4EA] p-1">
      {(["Yes", "No"] as const).map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option)}
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
            value === option ? "bg-[#F05A28] text-white" : "text-slate-500"
          } ${disabled ? "cursor-not-allowed" : ""}`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
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
}> = ({ label, helper, sampleText, file, fileName, kind, onFile, disabled = false }) => (
  <div className="space-y-2">
    <div className="flex flex-wrap items-center gap-3">
      <label className="block text-sm font-bold text-[#0B2A5B]">{label}</label>
      {sampleText && <span className="text-xs font-semibold text-[#F05A28] underline">{sampleText}</span>}
    </div>
    <div className="rounded-2xl border-2 border-dashed border-[#FDBA74] bg-[#FFF8F0] p-5 text-center">
      <input
        type="file"
        className="hidden"
        id={`${kind}-file-input`}
        disabled={disabled}
        onChange={(event) => onFile(event.target.files?.[0] || null, kind)}
        accept=".pdf,.ppt,.pptx"
      />
      <label htmlFor={`${kind}-file-input`} className={`inline-flex items-center gap-2 rounded-full border border-[#F05A28] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#F05A28] ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
        <UploadCloud className="h-4 w-4" />
        Upload
      </label>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
      {(file || fileName) && <p className="mt-2 text-xs font-bold text-[#FF6B00]">Selected: {file?.name || fileName}</p>}
    </div>
  </div>
);
