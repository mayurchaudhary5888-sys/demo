/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { useAppState } from "../../context/AppContext";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Timeline } from "../../components/common/Timeline";
import { Application, ApplicationStatus } from "../../types";
import { FileText, Eye, X, MessageSquare, CheckSquare } from "lucide-react";
import { ApplicationDetailsModal } from "../../components/common/ApplicationDetailsModal";
import { downloadStoredFile } from "../../utils/documentStorage";

const IncubatorPrefForm: React.FC<{
  appId: string;
  pref: any;
  onUpdate: (prefOrder: number, status: string, completeness: string, remarks: string) => Promise<void>;
}> = ({ appId, pref, onUpdate }) => {
  const [statusVal, setStatusVal] = useState(pref.status);
  const [completenessVal, setCompletenessVal] = useState(pref.completenessStatus || "In Progress");
  const [remarksVal, setRemarksVal] = useState(pref.comments || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(pref.preferenceOrder, statusVal, completenessVal, remarksVal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-lg border border-slate-205 space-y-3 text-xs">
      <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
        <h5 className="font-bold text-slate-800">
          Preference {pref.preferenceOrder}: {pref.incubatorName}
        </h5>
        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
          Current: {pref.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Status</label>
          <select
            value={statusVal}
            onChange={(e) => setStatusVal(e.target.value)}
            className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="Submitted">Submitted</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Completeness Check</label>
          <select
            value={completenessVal}
            onChange={(e) => setCompletenessVal(e.target.value)}
            className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Remarks / Feedback</label>
          <input
            type="text"
            value={remarksVal}
            onChange={(e) => setRemarksVal(e.target.value)}
            placeholder="Add comments..."
            className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-1.5 bg-[#F05A28] hover:bg-[#d9481b] disabled:opacity-50 text-white text-[10px] font-extrabold uppercase rounded-md shadow-xs transition-colors"
        >
          {loading ? "Saving..." : "Update Preference"}
        </button>
      </div>
    </form>
  );
};

export const AdminApplicationManagement: React.FC = () => {
  const { applications, updateApplicationStatus, updateApplicationIncubatorStatus, showToast } = useAppState();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusInput, setStatusInput] = useState<ApplicationStatus | "">("");
  const [remarksInput, setRemarksInput] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullDetails, setShowFullDetails] = useState(false);

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    if (!statusInput) {
      showToast("Please select a valid status.", "error");
      return;
    }

    updateApplicationStatus(selectedApp.id, statusInput as ApplicationStatus, remarksInput);
    showToast(`Application ${selectedApp.id} status updated to ${statusInput}`, "success");
    
    // Update local modal state
    setSelectedApp((prev) => {
      if (!prev) return null;
      const updatedTimeline = [
        {
          status: statusInput as ApplicationStatus,
          timestamp: new Date().toLocaleString(),
          remarks: remarksInput || `Status updated to ${statusInput}.`,
        },
        ...prev.timeline,
      ];
      return {
        ...prev,
        status: statusInput as ApplicationStatus,
        adminRemarks: remarksInput || prev.adminRemarks,
        timeline: updatedTimeline,
      };
    });

    setStatusInput("");
    setRemarksInput("");
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesSearch =
      app.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      header: "Application ID",
      accessor: (item: Application) => (
        <span className="font-mono font-bold text-slate-800">{item.id}</span>
      ),
    },
    {
      header: "Startup",
      accessor: (item: Application) => (
        <span className="font-extrabold text-[#0B2A5B]">{item.startupName}</span>
      ),
    },
    {
      header: "Program",
      accessor: (item: Application) => (
        <span className="text-slate-600 font-semibold">{item.programName}</span>
      ),
    },
    {
      header: "Submitted",
      accessor: (item: Application) => (
        <span className="text-slate-500 font-mono text-[11px]">{item.submittedDate}</span>
      ),
    },
    {
      header: "Status",
      accessor: (item: Application) => <StatusBadge status={item.status} />,
    },
    {
      header: "Action",
      accessor: (item: Application) => (
        <button
          onClick={() => {
            setSelectedApp(item);
            setStatusInput("");
            setRemarksInput("");
          }}
          className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-none"
          id={`inspect-app-${item.id}`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Review</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6" id="admin-applications-container">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <h3 className="text-md font-bold text-[#0B2A5B]">Sovereign Scheme Applications</h3>
          <p className="text-[11px] text-slate-500">
            Review and manage applications submitted by startups for central funding schemes and accelerators.
          </p>
        </div>
        <span className="text-xs bg-[#0B2A5B] text-white font-mono font-bold uppercase py-0.5 px-2 rounded-full shrink-0">
          Total: {applications.length} applications
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Startup name, Program, or Application ID..."
          className="flex-1 p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#0B2A5B]"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#0B2A5B]"
        >
          <option value="all">All Statuses</option>
          <option value={ApplicationStatus.SUBMITTED}>Submitted</option>
          <option value={ApplicationStatus.UNDER_REVIEW}>Under Review</option>
          <option value={ApplicationStatus.DOCUMENT_REQUESTED}>Document Requested</option>
          <option value={ApplicationStatus.SHORTLISTED}>Shortlisted</option>
          <option value={ApplicationStatus.APPROVED}>Approved</option>
          <option value={ApplicationStatus.REJECTED}>Rejected</option>
        </select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredApps}
        emptyMessage="No applications found matching the search/filter criteria."
        id="admin-applications-table"
      />

      {/* Audit Detail Fly-out Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-[999] backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto"
          id="app-audit-modal"
        >
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xl max-w-2xl w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 focus:outline-none"
              title="Close modal"
              id="close-audit-modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-100 pb-3 flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#0B2A5B]" />
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  Review Application: {selectedApp.id}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold font-mono">
                  Startup: {selectedApp.startupName} | Scheme: {selectedApp.programName}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFullDetails(true)}
              className="rounded-full bg-[#F05A28] px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#d9481b]"
            >
              View Full Application
            </button>

            {/* Application Detail Fields */}
            <div className="space-y-4 text-xs font-sans text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">
                    Current Development Stage
                  </span>
                  <p className="font-bold text-slate-800">{selectedApp.currentStage}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">
                    Team Size
                  </span>
                  <p className="font-bold text-slate-800">{selectedApp.teamSize} members</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1 sm:col-span-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">
                    Funding Status & History
                  </span>
                  <p className="font-bold text-slate-800">{selectedApp.fundingStatus}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-black text-[#0B2A5B] uppercase block">Problem Statement</span>
                <p className="text-slate-650 leading-relaxed text-justify bg-slate-50 p-3 rounded border border-slate-100">
                  {selectedApp.problemStatement}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-black text-[#0B2A5B] uppercase block">Proposed Solution</span>
                <p className="text-slate-650 leading-relaxed text-justify bg-slate-50 p-3 rounded border border-slate-100">
                  {selectedApp.solutionDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-black text-[#0B2A5B] uppercase block">Attached Pitch Deck</span>
                  <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg flex items-center justify-between text-indigo-900 font-mono text-[11px]">
                    <span className="font-semibold truncate max-w-[80%]">{selectedApp.pitchDeckName}</span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const success = downloadStoredFile(selectedApp.id, "pitchDeck", selectedApp.pitchDeckName);
                        if (!success) {
                          showToast(`Simulated download of ${selectedApp.pitchDeckName}`, "info");
                        } else {
                          showToast(`Downloading ${selectedApp.pitchDeckName}`, "success");
                        }
                      }}
                      className="text-[#FF6B00] font-bold hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>

                {selectedApp.additionalDocumentsName && (
                  <div className="space-y-1">
                    <span className="font-black text-[#0B2A5B] uppercase block">Additional Documents</span>
                    <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-between text-slate-700 font-mono text-[11px]">
                      <span className="font-semibold truncate max-w-[80%]">
                        {selectedApp.additionalDocumentsName}
                      </span>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          const success = downloadStoredFile(selectedApp.id, "additionalDocuments", selectedApp.additionalDocumentsName);
                          if (!success) {
                            showToast(`Simulated download of ${selectedApp.additionalDocumentsName}`, "info");
                          } else {
                            showToast(`Downloading ${selectedApp.additionalDocumentsName}`, "success");
                          }
                        }}
                        className="text-[#FF6B00] font-bold hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Incubator Preference Reviews (Only for Startup Program) */}
              {selectedApp.programId === "startup-program" && selectedApp.incubatorPreferences && (
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h4 className="font-black text-[#0B2A5B] uppercase flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-[#FF6B00]" />
                    <span>Incubator Preference Reviews</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedApp.incubatorPreferences.map((pref) => (
                      <IncubatorPrefForm
                        key={pref.preferenceOrder}
                        appId={selectedApp.id}
                        pref={pref}
                        onUpdate={async (prefOrder, newStatus, newCompleteness, newRemarks) => {
                          await updateApplicationIncubatorStatus(
                            selectedApp.id,
                            prefOrder,
                            newStatus,
                            newCompleteness,
                            newRemarks
                          );
                          showToast(`Incubator Preference #${prefOrder} updated successfully.`, "success");
                          
                          // Update parent modal's state instantly
                          setSelectedApp((prev) => {
                            if (!prev) return null;
                            const updatedPrefs = (prev.incubatorPreferences || []).map((p) => {
                              if (p.preferenceOrder === prefOrder) {
                                return {
                                  ...p,
                                  status: newStatus as any,
                                  completenessStatus: newCompleteness,
                                  comments: newRemarks,
                                  commentsDate: new Date().toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }),
                                };
                              }
                              return p;
                            });
                            return {
                              ...prev,
                              incubatorPreferences: updatedPrefs,
                            };
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update Form */}
              <form onSubmit={handleUpdateStatus} className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="font-black text-[#0B2A5B] uppercase flex items-center gap-1">
                  <CheckSquare className="w-4 h-4 text-[#FF6B00]" />
                  <span>Update Application Status</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">New Status *</label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as ApplicationStatus)}
                      className="w-full p-2.5 bg-white border border-slate-350 rounded-lg outline-none text-xs font-semibold text-slate-700"
                    >
                      <option value="">Select status...</option>
                      <option value={ApplicationStatus.SUBMITTED}>Submitted</option>
                      <option value={ApplicationStatus.UNDER_REVIEW}>Under Review</option>
                      <option value={ApplicationStatus.DOCUMENT_REQUESTED}>Document Requested</option>
                      <option value={ApplicationStatus.SHORTLISTED}>Shortlisted</option>
                      <option value={ApplicationStatus.APPROVED}>Approved</option>
                      <option value={ApplicationStatus.REJECTED}>Rejected</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">Remarks / Feedback</label>
                    <input
                      type="text"
                      value={remarksInput}
                      onChange={(e) => setRemarksInput(e.target.value)}
                      placeholder="Add administrative remarks..."
                      className="w-full p-2.5 border border-slate-350 rounded-lg outline-none text-xs font-semibold text-slate-700"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white font-extrabold uppercase rounded-lg shadow-sm"
                  >
                    Commit Status Change
                  </button>
                </div>
              </form>

              {/* Timeline Track */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h4 className="font-black text-[#0B2A5B] uppercase flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <span>Application Tracking Timeline</span>
                </h4>
                <Timeline entries={selectedApp.timeline} />
              </div>
            </div>
          </div>
        </div>
      )}

      <ApplicationDetailsModal
        open={showFullDetails}
        application={selectedApp}
        onClose={() => setShowFullDetails(false)}
      />
    </div>
  );
};
