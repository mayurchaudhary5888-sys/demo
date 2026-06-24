/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { useAppState } from "../../context/AppContext";
import { Landmark, PlusCircle, ToggleLeft, ToggleRight, Trash2, CheckCircle } from "lucide-react";

export const AdminProgramManagement: React.FC = () => {
  const { programs, toggleProgramStatus, addProgram, showToast } = useAppState();

  const [modalOpen, setModalOpen] = useState(false);
  const [fields, setFields] = useState({
    name: "",
    description: "",
    benefits: "",
    eligibility: "",
    documentsRequired: ""
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleToggle = (id: string, currentlyActive: boolean) => {
    toggleProgramStatus(id);
    showToast(`Program cohort enrollment ${currentlyActive ? "suspended" : "activated"}.`, "success");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!fields.name.trim()) errs.name = "Cohort Title is required.";
    if (!fields.description.trim()) errs.description = "Cohort focus description required.";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    // Call context to add program
    addProgram({
      id: `prog-${Date.now()}`,
      name: fields.name,
      description: fields.description,
      benefits: fields.benefits.split(",").map((s) => s.trim()).filter(Boolean),
      eligibility: fields.eligibility.split(",").map((s) => s.trim()).filter(Boolean),
      documentsRequired: fields.documentsRequired.split(",").map((s) => s.trim()).filter(Boolean),
      isActive: true
    });

    showToast("Brand-new sovereign cohort program initialized successfully.", "success");
    setModalOpen(false);
    setFields({ name: "", description: "", benefits: "", eligibility: "", documentsRequired: "" });
    setFormErrors({});
  };

  return (
    <div className="space-y-6" id="admin-programs-container">
      
      {/* Header operations */}
      <div className="border-b border-slate-205 pb-3 flex justify-between items-center bg-white/50 backdrop-blur-xs">
        <div className="space-y-1">
          <h3 className="text-md font-bold text-[#0B2A5B]">Cohort Intake Configurations</h3>
          <p className="text-[11px] text-slate-500">Toggle enrollment statuses or register a brand-new centralized program channel.</p>
        </div>
        
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white font-extrabold text-xs py-2 px-4 rounded-lg flex items-center gap-1"
          id="add-new-cohort-trigger"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Program Cohort</span>
        </button>
      </div>

      {/* Grid of cohort cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="programs-cohorts-grid">
        {programs.map((p) => (
          <div key={p.id} className="bg-white border text-xs border-slate-205 p-5 rounded-xl space-y-4 hover:shadow-xs transition-colors">
            
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] bg-slate-100 text-slate-505 px-2 py-0.5 rounded font-mono font-bold uppercase">{p.id.toUpperCase()}</span>
                <h4 className="text-sm font-black text-[#0B2A5B]">{p.name}</h4>
              </div>

              {/* Toggle switch active status */}
              <button
                onClick={() => handleToggle(p.id, p.isActive)}
                className="focus:outline-none"
                id={`cohort-toggle-status-${p.id}`}
                title="Toggle Active Status"
              >
                {p.isActive ? (
                  <ToggleRight className="w-10 h-10 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-350" />
                )}
              </button>
            </div>

            <p className="text-[11.5px] text-slate-600 leading-relaxed text-justify line-clamp-3">
              {p.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold border-t border-slate-50 pt-3">
              <div className="flex items-center gap-1 font-mono">
                <span>INTAKE WINDOW:</span>
                <span className={p.isActive ? "text-emerald-600" : "text-amber-600"}>
                  {p.isActive ? "OPEN & ACTIVE" : "CLOSED TO INTAKE"}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CREATE COHORT MODAL POP-UP */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[999] backdrop-blur-xs flex justify-center items-center p-4 animate-in fade-in duration-150 animate-out" id="create-cohort-modal">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xl max-w-lg w-full p-6 space-y-5 relative animate-in zoom-in-95 duration-200">
            
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-md font-bold text-[#0B2A5B] flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#FF6B00]" />
                <span>Initialize Sovereign Cohort</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Publish a centralized scheme pathway with custom specifications and documentation requirements.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-705 font-sans" id="create-cohort-form">
              
              <div className="space-y-1">
                <label className="block font-bold text-[#0B2A5B]">Cohort Title *</label>
                <input
                  type="text"
                  value={fields.name}
                  onChange={(e) => setFields({ ...fields, name: e.target.value })}
                  placeholder="e.g. SISFS Defense Incubation Pipeline"
                  className={`w-full p-2.5 border rounded-lg outline-none ${
                    formErrors.name ? "border-red-500 bg-red-50/10" : "border-slate-350"
                  }`}
                  id="cohort-title-input"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#0B2A5B]">Focus Description *</label>
                <textarea
                  rows={2}
                  value={fields.description}
                  onChange={(e) => setFields({ ...fields, description: e.target.value })}
                  placeholder="Summarize cohort funding eligibility pathways, milestones, etc."
                  className="w-full p-2.5 border border-slate-350 rounded-lg outline-none leading-relaxed"
                  id="cohort-desc-textarea"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#0B2A5B]">Benefits Offered (Comma separated)</label>
                <input
                  type="text"
                  value={fields.benefits}
                  onChange={(e) => setFields({ ...fields, benefits: e.target.value })}
                  placeholder="Seed capital of ₹50 Lakhs, Mentorship blocks, IP evaluation support"
                  className="w-full p-2.5 border border-slate-350 rounded-lg outline-none"
                  id="cohort-benefits-input"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#0B2A5B]">Eligibility Criteria (Comma separated)</label>
                <input
                  type="text"
                  value={fields.eligibility}
                  onChange={(e) => setFields({ ...fields, eligibility: e.target.value })}
                  placeholder="DPIIT recognition must be verified, Company incorporate < 2 years"
                  className="w-full p-2.5 border border-slate-350 rounded-lg outline-none"
                  id="cohort-eligibility-input"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#0B2A5B]">Documents Required (Comma separated)</label>
                <input
                  type="text"
                  value={fields.documentsRequired}
                  onChange={(e) => setFields({ ...fields, documentsRequired: e.target.value })}
                  placeholder="Incorporation Certificate, Pitch Deck, Audited Bank sheets"
                  className="w-full p-2.5 border border-slate-355 rounded-lg outline-none"
                  id="cohort-docs-input"
                />
              </div>

              {/* actions button */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 font-sans">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white font-extrabold uppercase rounded-lg"
                  id="btn-cohort-publish"
                >
                  🚀 Publish Cohort Program
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
