import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../../context/AppContext";
import type { Program } from "../../../../types";
import { ApplicationSuccessModal } from "../../../../components/common/ApplicationSuccessModal";
import { UploadCloud, CheckCircle2, ShieldAlert, FileText } from "lucide-react";
import { downloadStoredFile } from "../../../../utils/documentStorage";

type MsmeProgramApplicationProps = {
  program: Program;
  onCancel: () => void;
  application?: any;
  mode?: "edit" | "view";
};

type MsmeFormFields = {
  name: string;
  email: string;
  mobile: string;
  permanentAddress: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  gender: string;
  dateOfBirth: string;
  employmentStatus: string;
  currentCompany: string;
  highestEducation: string;
  heardFrom: string;
  familyIncome: string;
  linkedInUrl: string;

  registeredCompany: string;
  companyName: string;
  incorporationDate: string;
  companyState: string;
  companyCity: string;
  dpiitAvailable: string;
  website: string;

  projectName: string;
  applicationVertical: string;
  technologyUsed: string;
  productLevel: string;
  painPoint: string;
  productDescription: string;
  innovationDetails: string;
  ipFiled: string;
  videoLink: string;
  supportRequired: string;
  programsApplied: string[];
  requestedFunding: string;
};

const initialFields = (user?: { name?: string; email?: string }): MsmeFormFields => ({
  name: user?.name || "",
  email: user?.email || "",
  mobile: "",
  permanentAddress: "",
  country: "India",
  state: "",
  city: "",
  pinCode: "",
  gender: "",
  dateOfBirth: "",
  employmentStatus: "",
  currentCompany: "",
  highestEducation: "",
  heardFrom: "",
  familyIncome: "",
  linkedInUrl: "",

  registeredCompany: "",
  companyName: "",
  incorporationDate: "",
  companyState: "",
  companyCity: "",
  dpiitAvailable: "",
  website: "",

  projectName: "",
  applicationVertical: "",
  technologyUsed: "",
  productLevel: "",
  painPoint: "",
  productDescription: "",
  innovationDetails: "",
  ipFiled: "",
  videoLink: "",
  supportRequired: "",
  programsApplied: [],
  requestedFunding: "",
});

const stateOptions = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Other"
];

const genderOptions = ["Male", "Female", "Other"];
const employmentOptions = ["Self Employed", "Employed", "Student", "Out of work", "Other"];
const educationOptions = ["High School/Graduate", "Post Graduate", "Bachelor’s Degree", "Master’s Degree", "Doctorate Degree", "Other"];
const heardFromOptions = ["iCreate Website", "LinkedIn", "Instagram", "Facebook", "Twitter", "Word of mouth", "College or Institution", "Open Pitch", "Email", "Other"];
const incomeOptions = ["Less than 5 lakhs", "More than 5 lakhs", "More than 10 lakhs", "More than 1cr", "Other"];

const verticalOptions = [
  "Agri Tech", "AI/ML", "Ed Tech", "Electric Vehicle", "Energy Storage", "Fin Tech / Legal Tech",
  "Food Technology", "Health Tech", "Industry 4.0 / IoT", "Manufacturing", "Renewable / Clean Tech",
  "Robotics", "Smart City", "Software & Internet", "Speciality Chemicals", "Telecom App", "Other"
];

const technologyOptions = [
  "Artificial Intelligence / Machine Learning",
  "IoT / Embedded Systems",
  "Robotics & Automation",
  "Software & Web Apps",
  "Hardware & Electronics",
  "Biotechnology / Chemicals",
  "Energy / EV Technology",
  "Other"
];

const levelOptions = [
  "Ideation / Concept",
  "Proof of Concept (PoC)",
  "Working Prototype",
  "Pilot Testing",
  "Commercialized / In Market",
  "Scaling"
];

const programOptions = [
  "SparkUp", "TEC", "DST NIDHI PRAYAS", "DST NIDHI EiR",
  "MeitY TIDE 2.0 EiR", "MeitY TIDE 2.0 Grant Scheme", "GoG SEED FUND", "NIDHI SSS"
];

export const MsmeProgramApplication: React.FC<MsmeProgramApplicationProps> = ({ program, onCancel, application, mode }) => {
  const { user, applyToProgram, showToast } = useAppState();
  const navigate = useNavigate();
  const [fields, setFields] = useState<MsmeFormFields>(() => initialFields(user || undefined));

  useEffect(() => {
    if (mode === "view" && application) {
      setFields({
        name: application.name || "",
        email: application.email || "",
        mobile: application.mobile || "",
        permanentAddress: application.permanentAddress || "",
        country: application.country || "India",
        state: application.state || "",
        city: application.city || "",
        pinCode: application.pinCode || "",
        gender: application.gender || "",
        dateOfBirth: application.dateOfBirth || "",
        employmentStatus: application.employmentStatus || "",
        currentCompany: application.currentCompany || "",
        highestEducation: application.highestEducation || "",
        heardFrom: application.heardFrom || "",
        familyIncome: application.familyIncome || "",
        linkedInUrl: application.linkedInUrl || "",
        registeredCompany: application.registeredCompany || "",
        companyName: application.companyName || "",
        incorporationDate: application.incorporationDate || "",
        companyState: application.companyState || "",
        companyCity: application.companyCity || "",
        dpiitAvailable: application.dpiitAvailable || "",
        website: application.website || "",
        projectName: application.projectName || "",
        applicationVertical: application.applicationVertical || "",
        technologyUsed: application.technologyUsed || "",
        productLevel: application.productLevel || "",
        painPoint: application.painPoint || "",
        productDescription: application.productDescription || "",
        innovationDetails: application.innovationDetails || "",
        ipFiled: application.ipFiled || "",
        videoLink: application.videoLink || "",
        supportRequired: application.supportRequired || "",
        programsApplied: Array.isArray(application.programsApplied) ? application.programsApplied : [],
        requestedFunding: application.requestedFunding || "",
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
  
  // File attachments
  const [prototypePhotos, setPrototypePhotos] = useState<File | null>(null);
  const [blockDiagram, setBlockDiagram] = useState<File | null>(null);
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successApplication, setSuccessApplication] = useState<{ id: string; programName: string } | null>(null);

  const updateField = <K extends keyof MsmeFormFields>(field: K, value: MsmeFormFields[K]) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleCheckboxChange = (option: string) => {
    const nextList = fields.programsApplied.includes(option)
      ? fields.programsApplied.filter((item) => item !== option)
      : [...fields.programsApplied, option];
    updateField("programsApplied", nextList);
  };

  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    // Step 1: Personal Info validations
    if (!fields.name.trim()) nextErrors.name = "Name is required.";
    else if (fields.name.length > 40) nextErrors.name = "Name cannot exceed 40 characters.";

    if (!fields.email.trim()) nextErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(fields.email)) nextErrors.email = "Enter a valid email.";

    if (!fields.mobile.trim()) nextErrors.mobile = "Contact number is required.";
    
    if (!fields.permanentAddress.trim()) nextErrors.permanentAddress = "Permanent address is required.";
    else if (fields.permanentAddress.length > 250) nextErrors.permanentAddress = "Address cannot exceed 250 characters.";

    if (!fields.country) nextErrors.country = "Country is required.";
    if (!fields.state) nextErrors.state = "State is required.";
    if (!fields.city.trim()) nextErrors.city = "City is required.";

    if (!fields.pinCode.trim()) nextErrors.pinCode = "Pin Code is required.";
    else if (!/^\d{6}$/.test(fields.pinCode)) nextErrors.pinCode = "Pin Code must be 6 digits.";

    if (!fields.gender) nextErrors.gender = "Gender is required.";
    if (!fields.dateOfBirth) nextErrors.dateOfBirth = "Date of Birth is required.";

    if (!fields.employmentStatus) nextErrors.employmentStatus = "Employment Status is required.";
    if ((fields.employmentStatus === "Employed" || fields.employmentStatus === "Self Employed") && !fields.currentCompany.trim()) {
      nextErrors.currentCompany = "Company name is required for employed status.";
    }

    if (!fields.highestEducation) nextErrors.highestEducation = "Highest education is required.";
    if (!fields.heardFrom) nextErrors.heardFrom = "Please select where you heard about iCreate.";
    if (!fields.familyIncome) nextErrors.familyIncome = "Annual family income is required.";

    if (fields.linkedInUrl && !validateUrl(fields.linkedInUrl)) {
      nextErrors.linkedInUrl = "Please enter a valid URL (including https://).";
    }

    // Step 2: Company Details validations
    if (!fields.registeredCompany) nextErrors.registeredCompany = "Select whether company is registered.";
    if (fields.registeredCompany === "Yes") {
      if (!fields.companyName.trim()) nextErrors.companyName = "Company name is required.";
      if (!fields.incorporationDate) nextErrors.incorporationDate = "Date of incorporation is required.";
      if (!fields.companyState) nextErrors.companyState = "Company registration state is required.";
      if (!fields.companyCity.trim()) nextErrors.companyCity = "Company registration city is required.";
      if (!fields.dpiitAvailable) nextErrors.dpiitAvailable = "Select DPIIT registration status.";
    }
    if (fields.website && !validateUrl(fields.website)) {
      nextErrors.website = "Please enter a valid URL (including https://).";
    }

    // Step 3: Project Info validations
    if (!fields.projectName.trim()) nextErrors.projectName = "Name of project is required.";
    if (!fields.applicationVertical) nextErrors.applicationVertical = "Select application vertical.";
    if (!fields.technologyUsed) nextErrors.technologyUsed = "Select technology being used.";
    if (!fields.productLevel) nextErrors.productLevel = "Select product level.";

    if (!fields.painPoint.trim()) nextErrors.painPoint = "Pain point explanation is required.";
    else if (fields.painPoint.length > 250) nextErrors.painPoint = "Must be under 250 characters.";

    if (!fields.productDescription.trim()) nextErrors.productDescription = "Product description is required.";
    else if (fields.productDescription.length > 250) nextErrors.productDescription = "Must be under 250 characters.";

    if (!fields.innovationDetails.trim()) nextErrors.innovationDetails = "Innovation description is required.";
    else if (fields.innovationDetails.length > 250) nextErrors.innovationDetails = "Must be under 250 characters.";

    if (!fields.ipFiled) nextErrors.ipFiled = "Select IP filing status.";
    
    if (!prototypePhotos) nextErrors.prototypePhotos = "Prototype or POC photo is required.";
    if (!blockDiagram) nextErrors.blockDiagram = "Block diagram is required.";
    if (!pitchDeck) nextErrors.pitchDeck = "Presentation / Pitch Deck is required.";

    if (fields.videoLink && !validateUrl(fields.videoLink)) {
      nextErrors.videoLink = "Please enter a valid URL (including https://).";
    }

    if (!fields.supportRequired.trim()) nextErrors.supportRequired = "Describe the support needed from iCreate.";
    else if (fields.supportRequired.length > 250) nextErrors.supportRequired = "Must be under 250 characters.";

    if (!fields.programsApplied.length) nextErrors.programsApplied = "Select at least one program you are applying for.";
    if (!fields.requestedFunding.trim()) nextErrors.requestedFunding = "Requested funding amount is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    fieldKey: string,
    allowedTypes: string[]
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast("Maximum document size is 15MB.", "error");
      return;
    }

    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    const isAllowed = allowedTypes.some((type) => {
      if (type.startsWith("image/")) return file.type.startsWith("image/");
      return type.toLowerCase() === extension;
    });

    if (!isAllowed) {
      showToast(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`, "error");
      return;
    }

    setter(file);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please fix the validation errors before submitting.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const created = await applyToProgram({
        ...fields,
        programId: program.id,
        programName: program.name,
        startupName: fields.projectName,
        pitchDeckName: pitchDeck?.name || "PitchDeck.pdf",
        prototypePhotosName: prototypePhotos?.name || "Prototype.png",
        blockDiagramName: blockDiagram?.name || "BlockDiagram.pdf",
        _pitchDeckFile: pitchDeck,
        _prototypePhotosFile: prototypePhotos,
        _blockDiagramFile: blockDiagram,
      });

      setSuccessApplication({ id: created.id, programName: created.programName || program.name });
      setSuccessModalOpen(true);
    } catch (err) {
      console.error(err);
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
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" id="msme-application-form">
        {/* Header Banner */}
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-8 md:px-8">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#FF6B00]">MSME Support Program</p>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-[#0B2A5B]">Apply for MSME Support</h3>
          <h4 className="mt-3 text-base font-extrabold text-slate-900">Unified Filing Page (Personal, Entity, & Project details)</h4>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
            Please fill the operational details with absolute precision. Complete the 35 fields below to submit your business proposal directly to our screening committee.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 p-6 md:p-8">

          {/* SECTION 1: Personal Info */}
          <section className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-black text-[#FF6B00] tracking-widest uppercase">Step 01</span>
              <h4 className="text-lg font-black text-[#0B2A5B] mt-1">Founder / Applicant Details</h4>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TextField label="Full Name *" value={fields.name} error={errors.name} onChange={(val) => updateField("name", val)} maxLength={40} />
              <TextField label="Email Address *" type="email" value={fields.email} error={errors.email} onChange={(val) => updateField("email", val)} />
              <TextField label="Permanent Contact Number *" value={fields.mobile} error={errors.mobile} placeholder="+91 99999 99999" onChange={(val) => updateField("mobile", val)} />
              <TextField label="Your Pin Code (6 digits) *" value={fields.pinCode} error={errors.pinCode} onChange={(val) => updateField("pinCode", val)} />
              
              <SelectField label="State *" value={fields.state} error={errors.state} options={stateOptions} onChange={(val) => updateField("state", val)} />
              <TextField label="City *" value={fields.city} error={errors.city} onChange={(val) => updateField("city", val)} />
              <TextField label="Country *" value={fields.country} disabled onChange={() => {}} />

              <div className="space-y-2">
                <label className="block font-bold text-[#0B2A5B]">Your Gender *</label>
                <div className="flex gap-4 pt-1">
                  {genderOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input type="radio" disabled={mode === "view"} checked={fields.gender === opt} onChange={() => updateField("gender", opt)} className="h-4 w-4 accent-[#FF6B00]" />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="text-xs font-bold text-red-500">{errors.gender}</p>}
              </div>

              <TextField label="Your Date of Birth *" type="date" value={fields.dateOfBirth} error={errors.dateOfBirth} onChange={(val) => updateField("dateOfBirth", val)} />
            </div>

            <TextAreaField label="Your Permanent Address *" value={fields.permanentAddress} error={errors.permanentAddress} onChange={(val) => updateField("permanentAddress", val)} helper="Maximum 250 characters." />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2 col-span-full">
                <label className="block font-bold text-[#0B2A5B]">Current Employment Status *</label>
                <div className="flex flex-wrap gap-4 pt-1">
                  {employmentOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input type="radio" disabled={mode === "view"} checked={fields.employmentStatus === opt} onChange={() => updateField("employmentStatus", opt)} className="h-4 w-4 accent-[#FF6B00]" />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.employmentStatus && <p className="text-xs font-bold text-red-500">{errors.employmentStatus}</p>}
              </div>

              {(fields.employmentStatus === "Employed" || fields.employmentStatus === "Self Employed") && (
                <TextField label="Company name you are working in *" value={fields.currentCompany} error={errors.currentCompany} maxLength={50} onChange={(val) => updateField("currentCompany", val)} />
              )}

              <SelectField label="Highest educational qualification *" value={fields.highestEducation} error={errors.highestEducation} options={educationOptions} onChange={(val) => updateField("highestEducation", val)} />
              <SelectField label="Where did you hear about iCreate? *" value={fields.heardFrom} error={errors.heardFrom} options={heardFromOptions} onChange={(val) => updateField("heardFrom", val)} />
              <SelectField label="Total family income (annual in INR) *" value={fields.familyIncome} error={errors.familyIncome} options={incomeOptions} onChange={(val) => updateField("familyIncome", val)} />
              <TextField label="LinkedIn Profile URL" value={fields.linkedInUrl} error={errors.linkedInUrl} placeholder="https://linkedin.com/in/username" onChange={(val) => updateField("linkedInUrl", val)} />
            </div>
          </section>

          {/* SECTION 2: Entity Profile */}
          <section className="space-y-6 border-t border-slate-100 pt-8">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-black text-[#FF6B00] tracking-widest uppercase">Step 02</span>
              <h4 className="text-lg font-black text-[#0B2A5B] mt-1">Company Details</h4>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-[#0B2A5B]">Do you have a registered company? *</label>
              <div className="flex gap-4 pt-1">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input type="radio" disabled={mode === "view"} checked={fields.registeredCompany === opt} onChange={() => {
                      updateField("registeredCompany", opt);
                      if (opt === "No") {
                        // Reset corporate fields
                        updateField("companyName", "");
                        updateField("incorporationDate", "");
                        updateField("companyState", "");
                        updateField("companyCity", "");
                        updateField("dpiitAvailable", "");
                      }
                    }} className="h-4 w-4 accent-[#FF6B00]" />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.registeredCompany && <p className="text-xs font-bold text-red-500">{errors.registeredCompany}</p>}
            </div>

            {fields.registeredCompany === "Yes" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-slate-50/50 p-5 rounded-2xl border border-slate-200">
                <TextField label="Company Name *" value={fields.companyName} error={errors.companyName} maxLength={250} onChange={(val) => updateField("companyName", val)} />
                <TextField label="Date of incorporation of your company *" type="date" value={fields.incorporationDate} error={errors.incorporationDate} onChange={(val) => updateField("incorporationDate", val)} />
                
                <SelectField label="Company registration State *" value={fields.companyState} error={errors.companyState} options={stateOptions} onChange={(val) => updateField("companyState", val)} />
                <TextField label="Company registration City *" value={fields.companyCity} error={errors.companyCity} maxLength={250} onChange={(val) => updateField("companyCity", val)} />

                <div className="space-y-2 col-span-full">
                  <label className="block font-bold text-[#0B2A5B]">DPIIT Registration available? *</label>
                  <div className="flex gap-4 pt-1">
                    {["Yes", "No"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                        <input type="radio" disabled={mode === "view"} checked={fields.dpiitAvailable === opt} onChange={() => updateField("dpiitAvailable", opt)} className="h-4 w-4 accent-[#FF6B00]" />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {errors.dpiitAvailable && <p className="text-xs font-bold text-red-500">{errors.dpiitAvailable}</p>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TextField label="Website link (if any)" value={fields.website} error={errors.website} placeholder="https://example.com" onChange={(val) => updateField("website", val)} />
            </div>
          </section>

          {/* SECTION 3: Project or Product Info */}
          <section className="space-y-6 border-t border-slate-100 pt-8">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-black text-[#FF6B00] tracking-widest uppercase">Step 03</span>
              <h4 className="text-lg font-black text-[#0B2A5B] mt-1">Project or Product Info</h4>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TextField label="Name of your project or product *" value={fields.projectName} error={errors.projectName} maxLength={250} onChange={(val) => updateField("projectName", val)} />
              <SelectField label="Which technology is being used in the product? *" value={fields.technologyUsed} error={errors.technologyUsed} options={technologyOptions} onChange={(val) => updateField("technologyUsed", val)} />
              <SelectField label="At what level is your product? *" value={fields.productLevel} error={errors.productLevel} options={levelOptions} onChange={(val) => updateField("productLevel", val)} />
              <TextField label="How much funding support are you looking for? (in INR) *" type="number" value={fields.requestedFunding} error={errors.requestedFunding} placeholder="e.g. 1000000" onChange={(val) => updateField("requestedFunding", val)} />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-[#0B2A5B]">Which Application vertical best applies to your product *</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 pt-1">
                {verticalOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-3 font-semibold text-xs cursor-pointer hover:bg-slate-50">
                    <input type="radio" disabled={mode === "view"} checked={fields.applicationVertical === opt} onChange={() => updateField("applicationVertical", opt)} className="h-4 w-4 accent-[#FF6B00]" />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.applicationVertical && <p className="text-xs font-bold text-red-500">{errors.applicationVertical}</p>}
            </div>

            <TextAreaField label="What is the pain point that you are addressing? *" value={fields.painPoint} error={errors.painPoint} maxLength={250} helper="Maximum 250 characters." onChange={(val) => updateField("painPoint", val)} />
            <TextAreaField label="Describe your product with features, functionality *" value={fields.productDescription} error={errors.productDescription} maxLength={250} helper="Maximum 250 characters." onChange={(val) => updateField("productDescription", val)} />
            <TextAreaField label="What’s new/unique/innovative about what you’re making? *" value={fields.innovationDetails} error={errors.innovationDetails} maxLength={250} helper="Maximum 250 characters." onChange={(val) => updateField("innovationDetails", val)} />
            
            <div className="space-y-2">
              <label className="block font-bold text-[#0B2A5B]">Is any IP filed? *</label>
              <div className="flex gap-4 pt-1">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input type="radio" disabled={mode === "view"} checked={fields.ipFiled === opt} onChange={() => updateField("ipFiled", opt)} className="h-4 w-4 accent-[#FF6B00]" />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.ipFiled && <p className="text-xs font-bold text-red-500">{errors.ipFiled}</p>}
            </div>

            {/* File Uploads Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 border-t border-slate-100 pt-6">
              
              {/* prototypePhotos */}
              <div className="space-y-2">
                <label className="block font-bold text-[#0B2A5B]">Prototype Photos / PoC *</label>
                {mode === "view" ? (
                  <div 
                    onClick={() => handleDownloadFile("prototypePhotos", application?.prototypePhotosName || "prototypePhotos.png")}
                    className="flex flex-col items-center justify-center border-2 border-slate-200 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100 cursor-pointer shadow-xs"
                  >
                    <FileText className="h-8 w-8 text-[#FF6B00]" />
                    <span className="mt-2 text-xs font-bold text-slate-600 text-center truncate w-full">
                      {application?.prototypePhotosName || "PrototypePhotos.png"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Click to Download</span>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 p-4 transition-colors hover:bg-slate-100">
                    <UploadCloud className="h-8 w-8 text-slate-400" />
                    <span className="mt-2 text-xs font-bold text-slate-600 text-center">Choose Image or PDF (Max 15MB)</span>
                    <input type="file" accept="image/*,.pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, setPrototypePhotos, "prototypePhotos", ["image/*", ".pdf"])} />
                    {prototypePhotos && <p className="mt-2 text-[11px] font-bold text-[#FF6B00] text-center truncate w-full">{prototypePhotos.name}</p>}
                  </div>
                )}
                {errors.prototypePhotos && <p className="text-xs font-bold text-red-500">{errors.prototypePhotos}</p>}
              </div>

              {/* blockDiagram */}
              <div className="space-y-2">
                <label className="block font-bold text-[#0B2A5B]">Block Diagram *</label>
                {mode === "view" ? (
                  <div 
                    onClick={() => handleDownloadFile("blockDiagram", application?.blockDiagramName || "blockDiagram.png")}
                    className="flex flex-col items-center justify-center border-2 border-slate-200 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100 cursor-pointer shadow-xs"
                  >
                    <FileText className="h-8 w-8 text-[#FF6B00]" />
                    <span className="mt-2 text-xs font-bold text-slate-600 text-center truncate w-full">
                      {application?.blockDiagramName || "BlockDiagram.png"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Click to Download</span>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 p-4 transition-colors hover:bg-slate-100">
                    <UploadCloud className="h-8 w-8 text-slate-400" />
                    <span className="mt-2 text-xs font-bold text-slate-600 text-center">Choose Image or PDF (Max 15MB)</span>
                    <input type="file" accept="image/*,.pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, setBlockDiagram, "blockDiagram", ["image/*", ".pdf"])} />
                    {blockDiagram && <p className="mt-2 text-[11px] font-bold text-[#FF6B00] text-center truncate w-full">{blockDiagram.name}</p>}
                  </div>
                )}
                {errors.blockDiagram && <p className="text-xs font-bold text-red-500">{errors.blockDiagram}</p>}
              </div>

              {/* pitchDeck */}
              <div className="space-y-2">
                <label className="block font-bold text-[#0B2A5B]">Presentation / Pitch Deck *</label>
                {mode === "view" ? (
                  <div 
                    onClick={() => handleDownloadFile("pitchDeck", application?.pitchDeckName || "PitchDeck.pdf")}
                    className="flex flex-col items-center justify-center border-2 border-slate-200 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100 cursor-pointer shadow-xs"
                  >
                    <FileText className="h-8 w-8 text-[#FF6B00]" />
                    <span className="mt-2 text-xs font-bold text-slate-600 text-center truncate w-full">
                      {application?.pitchDeckName || "PitchDeck.pdf"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Click to Download</span>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 p-4 transition-colors hover:bg-slate-100">
                    <UploadCloud className="h-8 w-8 text-slate-400" />
                    <span className="mt-2 text-xs font-bold text-slate-600 text-center">Choose PDF, PPT, PPTX (Max 15MB)</span>
                    <input type="file" accept=".pdf,.ppt,.pptx" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, setPitchDeck, "pitchDeck", [".pdf", ".ppt", ".pptx"])} />
                    {pitchDeck && <p className="mt-2 text-[11px] font-bold text-[#FF6B00] text-center truncate w-full">{pitchDeck.name}</p>}
                  </div>
                )}
                {errors.pitchDeck && <p className="text-xs font-bold text-red-500">{errors.pitchDeck}</p>}
              </div>

            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4">
              <TextField label="Video link of working prototype" value={fields.videoLink} error={errors.videoLink} placeholder="https://youtube.com/..." onChange={(val) => updateField("videoLink", val)} />
            </div>

            <TextAreaField label="What kind of support you are looking from iCreate? *" value={fields.supportRequired} error={errors.supportRequired} maxLength={250} helper="Maximum 250 characters." onChange={(val) => updateField("supportRequired", val)} />

            {/* Program checkbox selection */}
            <div className="space-y-2 pt-4">
              <label className="block font-bold text-[#0B2A5B]">Choose the program you are applying for *</label>
              <p className="text-xs text-slate-500">You may select multiple options.</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                {programOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 font-semibold text-xs cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" disabled={mode === "view"} checked={fields.programsApplied.includes(opt)} onChange={() => handleCheckboxChange(opt)} className="h-4 w-4 accent-[#FF6B00]" />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.programsApplied && <p className="text-xs font-bold text-red-500">{errors.programsApplied}</p>}
            </div>
          </section>

          {/* Buttons / Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-8">
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

/* ── Inline Helper components to keep design perfect ── */
type TextFieldProps = {
  label: string;
  value: string;
  type?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
};

const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  type = "text",
  error,
  placeholder,
  disabled = false,
  maxLength,
  onChange,
}) => {
  const { disabled: contextDisabled } = React.useContext(FormModeContext);
  const isFieldDisabled = disabled || contextDisabled;
  return (
    <div className="space-y-1.5">
      <label className="block font-bold text-[#0B2A5B] text-xs uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={isFieldDisabled}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-white p-3 outline-none transition-colors text-sm font-semibold ${
          isFieldDisabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
        } ${
          error ? "border-red-500 bg-red-50/20 focus:border-red-500" : "border-slate-300 focus:border-[#0B2A5B]"
        }`}
      />
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};

type TextAreaProps = {
  label: string;
  value: string;
  error?: string;
  helper?: string;
  maxLength?: number;
  disabled?: boolean;
  onChange: (value: string) => void;
};

const TextAreaField: React.FC<TextAreaProps> = ({
  label,
  value,
  error,
  helper,
  maxLength,
  disabled = false,
  onChange,
}) => {
  const { disabled: contextDisabled } = React.useContext(FormModeContext);
  const isFieldDisabled = disabled || contextDisabled;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="block font-bold text-[#0B2A5B] text-xs uppercase tracking-wide">{label}</label>
        {maxLength && (
          <span className="text-[10px] text-slate-400 font-bold">
            {value.length}/{maxLength} characters
          </span>
        )}
      </div>
      <textarea
        rows={3}
        value={value}
        maxLength={maxLength}
        disabled={isFieldDisabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-white p-3 outline-none transition-colors text-sm font-semibold leading-relaxed ${
          isFieldDisabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
        } ${
          error ? "border-red-500 bg-red-50/20 focus:border-red-500" : "border-slate-300 focus:border-[#0B2A5B]"
        }`}
      />
      {helper && !error && <p className="text-xs text-slate-400 font-semibold">{helper}</p>}
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};

type SelectFieldProps = {
  label: string;
  value: string;
  error?: string;
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  error,
  options,
  disabled = false,
  onChange,
}) => {
  const { disabled: contextDisabled } = React.useContext(FormModeContext);
  const isFieldDisabled = disabled || contextDisabled;
  return (
    <div className="space-y-1.5">
      <label className="block font-bold text-[#0B2A5B] text-xs uppercase tracking-wide">{label}</label>
      <select
        value={value}
        disabled={isFieldDisabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-white p-3 outline-none transition-colors text-sm font-semibold ${
          isFieldDisabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
        } ${
          error ? "border-red-500 bg-red-50/20 focus:border-red-500" : "border-slate-300 focus:border-[#0B2A5B]"
        }`}
      >
        <option value="">Select Option</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};
