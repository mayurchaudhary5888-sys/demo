import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../../context/AppContext";
import type { Program } from "../../../../types";
import { ApplicationSuccessModal } from "../../../../components/common/ApplicationSuccessModal";
import { FileText } from "lucide-react";
import { downloadStoredFile } from "../../../../utils/documentStorage";

type FoundationProgramProps = {
  program: Program;
  onCancel: () => void;
  application?: any;
  mode?: "edit" | "view";
};

type FoundationFields = {
  supportType: string;
  supportTypeOther?: string;
  focusArea: string;
  focusAreaOther?: string;
  applicantName: string;
  designation: string;
  email: string;
  phone: string;
  organisationName: string;
  establishmentYear: string;
  innovationArea: string;
  innovationAreaOther?: string;
  users: string[];
  beneficiaries: string[];
  impactApproach: string;
  totalRegisteredUsers: string;
  currentPricePoint: string;
  totalPaidUsers: string;
  monthlyActiveUsers: string;
  userRetentionRate: string;
  evidenceOfImpact: string;
  consentAccepted: boolean;
};

const supportTypeOptions = ["Foundation Support", "CSR Support"];
const focusAreaOptions = ["Women-led impact", "Climate and sustainability", "Healthcare access", "Education and skilling", "Livelihoods", "Financial inclusion", "Other"];
const innovationAreaOptions = ["Technology platform", "Product innovation", "Service model", "Community program", "Research-backed intervention", "Other"];
const userOptions = ["Working women", "Students", "Entrepreneurs", "Rural users", "Urban users", "Small businesses", "Communities", "Other"];
const beneficiaryOptions = ["Women", "Youth", "Children", "Farmers", "MSMEs", "Low-income communities", "Persons with disabilities", "Other"];

const initialFields = (user?: { name?: string; email?: string }, startupName = ""): FoundationFields => ({
  supportType: "",
  supportTypeOther: "",
  focusArea: "",
  focusAreaOther: "",
  applicantName: user?.name || "",
  designation: "",
  email: user?.email || "",
  phone: "",
  organisationName: startupName,
  establishmentYear: "",
  innovationArea: "",
  innovationAreaOther: "",
  users: [],
  beneficiaries: [],
  impactApproach: "",
  totalRegisteredUsers: "",
  currentPricePoint: "",
  totalPaidUsers: "",
  monthlyActiveUsers: "",
  userRetentionRate: "",
  evidenceOfImpact: "",
  consentAccepted: true,
});

export const FoundationProgram: React.FC<FoundationProgramProps> = ({ program, onCancel, application, mode }) => {
  const { user, startups, applyToProgram, showToast } = useAppState();
  const navigate = useNavigate();
  const userStartup = startups.find((startup) => startup.id === user?.startupId);
  const [fields, setFields] = useState<FoundationFields>(() => initialFields(user || undefined, userStartup?.name || ""));
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successApplication, setSuccessApplication] = useState<{ id: string; programName: string } | null>(null);
  useEffect(() => {
    if (mode === "view" && application) {
      setFields({
        supportType: application.supportType || "",
        supportTypeOther: application.supportTypeOther || "",
        focusArea: application.focusArea || "",
        focusAreaOther: application.focusAreaOther || "",
        applicantName: application.applicantName || "",
        designation: application.designation || "",
        email: application.email || "",
        phone: application.phone || "",
        organisationName: application.organisationName || "",
        establishmentYear: application.establishmentYear || "",
        innovationArea: application.innovationArea || "",
        innovationAreaOther: application.innovationAreaOther || "",
        users: application.users || [],
        beneficiaries: application.beneficiaries || [],
        impactApproach: application.impactApproach || "",
        totalRegisteredUsers: application.totalRegisteredUsers || "",
        currentPricePoint: application.currentPricePoint || "",
        totalPaidUsers: application.totalPaidUsers || "",
        monthlyActiveUsers: application.monthlyActiveUsers || "",
        userRetentionRate: application.userRetentionRate || "",
        evidenceOfImpact: application.evidenceOfImpact || "",
        consentAccepted: application.consentAccepted || false,
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

  const updateField = <K extends keyof FoundationFields>(field: K, value: FoundationFields[K]) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleMultiValue = (field: "users" | "beneficiaries", value: string) => {
    const nextValues = fields[field].includes(value)
      ? fields[field].filter((item) => item !== value)
      : [...fields[field], value];
    updateField(field, nextValues);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    
    if (!fields.supportType) {
      nextErrors.supportType = "Select the type of support.";
    }

    if (!fields.focusArea) {
      nextErrors.focusArea = "Select a program focus area.";
    } else if (fields.focusArea === "Other" && !fields.focusAreaOther?.trim()) {
      nextErrors.focusAreaOther = "Please specify the focus area.";
    }

    if (!fields.applicantName.trim()) nextErrors.applicantName = "Your name is required.";
    if (!fields.designation.trim()) nextErrors.designation = "Designation is required.";
    if (!fields.email.trim()) nextErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(fields.email)) nextErrors.email = "Enter a valid email.";
    if (!fields.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!fields.organisationName.trim()) nextErrors.organisationName = "Organisation name is required.";
    if (!fields.establishmentYear.trim()) nextErrors.establishmentYear = "Year of establishment is required.";
    if (!pitchDeck) nextErrors.pitchDeck = "Upload a detailed project pitch deck.";
    
    if (!fields.innovationArea) {
      nextErrors.innovationArea = "Select area of foundation.";
    } else if (fields.innovationArea === "Other" && !fields.innovationAreaOther?.trim()) {
      nextErrors.innovationAreaOther = "Please specify the area of foundation.";
    }

    if (!fields.users.length) nextErrors.users = "Select at least one user group.";
    if (!fields.beneficiaries.length) nextErrors.beneficiaries = "Select at least one beneficiary group.";
    if (!fields.impactApproach.trim()) nextErrors.impactApproach = "Impact approach is required.";
    if (!fields.consentAccepted) nextErrors.consentAccepted = "Consent is required.";

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
      showToast("Please complete all required Foundation / CSR Support fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const created = await applyToProgram({
        ...fields,
        supportType: fields.supportType === "Other" ? fields.supportTypeOther : fields.supportType,
        focusArea: fields.focusArea === "Other" ? fields.focusAreaOther : fields.focusArea,
        innovationArea: fields.innovationArea === "Other" ? fields.innovationAreaOther : fields.innovationArea,
        programId: program.id,
        programName: program.name,
        startupId: user?.startupId || "",
        startupName: fields.organisationName,
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
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" id="foundation-application-form">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-8 md:px-8">
          <h3 className="text-2xl font-black tracking-tight text-[#0B2A5B]">Apply for Foundation / CSR Support</h3>
          <h4 className="mt-3 text-base font-extrabold text-slate-900">First step to getting started</h4>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
            Share your organisation, solution, users, and impact metrics in one form so the Foundation / CSR Support team can review your readiness and support fit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6 text-sm text-slate-800 md:p-8">
          <SelectField
            label="Which type of support would you like to apply for? *"
            value={fields.supportType}
            error={errors.supportType}
            options={supportTypeOptions}
            onChange={(value) => updateField("supportType", value)}
          />

          <SelectField label="Which program focus area does your solution match with? *" value={fields.focusArea} error={errors.focusArea} options={focusAreaOptions} onChange={(value) => {
            updateField("focusArea", value);
            if (value !== "Other") {
              updateField("focusAreaOther", "");
            }
          }} />
          {fields.focusArea === "Other" && (
            <TextField
              label="Please specify program focus area *"
              value={fields.focusAreaOther || ""}
              error={errors.focusAreaOther}
              placeholder="Specify focus area"
              onChange={(value) => updateField("focusAreaOther", value)}
            />
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TextField label="Your name *" value={fields.applicantName} error={errors.applicantName} placeholder="Your Name" onChange={(value) => updateField("applicantName", value)} />
            <TextField label="Designation *" value={fields.designation} error={errors.designation} placeholder="Designation" onChange={(value) => updateField("designation", value)} />
            <TextField label="Email *" type="email" value={fields.email} error={errors.email} placeholder="Email ID" onChange={(value) => updateField("email", value)} />
            <TextField label="Phone *" type="tel" value={fields.phone} error={errors.phone} placeholder="Phone Number" onChange={(value) => updateField("phone", value)} />
            <TextField label="Organisation's name *" value={fields.organisationName} error={errors.organisationName} placeholder="Organisation's Name" onChange={(value) => updateField("organisationName", value)} />
            <TextField label="Year of establishment *" value={fields.establishmentYear} error={errors.establishmentYear} placeholder="Year Of Establishment" onChange={(value) => updateField("establishmentYear", value)} />
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-[#0B2A5B]">{renderLabel("Please upload a detailed project pitch deck here *")}</label>
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
                <input type="file" onChange={handleFileChange} accept=".pdf,.ppt,.pptx" className="block w-full rounded-lg border border-slate-300 p-3 text-sm" />
                {pitchDeck && <p className="text-xs font-bold text-[#FF6B00]">Selected: {pitchDeck.name}</p>}
              </>
            )}
            {errors.pitchDeck && <p className="text-xs font-bold text-red-500">{errors.pitchDeck}</p>}
          </div>

          <SelectField label="Area of foundation *" value={fields.innovationArea} error={errors.innovationArea} options={innovationAreaOptions} onChange={(value) => {
            updateField("innovationArea", value);
            if (value !== "Other") {
              updateField("innovationAreaOther", "");
            }
          }} />
          {fields.innovationArea === "Other" && (
            <TextField
              label="Please specify area of foundation *"
              value={fields.innovationAreaOther || ""}
              error={errors.innovationAreaOther}
              placeholder="Specify area of foundation"
              onChange={(value) => updateField("innovationAreaOther", value)}
            />
          )}

          <CheckboxGroup label="Users (check all that apply) *" values={fields.users} error={errors.users} options={userOptions} onChange={(value) => toggleMultiValue("users", value)} />
          <CheckboxGroup label="End beneficiaries (check all that apply) *" values={fields.beneficiaries} error={errors.beneficiaries} options={beneficiaryOptions} onChange={(value) => toggleMultiValue("beneficiaries", value)} />

          <TextAreaField
            label="How does your solution leverage technology or innovation to create measurable impact? *"
            value={fields.impactApproach}
            error={errors.impactApproach}
            onChange={(value) => updateField("impactApproach", value)}
          />

          <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div>
              <h4 className="text-base font-black text-[#0B2A5B]">Current scale and impact</h4>
              <p className="mt-1 text-xs font-semibold text-slate-500">Share current traction metrics and evidence for the solution.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TextField label="Total registered users" value={fields.totalRegisteredUsers} error={errors.totalRegisteredUsers} onChange={(value) => updateField("totalRegisteredUsers", value)} />
              <TextField label="Current price point" value={fields.currentPricePoint} error={errors.currentPricePoint} onChange={(value) => updateField("currentPricePoint", value)} />
              <TextField label="Total paid users" value={fields.totalPaidUsers} error={errors.totalPaidUsers} onChange={(value) => updateField("totalPaidUsers", value)} />
              <TextField label="Monthly active users" value={fields.monthlyActiveUsers} error={errors.monthlyActiveUsers} onChange={(value) => updateField("monthlyActiveUsers", value)} />
              <TextField label="User retention rate" value={fields.userRetentionRate} error={errors.userRetentionRate} onChange={(value) => updateField("userRetentionRate", value)} />
              <TextField label="Evidence of impact" value={fields.evidenceOfImpact} error={errors.evidenceOfImpact} onChange={(value) => updateField("evidenceOfImpact", value)} />
            </div>
          </section>

          <div className="space-y-2 border-t border-slate-200 pt-6">
            <label className="flex items-start gap-3 font-semibold text-slate-700">
              <input type="checkbox" disabled={mode === "view"} checked={fields.consentAccepted} onChange={(event) => updateField("consentAccepted", event.target.checked)} className="mt-1" />
              <span>By sharing your details, you agree to receive application updates by email, WhatsApp, and mobile.</span>
            </label>
            {errors.consentAccepted && <p className="text-xs font-bold text-red-500">{errors.consentAccepted}</p>}
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
        className={`w-full rounded-lg border bg-white p-3 outline-none ${
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
        rows={5}
        value={value}
        disabled={contextDisabled}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-white p-3 outline-none ${
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
        <option value="">Choose an option</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};

const CheckboxGroup: React.FC<{
  label: string;
  values: string[];
  error?: string;
  options: string[];
  onChange: (value: string) => void;
}> = ({ label, values, error, options, onChange }) => {
  const { disabled: contextDisabled } = React.useContext(FormModeContext);
  return (
    <fieldset className="space-y-3">
      <legend className="font-bold text-[#0B2A5B]">{renderLabel(label)}</legend>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <label key={option} className={`flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 font-semibold ${
            contextDisabled ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
          }`}>
            <input type="checkbox" checked={values.includes(option)} disabled={contextDisabled} onChange={() => onChange(option)} />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </fieldset>
  );
};
