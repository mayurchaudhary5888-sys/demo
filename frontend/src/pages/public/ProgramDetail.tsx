/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Award, ArrowLeft, CheckCircle, FileText, UploadCloud, CheckCircle2, ShieldAlert, 
  HelpCircle, Sparkles, UserCheck, CalendarDays, Workflow, BookOpen, Cpu, Globe, TrendingUp
} from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { getCatalogProgram } from "../../data/programCatalog";
import { ApplicationSuccessModal } from "../../components/common/ApplicationSuccessModal";
import { ProfileUnderReviewModal } from "../../components/common/ProfileUnderReviewModal";
import { IdeaValidationProgram } from "./programs/idea-validation-program/IdeaValidationProgram";
import { FoundationProgram } from "./programs/foundation-program/FoundationProgram";
import { GlobalImpactProgram } from "./programs/global-impact-program/GlobalImpactProgram";
import { StartupProgramApplication } from "./programs/startup-program/StartupProgramApplication";

const requestLogin = () => {
  window.dispatchEvent(new CustomEvent("bsi:open-login"));
};

export const ProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { programs, user, applyToProgram, showToast, startups } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"details" | "apply">(
    location.pathname.endsWith("/apply") ? "apply" : "details"
  );
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [additionalFile, setAdditionalFile] = useState<File | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successApplication, setSuccessApplication] = useState<{ id: string; programName: string } | null>(null);
  const [profileReviewOpen, setProfileReviewOpen] = useState(false);

  // Form states
  const [fields, setFields] = useState({
    problemStatement: "",
    solutionDescription: "",
    currentStage: "",
    teamSize: 1,
    fundingStatus: "",
    declarationChecked: false
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const prog = programs.find((p) => p.id === id) || getCatalogProgram(id);
  const userStartup = startups.find((s) => s.id === user?.startupId);

  useEffect(() => {
    // Reset states if program changes
    setUploadedFile(null);
    setAdditionalFile(null);
    setSuccessModalOpen(false);
    setSuccessApplication(null);
    setProfileReviewOpen(false);
    setFields({
      problemStatement: "",
      solutionDescription: "",
      currentStage: "",
      teamSize: 1,
      fundingStatus: "",
      declarationChecked: false
    });
    setFormErrors({});
    setActiveTab(location.pathname.endsWith("/apply") ? "apply" : "details");
  }, [id, location.pathname, user?.email, user?.name, userStartup?.name]);

  useEffect(() => {
    if (location.pathname.endsWith("/apply") && !user && prog) {
      showToast("Please login to apply for this program.", "info");
      requestLogin();
      navigate(`/support/${prog.id}`, { replace: true });
    }
  }, [location.pathname, navigate, prog, showToast, user]);

  useEffect(() => {
    if (location.pathname.endsWith("/apply") && user?.isActive === false && prog) {
      setProfileReviewOpen(true);
      navigate(`/support/${prog.id}`, { replace: true });
    }
  }, [location.pathname, navigate, prog, user?.isActive]);

  if (!prog) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center select-none" id="program-not-found">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#0B2A5B]">Resource Not Located</h2>
        <p className="text-xs text-slate-500 mt-1">Sovereign program template with ID "{id}" was not compiled in database.</p>
        <Link to="/support" className="text-xs text-[#FF6B00] font-bold mt-4 inline-block hover:underline">
          Return to Program Listings
        </Link>
      </div>
    );
  }

  // Drag over handler
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 10 * 1024 * 1024) {
        showToast("Maximum document upload size is 10MB.", "error");
        return;
      }
      setUploadedFile(file);
      showToast("Document attached successfully", "success");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "pitch" | "additional") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1025) {
        showToast("Maximum document upload size is 10MB.", "error");
        return;
      }
      if (type === "pitch") setUploadedFile(file);
      else setAdditionalFile(file);
      showToast("Document attached successfully", "success");
    }
  };

  const handleBlurValidation = (fieldName: string, value: any) => {
    const errors = { ...formErrors };
    if (fieldName === "problemStatement" && !value.trim()) {
      errors.problemStatement = "Problem statement is compulsory under DPIIT rules.";
    } else if (fieldName === "problemStatement") {
      delete errors.problemStatement;
    }

    if (fieldName === "solutionDescription" && !value.trim()) {
      errors.solutionDescription = "Solution description is compulsory.";
    } else if (fieldName === "solutionDescription") {
      delete errors.solutionDescription;
    }

    if (fieldName === "currentStage" && !value) {
      errors.currentStage = "Please specify current developmental stage.";
    } else if (fieldName === "currentStage") {
      delete errors.currentStage;
    }

    if (fieldName === "fundingStatus" && !value.trim()) {
      errors.fundingStatus = "Funding status and past capital logs required.";
    } else if (fieldName === "fundingStatus") {
      delete errors.fundingStatus;
    }

    setFormErrors(errors);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!fields.problemStatement.trim()) errors.problemStatement = "Problem statement required.";
    if (!fields.solutionDescription.trim()) errors.solutionDescription = "Solution description required.";
    if (!fields.currentStage) errors.currentStage = "Developmental stage required.";
    if (!fields.fundingStatus.trim()) errors.fundingStatus = "Funding history statement required.";
    if (!uploadedFile) errors.pitch = "Please upload an active pitch deck or proposal sheet.";
    if (!fields.declarationChecked) errors.declaration = "You must check the declaration box.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.isActive === false) {
      setProfileReviewOpen(true);
      return;
    }
    if (!validateForm()) {
      showToast("Please correct error flags prior to submission.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const created = await applyToProgram({
        programId: prog.id,
        programName: prog.name,
        startupId: user?.startupId || "",
        startupName: userStartup?.name || "Temp Startup",
        problemStatement: fields.problemStatement,
        solutionDescription: fields.solutionDescription,
        currentStage: fields.currentStage,
        teamSize: fields.teamSize,
        fundingStatus: fields.fundingStatus,
        pitchDeckName: uploadedFile?.name || "PitchDeck.pdf",
        additionalDocumentsName: additionalFile?.name || undefined
      });
      setActiveTab("details");
      setSuccessApplication({ id: created.id, programName: created.programName || prog.name });
      setSuccessModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessContinue = () => {
    setSuccessModalOpen(false);
    navigate("/startup/dashboard");
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="program-details-container">
      
      {/* breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <li>
            <Link to="/support" className="hover:text-[#0B2A5B] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Programs</span>
            </Link>
          </li>
          <li>
            <span className="text-slate-300 mx-1">/</span>
            <span className="text-[#0B2A5B] font-semibold truncate max-w-[200px] inline-block">{prog.name}</span>
          </li>
        </ol>
      </nav>

      {/* DETAILED HEADER WITH TABS */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B2A5B] tracking-tight">{prog.name}</h1>
            </div>

            {/* Selector tabs */}
            <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-lg self-start">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                  activeTab === "details"
                    ? "bg-[#0B2A5B] text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                id="tab-details-btn"
              >
                Scheme details
              </button>
                <button
                onClick={() => {
                  if (!user) {
                    showToast("Authentication required. Please sign in or sign up first.", "info");
                    requestLogin();
                  } else if (user.isActive === false) {
                    setProfileReviewOpen(true);
                  } else {
                    setActiveTab("apply");
                  }
                }}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                  activeTab === "apply"
                    ? "bg-[#0B2A5B] text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                id="tab-apply-btn"
              >
                Apply for program
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      {activeTab === "details" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="details-section">
          
          <div className="lg:col-span-8 space-y-8 font-sans">
            
            {/* 1. Overview */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-3 shadow-xs">
              <h3 className="text-md font-bold text-[#0B2A5B] flex items-center gap-2 border-b border-slate-100 pb-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Overview & Framework</span>
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed text-justify whitespace-pre-line">
                {prog.longDescription}
              </p>
            </div>

            {/* 2. Benefits */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-3 shadow-xs">
              <h3 className="text-md font-bold text-[#0B2A5B] flex items-center gap-2 border-b border-slate-100 pb-2">
                <span>Sanctioned Benefits & Allocations</span>
              </h3>
              <ul className="space-y-3 text-xs leading-relaxed">
                {prog.benefits.map((ben, idx) => (
                  <li key={idx} className="flex gap-2.5 text-slate-700">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-justify">{ben}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Eligibility Criteria Checklist */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-3 shadow-xs" id="eligibility-checklist">
              <h3 className="text-md font-bold text-[#0B2A5B] flex items-center gap-2 border-b border-slate-100 pb-2">
                <span>DPIIT Eligibility Checklist (Strict Vetting)</span>
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {prog.eligibility.map((el, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-700 font-medium">
                    <span className="w-5 h-5 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                    <span className="text-justify leading-relaxed">{el}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Required Documentation */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-3 shadow-xs">
              <h3 className="text-md font-bold text-[#0B2A5B] flex items-center gap-2 border-b border-slate-100 pb-2">
                <span>Mandatory Documents (PDF formats supported)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {prog.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-150 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    <span className="text-slate-700 text-xs font-semibold leading-tight">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. STEPWISE APPLICATION PROCESS */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-xs">
              <h3 className="text-md font-bold text-[#0B2A5B] flex items-center gap-2 border-b border-slate-100 pb-2">
                <span>Facilitation Process Roadmap</span>
              </h3>
              
              <div className="relative pl-6 space-y-6 border-l border-slate-150 animate-in fade-in" id="process-roadmap">
                {prog.processSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[37px] top-0 w-6 h-6 rounded-full bg-[#0B2A5B] text-white flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <h5 className="text-xs font-bold text-[#0B2A5B]">Stage Step: {step.split(":")[0]}</h5>
                    <p className="text-xs text-slate-500 leading-relaxed text-justify mt-0.5 font-sans">
                      {step.split(":")[1] || step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SIDEBAR DISCLAIMERS AND ACTION PANE */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* STICKY QUICK APPLY CARD */}
            <div className="bg-slate-900 text-white rounded-xl p-6 space-y-4 shadow-lg border-b-4 border-[#FF6B00]">
              <div className="space-y-1.5">
                <span className="inline-block bg-amber-400 text-slate-900 font-extrabold text-[9px] px-2 py-0.5 rounded uppercase">
                  Registry Status: OPEN
                </span>
                <p className="text-xs text-slate-400 font-mono">BHASKAR SOVEREIGN SCHEME</p>
              </div>

              <div className="border-t border-slate-800 pt-3 text-xs leading-relaxed text-slate-300">
                Ensure alignment of your active registered DPIIT indicators prior to filing milestone reports.
              </div>

              <div className="pt-2">
                {prog.isOpen ? (
              <button
                onClick={() => {
                  if (!user) {
                    showToast("Authentication required. Please sign in or sign up first.", "info");
                    requestLogin();
                  } else {
                    setActiveTab("apply");
                  }
                }}
                className="w-full bg-[#FF6B00] font-extrabold text-xs py-3 rounded-lg text-center tracking-widest uppercase transition-all shadow-md inline-block focus:ring-2 focus:ring-orange-300 outline-none hover:bg-[#FF6B00]/95 text-white"
                id="sticky-trigger-apply"
              >
                    🚀 Initiate Digital Application
                  </button>
                ) : (
                  <span className="block text-center py-3 bg-slate-800 text-slate-500 border border-slate-700 font-bold rounded-lg cursor-not-allowed text-xs">
                    Apply Cohort Closed
                  </span>
                )}
              </div>
            </div>

            {/* STYLED OFFICIAL DISCLAIMER CALLOUT BOX */}
            {prog.disclaimer && (
              <div className="bg-amber-50/50 border border-amber-300 p-4 rounded-xl text-[11px] leading-relaxed text-slate-600 flex items-start gap-2.5 shadow-sm">
                <HelpCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#0B2A5B]">ISMC Facilitation Disclaimer:</p>
                  <p className="text-justify font-sans">{prog.disclaimer}</p>
                </div>
              </div>
            )}

          </div>

        </div>
      ) : prog.id === "idea-validation-program" ? (
        <IdeaValidationProgram program={prog} onCancel={() => setActiveTab("details")} />
      ) : prog.id === "foundation-program" ? (
        <FoundationProgram program={prog} onCancel={() => setActiveTab("details")} />
      ) : prog.id === "global-impact-program" ? (
        <GlobalImpactProgram program={prog} onCancel={() => setActiveTab("details")} />
      ) : prog.id === "startup-program" ? (
        <StartupProgramApplication program={prog} onCancel={() => setActiveTab("details")} />
      ) : (
        /* COMMON APPLICATION FORM */
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm space-y-8" id="application-form-pane">
          
          <div className="border-b border-slate-150 pb-4">
            <h3 className="text-lg font-bold text-[#0B2A5B]">Common Scheme Filing Form</h3>
            <p className="text-xs text-slate-500 mt-1">Please fill the operational details with absolute precise metrics. Discrepancies lead to immediate ISMC rejection.</p>
          </div>

          {/* READ-ONLY AUTO-FILLED CHIPS */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-150 space-y-3">
            <span className="text-[10px] bg-[#0B2A5B]/10 text-[#0B2A5B] font-bold px-2 py-0.5 rounded font-mono uppercase">
              Auto-filled enterprise profile tags
            </span>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded text-slate-700">
                <strong>Name: </strong> {userStartup?.name || "Enterprise Profile Missing"}
              </span>
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded text-slate-700">
                <strong>Sector: </strong> {userStartup?.sector || "Pending"}
              </span>
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded text-slate-700">
                <strong>DPIIT: </strong> {userStartup?.isDpiitRecognized ? userStartup.dpiitNumber : "Not registered yet"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 italic">To modify pre-filled company tags, please edit your central Profile page first.</p>
          </div>

          {/* CORE FILING FIELDS FORM */}
          <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-800" id="common-apply-form">
            
            {/* Problem statement counted textarea */}
            <div className="space-y-1.5">
              <label className="block font-bold text-[#0B2A5B]">
                Specify Core Problem Statement being Tackled *
              </label>
              <textarea
                rows={4}
                value={fields.problemStatement}
                onChange={(e) => setFields({ ...fields, problemStatement: e.target.value })}
                onBlur={(e) => handleBlurValidation("problemStatement", e.target.value)}
                placeholder="Detail the industrial deficit, farming bottlenecks, or scientific deficit your technology resolves. Minimum 50 characters."
                className={`w-full p-3 border rounded-lg outline-none text-xs font-semibold text-slate-700 leading-relaxed ${
                  formErrors.problemStatement ? "border-red-500 ring-1 ring-red-100 bg-red-50/10" : "border-slate-350 focus:border-[#0B2A5B]"
                }`}
                id="problemStatement-input"
              />
              {formErrors.problemStatement && (
                <p className="text-red-500 font-bold text-[10px] flex items-center gap-1" role="alert">
                  <span>⚠</span> {formErrors.problemStatement}
                </p>
              )}
            </div>

            {/* Solution description counted textarea */}
            <div className="space-y-1.5">
              <label className="block font-bold text-[#0B2A5B]">
                Solution Description and Technical Architecture *
              </label>
              <textarea
                rows={4}
                value={fields.solutionDescription}
                onChange={(e) => setFields({ ...fields, solutionDescription: e.target.value })}
                onBlur={(e) => handleBlurValidation("solutionDescription", e.target.value)}
                placeholder="Describe your proprietary technology, mechanical layout, or unique software components."
                className={`w-full p-3 border rounded-lg outline-none text-xs font-semibold text-slate-700 leading-relaxed ${
                  formErrors.solutionDescription ? "border-red-500 ring-1 ring-red-100 bg-red-50/10" : "border-slate-350 focus:border-[#0B2A5B]"
                }`}
                id="solutionDescription-input"
              />
              {formErrors.solutionDescription && (
                <p className="text-red-500 font-bold text-[10px] flex items-center gap-1" role="alert">
                  <span>⚠</span> {formErrors.solutionDescription}
                </p>
              )}
            </div>

            {/* Cascaded Stage selector + Team size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="block font-bold text-[#0B2A5B]">Current Prototyping Stage *</label>
                <select
                  value={fields.currentStage}
                  onChange={(e) => setFields({ ...fields, currentStage: e.target.value })}
                  onBlur={(e) => handleBlurValidation("currentStage", e.target.value)}
                  className={`w-full p-2.5 bg-white border rounded-lg outline-none text-xs font-semibold text-slate-700 ${
                    formErrors.currentStage ? "border-red-500" : "border-slate-350"
                  }`}
                  id="currentStage-select"
                >
                  <option value="">Select Stage...</option>
                  <option value="Conceptual Hypothesis Stage">Conceptual Hypothesis</option>
                  <option value="Prototyping Under Lab Testing">Prototyping Under Lab Testing</option>
                  <option value="MVP Formed & Active Pilot Cases">MVP Formed & Active Pilot Cases</option>
                  <option value="Sustained Commercialization Scale">Sustained Commercialization Scale</option>
                </select>
                {formErrors.currentStage && (
                  <p className="text-red-500 text-[10px] font-bold" role="alert">⚠ {formErrors.currentStage}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-[#0B2A5B]">Full-time Team count *</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={fields.teamSize}
                  onChange={(e) => setFields({ ...fields, teamSize: parseInt(e.target.value) || 1 })}
                  className="w-full p-2.5 border border-slate-350 rounded-lg text-xs font-semibold text-slate-700 focus:border-[#0B2A5B]"
                  id="teamSize-input"
                />
              </div>

            </div>

            {/* Funding statement history logs */}
            <div className="space-y-1.5">
              <label className="block font-bold text-[#0B2A5B]">
                Funding Status and Past Grants Received (Central or State) *
              </label>
              <input
                type="text"
                value={fields.fundingStatus}
                onChange={(e) => setFields({ ...fields, fundingStatus: e.target.value })}
                onBlur={(e) => handleBlurValidation("fundingStatus", e.target.value)}
                placeholder="Detail past financial assistance if any. If bootstrapped, write 'Fully Bootstrapped - No prior grants received'."
                className={`w-full p-2.5 border rounded-lg outline-none text-xs font-semibold text-slate-700 ${
                  formErrors.fundingStatus ? "border-red-500" : "border-slate-350 focus:border-[#0B2A5B]"
                }`}
                id="fundingStatus-input"
              />
              {formErrors.fundingStatus && (
                <p className="text-red-500 text-[10px] font-bold" role="alert">⚠ {formErrors.fundingStatus}</p>
              )}
            </div>

            {/* FILE UPLOAD INTERFACE (DRAG & DROP WITH VALIDATIONS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Drag over pitch upload */}
              <div className="space-y-1.5">
                <label className="block font-bold text-[#0B2A5B]">
                  Upload Prototyping Report / Pitch Deck (PDF/PPTX) *
                </label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed p-6 rounded-lg text-center flex flex-col justify-center items-center h-44 cursor-pointer select-none transition-colors ${
                    dragActive ? "border-[#FF6B00] bg-orange-50/10" : "border-slate-300 hover:border-[#0B2A5B]"
                  }`}
                  id="pitch-drag-container"
                >
                  <input
                    type="file"
                    id="pitch-file-fileinput"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "pitch")}
                    accept=".pdf,.pptx"
                  />
                  <label htmlFor="pitch-file-fileinput" className="cursor-pointer space-y-2 flex flex-col items-center">
                    <UploadCloud className="w-8 h-8 text-indigo-500 animate-bounce" />
                    <p className="text-[11px] font-bold text-[#0B2A5B]">Drag & Drop Pitch Deck PDF here</p>
                    <p className="text-[10px] text-slate-400">or click to choose file from computer (Max 10MB)</p>
                  </label>
                </div>

                {uploadedFile ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center justify-between font-mono text-[11px]">
                    <span className="truncate max-w-[85%] font-semibold">✓ {uploadedFile.name} ({(uploadedFile.size/1024/1024).toFixed(2)} MB)</span>
                    <button type="button" onClick={() => setUploadedFile(null)} className="text-red-600 font-bold hover:underline">Remove</button>
                  </div>
                ) : (
                  formErrors.pitch && (
                    <p className="text-red-500 text-[10px] font-bold">⚠ {formErrors.pitch}</p>
                  )
                )}
              </div>

              {/* Additional optional document upload */}
              <div className="space-y-1.5">
                <label className="block font-bold text-[#0B2A5B]">
                  Additional Documents (Optional: MoA/Audited statements)
                </label>
                <div className="border border-slate-300 rounded-lg p-5 flex flex-col justify-center items-center h-44 gap-3 bg-slate-50">
                  <FileText className="w-8 h-8 text-slate-400" />
                  <input
                    type="file"
                    id="additional-doc-input"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "additional")}
                    accept=".pdf"
                  />
                  <label htmlFor="additional-doc-input" className="bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-md font-bold text-[11px] cursor-pointer text-slate-700 shadow-xs">
                    Choose Additional PDF file
                  </label>
                  <p className="text-[10px] text-slate-400">File size must sit below 10MB</p>
                </div>

                {additionalFile && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center justify-between font-mono text-[11px]">
                    <span className="truncate max-w-[85%] font-semibold">✓ {additionalFile.name}</span>
                    <button type="button" onClick={() => setAdditionalFile(null)} className="text-red-600 font-bold hover:underline">Remove</button>
                  </div>
                )}
              </div>

            </div>

            {/* DECLARATION LOCK */}
            <div className="border-t border-slate-250 pt-5 space-y-4">
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150">
                <input
                  type="checkbox"
                  checked={fields.declarationChecked}
                  onChange={(e) => setFields({ ...fields, declarationChecked: e.target.checked })}
                  className="w-4.5 h-4.5 text-[#FF6B00] border-slate-300 rounded mt-0.5 focus:ring-0 outline-none cursor-pointer"
                  id="declaration-checkbox"
                />
                <label htmlFor="declaration-checkbox" className="text-[11px] leading-relaxed text-slate-600 font-semibold select-none cursor-pointer">
                  I solemnly declare that the applicant startup and submitted documents are accurate, complete, and authorized for review. We understand that false metrics, misleading credentials, or invalid uploads can lead to rejection or blacklisting by the program review partners.
                </label>
              </div>
              {formErrors.declaration && (
                <p className="text-red-500 text-[10px] font-bold" role="alert">⚠ {formErrors.declaration}</p>
              )}
            </div>

            {/* FORM OPERATIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className="px-6 py-3 border border-slate-200 bg-slate-50 text-[#0B2A5B] font-bold hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel filing
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 font-extrabold tracking-widest uppercase rounded-lg shadow transition-all focus:ring-2 focus:ring-orange-200 outline-none bg-[#FF6B00] hover:bg-[#FF6B00]/95 text-white disabled:opacity-50"
                id="submit-proposal-btn"
              >
                {submitting ? "Processing secure file..." : "🚀 Certify & Submit Application"}
              </button>
            </div>

          </form>

        </div>
      )}

      {/* STICKY PORTABLE ACTION BAR ON BOTTOM FOR MOBILE SCREENS */}
      {prog.isOpen && activeTab === "details" && (
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900 text-white p-4 z-[99] border-t-2 border-[#FF6B00] flex justify-between items-center shadow-2xl">
          <div>
            <p className="text-[10px] font-bold uppercase text-amber-400 font-mono">Filing Active</p>
            <p className="text-xs font-black truncate max-w-[200px]">{prog.name}</p>
          </div>
          <button
                onClick={() => {
                  if (!user) {
                    showToast("Filing restricted. Sign in first.", "info");
                    requestLogin();
                  } else if (user.isActive === false) {
                    setProfileReviewOpen(true);
              } else {
                setActiveTab("apply");
                showToast("Opening filing form", "info");
              }
            }}
            className="bg-[#FF6B00] text-white font-black text-[11px] px-4 py-2.5 rounded shadow tracking-wide uppercase transition-colors"
            id="mobile-sticky-apply-btn"
          >
            Apply Now
          </button>
        </div>
      )}

      <ApplicationSuccessModal
        open={successModalOpen}
        applicationId={successApplication?.id}
        programName={successApplication?.programName}
        onClose={() => setSuccessModalOpen(false)}
        onContinue={handleSuccessContinue}
      />
      <ProfileUnderReviewModal open={profileReviewOpen} onClose={() => setProfileReviewOpen(false)} />

    </div>
  );
};
