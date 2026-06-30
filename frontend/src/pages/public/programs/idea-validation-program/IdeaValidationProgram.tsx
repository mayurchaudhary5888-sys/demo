import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../../context/AppContext";
import type { Program } from "../../../../types";
import { ApplicationSuccessModal } from "../../../../components/common/ApplicationSuccessModal";
import { FileText } from "lucide-react";
import { downloadStoredFile } from "../../../../utils/documentStorage";

type IdeaValidationProgramProps = {
  program: Program;
  onCancel: () => void;
  application?: any;
  mode?: "edit" | "view";
};

type IdeaValidationFields = {
  applicantName: string;
  email: string;
  mobile: string;
  residenceCity: string;
  residenceState: string;
  ideaName: string;
  problemStatement: string;
  startupDescription: string;
  sector: string;
  sectorOther: string;
  entityType: string;
  startupStage: string;
  revenue: string;
  priorIncubatorSupport: string;
  termsAccepted: boolean;
};

const initialFields = (user?: { name?: string; email?: string }, startupName = ""): IdeaValidationFields => ({
  applicantName: user?.name || "",
  email: user?.email || "",
  mobile: "",
  residenceCity: "",
  residenceState: "",
  ideaName: startupName,
  problemStatement: "",
  startupDescription: "",
  sector: "",
  sectorOther: "",
  entityType: "",
  startupStage: "",
  revenue: "",
  priorIncubatorSupport: "",
  termsAccepted: false,
});

const stateOptions = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];
const sectorOptions = ["Agriculture", "Healthcare", "Education", "FinTech", "CleanTech", "DeepTech", "Manufacturing", "Consumer", "SaaS", "Other"];
const entityOptions = ["Proprietorship", "Partnership", "LLP", "Private Limited", "Non-profit", "Not Registered"];
const stageOptions = [
  "I just have an idea",
  "I have worked towards my idea and have created a proof of its concept (PoC)",
  "I have created a minimum viable product (MVP) and I am ready for a pilot testing (or have started working on pilot)",
  "My startup idea is generating business and is already in market",
  "My startup idea has been in business for some time and we are ready for scaling this rapidly",
];

export const IdeaValidationProgram: React.FC<IdeaValidationProgramProps> = ({ program, onCancel, application, mode }) => {
  const { user, startups, applyToProgram, showToast } = useAppState();
  const navigate = useNavigate();
  const userStartup = startups.find((startup) => startup.id === user?.startupId);
  const [fields, setFields] = useState<IdeaValidationFields>(() => initialFields(user || undefined, userStartup?.name || ""));
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successApplication, setSuccessApplication] = useState<{ id: string; programName: string } | null>(null);

  useEffect(() => {
    if (mode === "view" && application) {
      setFields({
        applicantName: application.applicantName || "",
        email: application.email || "",
        mobile: application.mobile || "",
        residenceCity: application.residenceCity || "",
        residenceState: application.residenceState || application.residenceCity || "",
        ideaName: application.ideaName || "",
        problemStatement: application.problemStatement || "",
        startupDescription: application.startupDescription || "",
        sector: application.sector || "",
        sectorOther: application.sectorOther || "",
        entityType: application.entityType || "",
        startupStage: application.startupStage || "",
        revenue: application.revenue || "",
        priorIncubatorSupport: application.priorIncubatorSupport || "",
        termsAccepted: application.termsAccepted || false,
      });
    }
  }, [mode, application]);

  const handleDownloadFile = (fieldKey: string, filename: string) => {
    const success = downloadStoredFile(application.id || application._id, fieldKey, filename);
    if (!success) {
      showToast(`Simulated download of ${filename}`, "info");
    } else {
      showToast(`Downloading ${filename}`, "success");
    }
  };

  const updateField = <K extends keyof IdeaValidationFields>(field: K, value: IdeaValidationFields[K]) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!fields.applicantName.trim()) nextErrors.applicantName = "Your name is required.";
    if (!fields.email.trim()) nextErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(fields.email)) nextErrors.email = "Enter a valid email.";
    if (!fields.mobile.trim()) nextErrors.mobile = "Mobile number is required.";
    if (!fields.residenceState) nextErrors.residenceState = "Select state of present residence.";
    if (!fields.ideaName.trim()) nextErrors.ideaName = "Startup / idea name is required.";
    if (!fields.problemStatement.trim()) nextErrors.problemStatement = "Problem statement is required.";
    if (!fields.startupDescription.trim()) nextErrors.startupDescription = "Brief startup description is required.";
    
    if (!fields.sector) {
      nextErrors.sector = "Select startup sector.";
    } else if (fields.sector === "Other" && !fields.sectorOther?.trim()) {
      nextErrors.sectorOther = "Please specify the startup sector.";
    }

    if (!fields.entityType) nextErrors.entityType = "Select registration/entity status.";
    if (!fields.startupStage) nextErrors.startupStage = "Select startup stage.";
    if (!fields.revenue.trim()) nextErrors.revenue = "Revenue details are required.";
    if (!fields.priorIncubatorSupport) nextErrors.priorIncubatorSupport = "Select incubator support status.";
    if (!pitchDeck) nextErrors.pitchDeck = "Upload a pitch deck or presentation.";
    if (!fields.termsAccepted) nextErrors.termsAccepted = "Accept the terms and conditions.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("Maximum document upload size is 10MB.", "error");
      return;
    }
    setPitchDeck(file);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.pitchDeck;
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      showToast("Please complete all required Idea Validation Support fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const created = await applyToProgram({
        ...fields,
        residenceCity: fields.residenceState,
        sector: fields.sector === "Other" ? fields.sectorOther : fields.sector,
        programId: program.id,
        programName: program.name,
        startupId: user?.startupId || "",
        startupName: fields.ideaName,
        pitchDeckName: pitchDeck?.name || "PitchDeck.pdf",
        _pitchDeckFile: pitchDeck,
      });
      setSuccessApplication({ id: created.id, programName: created.programName || program.name });
      setSuccessModalOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    setSuccessModalOpen(false);
    navigate("/startup/dashboard");
  };

  return (
    <FormModeContext.Provider value={{ disabled: mode === "view" }}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" id="idea-validation-application-form">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-8 md:px-8">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#FF6B00]">Idea Validation Support</p>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-[#0B2A5B]">Apply for Idea Validation Support</h3>
          <h4 className="mt-3 text-base font-extrabold text-slate-900">First Step to Getting Started</h4>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
            Welcome to your first step towards getting idea validation and incubation support. We know you are working hard on your startup, and we will be glad if this program can be a part of your success story.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6 text-sm text-slate-800 md:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TextField label="Your Name *" value={fields.applicantName} error={errors.applicantName} placeholder="Full Name" onChange={(value) => updateField("applicantName", value)} />
            <TextField label="Email *" type="email" value={fields.email} error={errors.email} placeholder="Email" onChange={(value) => updateField("email", value)} />
            <TextField label="Mobile *" type="tel" value={fields.mobile} error={errors.mobile} placeholder="Mobile" onChange={(value) => updateField("mobile", value)} />
            <SelectField label="State of Present Residence *" value={fields.residenceState} error={errors.residenceState} options={stateOptions} onChange={(value) => {
              updateField("residenceState", value);
              updateField("residenceCity", value);
            }} />
          </div>

          <TextField label="Startup Name / Idea Name *" value={fields.ideaName} error={errors.ideaName} onChange={(value) => updateField("ideaName", value)} />
          <TextAreaField label="What problem are you solving? *" value={fields.problemStatement} error={errors.problemStatement} onChange={(value) => updateField("problemStatement", value)} />
          <TextAreaField label="Brief Description of your Startup *" value={fields.startupDescription} error={errors.startupDescription} onChange={(value) => updateField("startupDescription", value)} />
          <SelectField label="Which sector best suits your startup? *" value={fields.sector} error={errors.sector} options={sectorOptions} onChange={(value) => {
            updateField("sector", value);
            if (value !== "Other") {
              updateField("sectorOther", "");
            }
          }} />
          {fields.sector === "Other" && (
            <TextField
              label="Please specify sector *"
              value={fields.sectorOther || ""}
              error={errors.sectorOther}
              placeholder="Specify sector"
              onChange={(value) => updateField("sectorOther", value)}
            />
          )}

          <RadioGroup label="Have you registered a company/entity for your startup? *" name="entityType" value={fields.entityType} error={errors.entityType} options={entityOptions} onChange={(value) => updateField("entityType", value)} columns />
          <RadioGroup label="Stage of the startup? *" name="startupStage" value={fields.startupStage} error={errors.startupStage} options={stageOptions} onChange={(value) => updateField("startupStage", value)} />

          <TextField
            label="If you have made any revenue, please mention the revenue for the past 6/12 months? *"
            value={fields.revenue}
            error={errors.revenue}
            onChange={(value) => updateField("revenue", value)}
          />

          <RadioGroup
            label="Has your idea been supported by any incubator in the past? *"
            name="priorIncubatorSupport"
            value={fields.priorIncubatorSupport}
            error={errors.priorIncubatorSupport}
            options={["Yes", "No"]}
            onChange={(value) => updateField("priorIncubatorSupport", value)}
            inline
          />

          <div className="space-y-2">
            <label className="block font-bold text-[#0B2A5B]">
              {renderLabel("Attach a pitch deck or presentation, if you already have one (only pdf / pptx files, please) *")}
            </label>
            {mode === "view" ? (
              <div 
                onClick={() => handleDownloadFile("pitchDeck", application?.pitchDeckName || "PitchDeck.pdf")}
                className="flex flex-col items-center justify-center border-2 border-slate-200 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100 cursor-pointer shadow-xs max-w-md"
              >
                <FileText className="h-8 w-8 text-[#FF6B00]" />
                <span className="mt-2 text-xs font-bold text-slate-600 text-center truncate w-full">
                  {application?.pitchDeckName || "PitchDeck.pdf"}
                </span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Click to Download</span>
              </div>
            ) : (
              <>
                <input type="file" onChange={handleFileChange} accept=".pdf,.pptx" className="block w-full rounded-lg border border-slate-300 p-3 text-sm" />
                {pitchDeck && <p className="text-xs font-bold text-[#FF6B00]">Selected: {pitchDeck.name}</p>}
              </>
            )}
            {errors.pitchDeck && <p className="text-xs font-bold text-red-500">{errors.pitchDeck}</p>}
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-6">
            <label className="flex items-start gap-3 font-semibold text-slate-700">
              <input type="checkbox" disabled={mode === "view"} checked={fields.termsAccepted} onChange={(event) => updateField("termsAccepted", event.target.checked)} className="mt-1" />
              <span>I accept the terms and condition as a founder of the above mentioned startup.</span>
            </label>
            {errors.termsAccepted && <p className="text-xs font-bold text-red-500">{errors.termsAccepted}</p>}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            {mode === "view" ? (
              <button type="button" onClick={onCancel} className="rounded-lg border border-[#0B2A5B] bg-white px-8 py-3 font-bold text-[#0B2A5B] transition-colors hover:bg-slate-50">
                Go Back
              </button>
            ) : (
              <>
                <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 bg-slate-50 px-6 py-3 font-bold text-[#0B2A5B] transition-colors hover:bg-slate-100">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#FF6B00] px-8 py-3 font-extrabold uppercase tracking-widest text-white shadow transition-all hover:bg-[#E65F00] disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </>
            )}
          </div>
        </form>
        <ApplicationSuccessModal
          open={successModalOpen}
          applicationId={successApplication?.id}
          programName={successApplication?.programName}
          onClose={() => setSuccessModalOpen(false)}
          onContinue={handleContinue}
        />
      </div>
    </FormModeContext.Provider>
  );
};

const FormModeContext = React.createContext({ disabled: false });

const renderLabel = (label: string) => {
  if (label.endsWith(" *")) {
    return (
      <>
        {label.slice(0, -2)}{" "}
        <span className="text-red-500">*</span>
      </>
    );
  }
  if (label.endsWith("*")) {
    return (
      <>
        {label.slice(0, -1)}
        <span className="text-red-500">*</span>
      </>
    );
  }
  return label;
};

type BaseFieldProps = {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

const TextField: React.FC<BaseFieldProps & { type?: string; placeholder?: string }> = ({ label, value, error, onChange, type = "text", placeholder }) => {
  const { disabled: contextDisabled } = React.useContext(FormModeContext);
  return (
    <div className="space-y-1.5">
      <label className="block font-bold text-[#0B2A5B]">{renderLabel(label)}</label>
      <input
        type={type}
        value={value}
        disabled={contextDisabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border p-3 outline-none ${
          contextDisabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
        } ${error ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-[#0B2A5B]"}`}
      />
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};

const TextAreaField: React.FC<BaseFieldProps> = ({ label, value, error, onChange }) => {
  const { disabled: contextDisabled } = React.useContext(FormModeContext);
  return (
    <div className="space-y-1.5">
      <label className="block font-bold text-[#0B2A5B]">{renderLabel(label)}</label>
      <textarea
        rows={7}
        value={value}
        disabled={contextDisabled}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border p-3 outline-none ${
          contextDisabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
        } ${error ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-[#0B2A5B]"}`}
      />
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};

const SelectField: React.FC<BaseFieldProps & { options: string[] }> = ({ label, value, error, options, onChange }) => {
  const { disabled: contextDisabled } = React.useContext(FormModeContext);
  return (
    <div className="space-y-1.5">
      <label className="block font-bold text-[#0B2A5B]">{renderLabel(label)}</label>
      <select
        value={value}
        disabled={contextDisabled}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-white p-3 outline-none ${
          contextDisabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
        } ${error ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-[#0B2A5B]"}`}
      >
        <option value="">--Select--</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};

const RadioGroup: React.FC<BaseFieldProps & { name: string; options: string[]; columns?: boolean; inline?: boolean }> = ({
  label,
  name,
  value,
  error,
  options,
  columns = false,
  inline = false,
  onChange,
}) => {
  const { disabled: contextDisabled } = React.useContext(FormModeContext);
  return (
    <fieldset className="space-y-3">
      <legend className="font-bold text-[#0B2A5B]">{renderLabel(label)}</legend>
      <div className={inline ? "flex gap-8" : columns ? "grid gap-3 sm:grid-cols-2" : "space-y-3"}>
        {options.map((option) => (
          <label key={option} className={`${inline ? "flex items-center gap-3" : "flex items-start gap-3 rounded-lg border border-slate-200 p-3"} font-semibold ${contextDisabled ? "opacity-75 cursor-not-allowed" : ""}`}>
            <input type="radio" name={name} value={option} checked={value === option} disabled={contextDisabled} onChange={(event) => onChange(event.target.value)} className={inline ? "" : "mt-1"} />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </fieldset>
  );
};
