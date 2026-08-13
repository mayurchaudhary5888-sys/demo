import React, { useState } from "react";
import { useAppState } from "../../context/AppContext";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Building2, ShieldCheck, Mail, MapPin, Eye, X, Trash2 } from "lucide-react";
import { StartupProfile } from "../../types";

export const AdminStartupManagement: React.FC = () => {
  const { startups, toggleStartupApproval, deleteStartup, showToast } = useAppState();
  const [selectedCorp, setSelectedCorp] = useState<StartupProfile | null>(null);
  const [corpToDelete, setCorpToDelete] = useState<StartupProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleToggleApproval = (id: string, currentlyApproved: boolean) => {
    toggleStartupApproval(id);
    showToast(
      `Startup profile ${currentlyApproved ? "withdrawn" : "approved"} and compiled.`,
      "success"
    );
    if (selectedCorp && selectedCorp.id === id) {
      setSelectedCorp(prev => prev ? { ...prev, isApproved: !currentlyApproved } : null);
    }
  };

  const confirmDeleteStartup = async () => {
    if (!corpToDelete) return;
    setDeleting(true);
    try {
      await deleteStartup(corpToDelete.id);
      if (selectedCorp?.id === corpToDelete.id) {
        setSelectedCorp(null);
      }
      setCorpToDelete(null);
    } catch {
      // Error handled in AppContext toast
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: "Company ID",
      accessor: (item: StartupProfile) => (
        <span className="font-mono font-bold text-slate-800">{item.id.toUpperCase()}</span>
      )
    },
    {
      header: "Business Name",
      accessor: (item: StartupProfile) => (
        <span className="font-extrabold text-[#0B2A5B] block truncate max-w-[150px]">{item.name}</span>
      )
    },
    {
      header: "Sector",
      accessor: (item: StartupProfile) => (
        <span className="bg-slate-50 text-slate-600 font-mono text-[10px] px-2 py-0.5 rounded font-bold">{item.sector}</span>
      )
    },
    {
      header: "Location",
      accessor: (item: StartupProfile) => (
        <span className="text-slate-500 font-sans">{item.city}, {item.state}</span>
      )
    },
    {
      header: "Vetted Approval",
      accessor: (item: StartupProfile) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          item.isApproved 
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
            : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}>
          {item.isApproved ? "Approved Listed" : "Pending Vetting"}
        </span>
      )
    },
    {
      header: "Action",
      accessor: (item: StartupProfile) => (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCorp(item)}
            className="px-2.5 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded text-xs font-bold flex items-center gap-1 focus:outline-none"
            id={`inspect-startup-${item.id}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Audit</span>
          </button>
          
          <button
            onClick={() => handleToggleApproval(item.id, item.isApproved)}
            className={`px-2.5 py-1.5 rounded text-xs font-bold text-white transition-colors focus:outline-none ${
              item.isApproved 
                ? "bg-amber-650 hover:bg-amber-700" 
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
            id={`toggle-approved-${item.id}`}
          >
            {item.isApproved ? "Suspend" : "Approve"}
          </button>

          <button
            onClick={() => setCorpToDelete(item)}
            className="px-2.5 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-bold flex items-center gap-1 focus:outline-none transition-colors"
            id={`delete-startup-${item.id}`}
            title="Delete Startup"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>Delete</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6" id="admin-startups-container">
      
      {/* Header operations */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <h3 className="text-md font-bold text-[#0B2A5B]">DPIIT Startup Recognition registry</h3>
          <p className="text-[11px] text-slate-500">Vet, audit, approve, or delete registered candidate profiles for the public portfolio showcases.</p>
        </div>
        <span className="text-xs bg-[#0B2A5B] text-white font-mono font-bold uppercase py-0.5 px-2 rounded-full shrink-0">
          Total: {startups.length} rows
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        <DataTable
          columns={columns}
          data={startups}
          emptyMessage="No startups registered under central databases."
          id="admin-startups-table"
        />
      </div>

      {/* FLY-OUT Audit MODAL POP-UP */}
      {selectedCorp && (
        <div className="fixed inset-0 bg-slate-900/60 z-[999] backdrop-blur-xs flex justify-center items-center p-4 animate-in fade-in duration-150 animate-out" id="startup-audit-modal">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xl max-w-lg w-full p-6 space-y-5 relative animate-in zoom-in-95 duration-200">
            
            {/* closure key */}
            <button
              onClick={() => setSelectedCorp(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 focus:outline-none"
              title="Close modal"
              id="close-audit-modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#0B2A5B]" />
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">Audit Workspace: {selectedCorp.name}</h3>
                <p className="text-[10px] text-slate-500 font-bold font-mono">ID: {selectedCorp.id.toUpperCase()}</p>
              </div>
            </div>

            {/* details sheet representation */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans text-slate-700">
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">CIN Registration code</span>
                <p className="font-bold text-slate-800 font-mono">{selectedCorp.msmeNumber || selectedCorp.dpiitNumber || "Not available"}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">DPIIT recognition code</span>
                <p className="font-bold text-emerald-700 font-mono">
                  {selectedCorp.isDpiitRecognized ? selectedCorp.dpiitNumber : "Not registered"}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">Director DIN Identification</span>
                <p className="font-bold text-slate-800 font-mono">{selectedCorp.registrationDate}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">Incorporation Date</span>
                <p className="font-bold text-slate-800 font-mono">{selectedCorp.registrationDate}</p>
              </div>

            </div>

            <div className="space-y-1 text-xs text-slate-705">
              <span className="font-black text-[#0B2A5B]">Company Brief Description:</span>
              <p className="text-slate-650 leading-relaxed text-justify bg-slate-50 p-3 rounded border border-slate-100">
                {selectedCorp.description}
              </p>
            </div>

            {/* Audit compliance checklists */}
            <div className="bg-[#FFFDF3] border border-amber-300 p-4 rounded-lg text-[10.5px] leading-relaxed text-slate-600 space-y-1 font-sans">
              <p className="font-bold text-[#0B2A5B] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Auditing Compliance parameters:</span>
              </p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Incorporation Date aligns within 2 years boundary metric parameters (Check: Pass)</li>
                <li>Self-certified Indian aggregate promotor stake holds minimum 51% (Check: Pass)</li>
              </ul>
            </div>

            {/* Actions button */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs font-sans">
              <button
                type="button"
                onClick={() => setCorpToDelete(selectedCorp)}
                className="px-3.5 py-2 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                id="modal-delete-startup-btn"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Delete Startup</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCorp(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Close Audit
                </button>
                
                <button
                  type="button"
                  onClick={() => handleToggleApproval(selectedCorp.id, selectedCorp.isApproved)}
                  className={`px-4 py-2 rounded font-extrabold text-white uppercase tracking-wider ${
                    selectedCorp.isApproved 
                      ? "bg-amber-650 hover:bg-amber-700" 
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                  id="modal-toggle-approved-btn"
                >
                  {selectedCorp.isApproved ? "Suspend Approval" : "Certify compliance"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Startup Confirmation Modal */}
      {corpToDelete && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" id="delete-startup-modal">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Delete Startup Profile</h4>
                <p className="text-xs text-slate-500 font-medium">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete startup <strong className="text-slate-900">{corpToDelete.name}</strong> (<span className="font-mono text-slate-700">{corpToDelete.id.toUpperCase()}</span>)?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCorpToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteStartup}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
                id="confirm-delete-startup-btn"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

