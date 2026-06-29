/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  X,
  FileText,
  CalendarDays,
  Building2,
  CheckCircle2,
  Users,
  Compass,
  FileCode,
  DollarSign,
  Paperclip,
  Activity,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { Application } from "../../types";
import { StatusBadge } from "./StatusBadge";
import { useAppState } from "../../context/AppContext";
import { downloadStoredFile } from "../../utils/documentStorage";

type ApplicationDetailsModalProps = {
  open: boolean;
  application: Application | null;
  onClose: () => void;
};

const formatLabel = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

const ReadOnlyField: React.FC<{
  label: string;
  value: unknown;
  fullWidth?: boolean;
}> = ({ label, value, fullWidth = false }) => {
  const displayVal = formatValue(value);
  return (
    <div className={`space-y-1.5 ${fullWidth ? "col-span-full" : ""}`}>
      <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-[#0B2A5B]">
        {label}
      </label>
      <div className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm font-semibold text-slate-800 shadow-sm leading-relaxed whitespace-pre-wrap">
        {displayVal}
      </div>
    </div>
  );
};

export const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  open,
  application,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { showToast } = useAppState();

  if (!open || !application) return null;

  const app = application as Application & Record<string, any>;

  const handleDownload = (fieldKey: string, filename: string) => {
    const success = downloadStoredFile(app.id || app._id, fieldKey, filename);
    if (!success) {
      showToast(`Simulated download of ${filename}`, "info");
    } else {
      showToast(`Downloading ${filename}`, "success");
    }
  };

  // Detect which custom fields are present in the submitted application
  const hasField = (key: string) => app[key] !== undefined && app[key] !== null && app[key] !== "";

  // Team members parser
  const teamMembersList = Array.isArray(app.teamMembers)
    ? app.teamMembers
    : [];

  // Financial statements parser
  const financialOne = app.financialOne || null;
  const financialTwo = app.financialTwo || null;

  // Tabs definitions
  const tabs = [
    { id: "overview", label: "Overview & Status", icon: Activity },
    { id: "contact", label: "Contact & Team", icon: Users },
    { id: "entity", label: "Entity Profile", icon: Building2 },
    { id: "innovation", label: "Innovation & Product", icon: Compass },
    { id: "market", label: "Market & Traction", icon: DollarSign },
    { id: "files", label: "Files & Preferences", icon: Paperclip }
  ];

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.35)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative border-b border-slate-100 bg-slate-50/50 px-6 py-5 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FF6B00] bg-[#FF6B00]/10 px-2.5 py-1 rounded-full">
                Application Review
              </span>
              <span className="text-xs text-slate-500 font-bold">
                ID: {app.id || app._id}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-[#0B2A5B]">
              {app.programName}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={app.status} />
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm">
              <CalendarDays className="h-3.5 w-3.5 text-[#FF6B00]" />
              Submitted: {app.submittedDate || "N/A"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors shadow-sm"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* Navigation Sidebar */}
          <nav className="w-full md:w-64 border-r border-slate-100 bg-slate-50/20 p-4 space-y-1.5 overflow-y-auto shrink-0 md:block flex gap-2 md:flex-col pb-3 md:pb-4 border-b md:border-b-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-extrabold tracking-wider uppercase transition-all ${
                    isActive
                      ? "bg-[#0B2A5B] text-white shadow-md shadow-[#0B2A5B]/10"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#FF6B00]" : "text-slate-400"}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Content Pane */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
            
            {/* TAB: Overview & Timeline */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-[#0B2A5B]">Application Status & Activity</h3>
                  <p className="text-xs text-slate-500 mt-1">Review the overall status changes and remarks for this application.</p>
                </div>

                {app.adminRemarks && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 flex items-start gap-4">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-black text-amber-900">Official Feedback / Remarks</h4>
                      <p className="mt-1.5 text-sm text-slate-700 leading-relaxed font-medium">{app.adminRemarks}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReadOnlyField label="Program ID" value={app.programId} />
                  <ReadOnlyField label="Startup Profile ID" value={app.startupId} />
                  <ReadOnlyField label="Primary Contact Email" value={app.submittedByEmail} />
                  <ReadOnlyField label="Authorized Name" value={app.submittedByName} />
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0B2A5B] mb-4">Application History Timeline</h4>
                  <div className="relative border-l-2 border-slate-100 ml-3 pl-6 space-y-6">
                    {app.timeline && app.timeline.length > 0 ? (
                      app.timeline.map((step: any, idx: number) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-[31px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-[#0B2A5B]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
                          </span>
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm max-w-2xl">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B2A5B] bg-[#0B2A5B]/10 px-2 py-0.5 rounded-md">
                                {step.status}
                              </span>
                              <span className="text-[11px] font-bold text-slate-400">{step.timestamp}</span>
                            </div>
                            {step.remarks && (
                              <p className="mt-2 text-xs font-semibold text-slate-600 leading-relaxed">
                                {step.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No historical timeline milestones registered.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Contact & Team */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-[#0B2A5B]">Authorized Applicant & Core Team</h3>
                  <p className="text-xs text-slate-500 mt-1">Founding member representative and total human resources.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Startup Application fields */}
                  {hasField("authorFirstName") && (
                    <ReadOnlyField label="First Name" value={app.authorFirstName} />
                  )}
                  {hasField("authorLastName") && (
                    <ReadOnlyField label="Last Name" value={app.authorLastName} />
                  )}
                  {hasField("designation") && (
                    <ReadOnlyField label="Designation" value={app.designation} />
                  )}
                  {hasField("mobile") && (
                    <ReadOnlyField label="Mobile Number" value={app.mobile} />
                  )}
                  {hasField("email") && (
                    <ReadOnlyField label="Email Address" value={app.email} />
                  )}

                  {/* MSME Specific Fields */}
                  {hasField("name") && (
                    <ReadOnlyField label="Full Name" value={app.name} />
                  )}
                  {hasField("gender") && (
                    <ReadOnlyField label="Gender" value={app.gender} />
                  )}
                  {hasField("dateOfBirth") && (
                    <ReadOnlyField label="Date of Birth" value={app.dateOfBirth} />
                  )}
                  {hasField("employmentStatus") && (
                    <ReadOnlyField label="Employment Status" value={app.employmentStatus} />
                  )}
                  {hasField("currentCompany") && (
                    <ReadOnlyField label="Current Company" value={app.currentCompany} />
                  )}
                  {hasField("highestEducation") && (
                    <ReadOnlyField label="Highest Education" value={app.highestEducation} />
                  )}
                  {hasField("heardFrom") && (
                    <ReadOnlyField label="Heard about iCreate" value={app.heardFrom} />
                  )}
                  {hasField("familyIncome") && (
                    <ReadOnlyField label="Annual Family Income" value={app.familyIncome} />
                  )}
                  {hasField("linkedInUrl") && (
                    <ReadOnlyField label="LinkedIn Profile URL" value={app.linkedInUrl} />
                  )}

                  {/* Standard Fields */}
                  {hasField("teamSize") && (
                    <ReadOnlyField label="Total Team Size" value={app.teamSize} />
                  )}
                  {hasField("fullTimeEmployees") && (
                    <ReadOnlyField label="Full-Time Employees" value={app.fullTimeEmployees} />
                  )}
                </div>

                {/* Team Members List */}
                {teamMembersList.length > 0 && (
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0B2A5B] mb-4">Promoter Details</h4>
                    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">Name</th>
                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">Role</th>
                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">Email</th>
                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">Mobile</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {teamMembersList.map((m: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="whitespace-nowrap px-4 py-3 text-xs font-bold text-slate-800">{m.name || "—"}</td>
                              <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-600">{m.role || "—"}</td>
                              <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-600">{m.email || "—"}</td>
                              <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-600">{m.mobile || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Entity Profile */}
            {activeTab === "entity" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-[#0B2A5B]">Company Identification & Identity</h3>
                  <p className="text-xs text-slate-500 mt-1">Official registry numbers, corporate entity type, and location details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Entity Identity */}
                  <ReadOnlyField label="Registered Startup Name" value={app.startupName} />
                  {hasField("dpiitNumber") && (
                    <ReadOnlyField label="DPIIT Recognition Number" value={app.dpiitNumber} />
                  )}
                  {hasField("natureOfEntity") && (
                    <ReadOnlyField label="Nature of Entity" value={app.natureOfEntity} />
                  )}
                  {hasField("incorporationDate") && (
                    <ReadOnlyField label="Date of Incorporation" value={app.incorporationDate} />
                  )}
                  {hasField("panNumber") && (
                    <ReadOnlyField label="PAN Number" value={app.panNumber} />
                  )}

                  {/* Legal Entity type for Global Impact */}
                  {hasField("legalEntity") && (
                    <ReadOnlyField label="Legal Entity Type" value={app.legalEntity} />
                  )}
                  {hasField("registeredBusinessName") && (
                    <ReadOnlyField label="Registered Corporate Name" value={app.registeredBusinessName} />
                  )}
                  {hasField("localBusinessName") && (
                    <ReadOnlyField label="Brand / Local Name" value={app.localBusinessName} />
                  )}

                  {/* MSME Corporate Fields */}
                  {hasField("registeredCompany") && (
                    <ReadOnlyField label="Do you have a registered company?" value={app.registeredCompany} />
                  )}
                  {hasField("companyName") && (
                    <ReadOnlyField label="Company Name" value={app.companyName} />
                  )}
                  {hasField("companyState") && (
                    <ReadOnlyField label="Company registration State" value={app.companyState} />
                  )}
                  {hasField("companyCity") && (
                    <ReadOnlyField label="Company registration City" value={app.companyCity} />
                  )}
                  {hasField("dpiitAvailable") && (
                    <ReadOnlyField label="DPIIT Registration available?" value={app.dpiitAvailable} />
                  )}

                  {/* Location Address */}
                  {hasField("state") && (
                    <ReadOnlyField label="State" value={app.state} />
                  )}
                  {hasField("city") && (
                    <ReadOnlyField label="City" value={app.city} />
                  )}
                  {hasField("pinCode") && (
                    <ReadOnlyField label="Pin Code" value={app.pinCode} />
                  )}
                  {hasField("permanentAddress") && (
                    <ReadOnlyField label="Permanent Address" value={app.permanentAddress} fullWidth />
                  )}
                  {hasField("address") && (
                    <ReadOnlyField label="Full Address" value={app.address} fullWidth />
                  )}
                  {hasField("placeOfOperations") && (
                    <ReadOnlyField label="Place of Operations" value={app.placeOfOperations} fullWidth />
                  )}
                </div>
              </div>
            )}

            {/* TAB: Innovation & Product */}
            {activeTab === "innovation" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-[#0B2A5B]">Innovation & Solution Details</h3>
                  <p className="text-xs text-slate-500 mt-1">Elevator pitch, core problems, unique selling points, and target market.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Info */}
                  {hasField("technologyStartup") && (
                    <ReadOnlyField label="Technology Startup?" value={app.technologyStartup} />
                  )}
                  {hasField("currentStage") && (
                    <ReadOnlyField label="Product / Business Stage" value={app.currentStage} />
                  )}
                  {hasField("businessStage") && (
                    <ReadOnlyField label="Current Business Stage" value={app.businessStage} />
                  )}
                  {hasField("industry") && (
                    <ReadOnlyField label="Sector / Industry" value={app.industry} />
                  )}

                  {/* MSME Specific Product Fields */}
                  {hasField("projectName") && (
                    <ReadOnlyField label="Name of your project or product" value={app.projectName} />
                  )}
                  {hasField("applicationVertical") && (
                    <ReadOnlyField label="Application vertical" value={app.applicationVertical} />
                  )}
                  {hasField("technologyUsed") && (
                    <ReadOnlyField label="Technology being used" value={app.technologyUsed} />
                  )}
                  {hasField("productLevel") && (
                    <ReadOnlyField label="Level of product" value={app.productLevel} />
                  )}
                  {hasField("ipFiled") && (
                    <ReadOnlyField label="Is any IP filed?" value={app.ipFiled} />
                  )}

                  {/* Core Descriptions */}
                  {hasField("problemStatement") && (
                    <ReadOnlyField label="Problem Statement" value={app.problemStatement} fullWidth />
                  )}
                  {hasField("solutionDescription") && (
                    <ReadOnlyField label="Proposed Solution Description" value={app.solutionDescription} fullWidth />
                  )}
                  {hasField("painPoint") && (
                    <ReadOnlyField label="Pain point addressed" value={app.painPoint} fullWidth />
                  )}
                  {hasField("productDescription") && (
                    <ReadOnlyField label="Product description with features" value={app.productDescription} fullWidth />
                  )}
                  {hasField("innovationDetails") && (
                    <ReadOnlyField label="What is new/unique/innovative?" value={app.innovationDetails} fullWidth />
                  )}
                  {hasField("valueProposition") && (
                    <ReadOnlyField label="Value Proposition" value={app.valueProposition} fullWidth />
                  )}
                  {hasField("uniqueSellingPoint") && (
                    <ReadOnlyField label="Unique Selling Point (USP)" value={app.uniqueSellingPoint} fullWidth />
                  )}
                  {hasField("businessPitch") && (
                    <ReadOnlyField label="Business Elevator Pitch" value={app.businessPitch} fullWidth />
                  )}
                  {hasField("theoryOfChange") && (
                    <ReadOnlyField label="Theory of Change / Impact Model" value={app.theoryOfChange} fullWidth />
                  )}
                </div>
              </div>
            )}

            {/* TAB: Market & Traction */}
            {activeTab === "market" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-[#0B2A5B]">Market Opportunity & Financial Health</h3>
                  <p className="text-xs text-slate-500 mt-1">Competitors, revenue notes, capital raised, and financial statements.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Target segment */}
                  {hasField("targetCustomer") && (
                    <ReadOnlyField label="Target Customer Segment" value={app.targetCustomer} />
                  )}
                  {hasField("customerProfile") && (
                    <ReadOnlyField label="Target Customer Profile" value={app.customerProfile} />
                  )}
                  {hasField("marketSize") && (
                    <ReadOnlyField label="Total Addressable Market Size" value={app.marketSize} />
                  )}
                  {hasField("scalePlan") && (
                    <ReadOnlyField label="Scale-Up Strategy" value={app.scalePlan} fullWidth />
                  )}
                  {hasField("revenueModel") && (
                    <ReadOnlyField label="Revenue Model" value={app.revenueModel} />
                  )}
                  {hasField("competitors") && (
                    <ReadOnlyField label="Key Competitors" value={app.competitors} />
                  )}

                  {/* Funding Info */}
                  {hasField("fundingStatus") && (
                    <ReadOnlyField label="Current Funding Status" value={app.fundingStatus} />
                  )}
                  {hasField("raisedFunding") && (
                    <ReadOnlyField label="Has Raised Prior Funding?" value={app.raisedFunding} />
                  )}
                  {hasField("fundingAmount") && (
                    <ReadOnlyField label="Current Funding Requirement" value={app.fundingAmount} />
                  )}
                  {hasField("fundingInstrument") && (
                    <ReadOnlyField label="Preferred Funding Instrument" value={app.fundingInstrument} />
                  )}
                  {hasField("grantRequestAmount") && (
                    <ReadOnlyField label="Requested Grant Amount" value={app.grantRequestAmount} />
                  )}
                  
                  {/* Revenue Traction */}
                  {hasField("revenueTractionNote") && (
                    <ReadOnlyField label="Traction / Revenue Description" value={app.revenueTractionNote} fullWidth />
                  )}

                  {/* MSME Market / Funding Specifics */}
                  {hasField("requestedFunding") && (
                    <ReadOnlyField label="Requested Funding (INR)" value={app.requestedFunding} />
                  )}
                  {hasField("programsApplied") && (
                    <ReadOnlyField label="Programs Applied For" value={app.programsApplied} />
                  )}
                  {hasField("supportRequired") && (
                    <ReadOnlyField label="Support required from iCreate" value={app.supportRequired} fullWidth />
                  )}

                  {/* Global Impact Program Specifics */}
                  {hasField("individualsImpacted") && (
                    <ReadOnlyField label="Individuals Impacted to Date" value={app.individualsImpacted} />
                  )}
                  {hasField("estimatedReach") && (
                    <ReadOnlyField label="Estimated Future Reach" value={app.estimatedReach} />
                  )}
                  {hasField("grantUsage") && (
                    <ReadOnlyField label="Proposed Support/Grant Usage" value={app.grantUsage} fullWidth />
                  )}
                  {hasField("businessPlans") && (
                    <ReadOnlyField label="Business Plans (Next 2 Years)" value={app.businessPlans} fullWidth />
                  )}
                  {hasField("awardsRecognition") && (
                    <ReadOnlyField label="Accreditations & Awards" value={app.awardsRecognition} fullWidth />
                  )}
                </div>

                {/* Financial Statement 1 & 2 (Global Impact) */}
                {(financialOne || financialTwo) && (
                  <div className="border-t border-slate-100 pt-6 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0B2A5B]">Historical Annual Financial Statements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {financialOne && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                          <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Statement 1 (FY Ending {financialOne.yearEnding || "—"})</h5>
                          <p className="text-xs text-slate-500 font-semibold">Currency: {financialOne.currency || "—"}</p>
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Revenue</p>
                              <p className="text-xs font-bold text-slate-800">{financialOne.totalRevenue || "—"}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Operating Revenue</p>
                              <p className="text-xs font-bold text-slate-800">{financialOne.operatingRevenue || "—"}</p>
                            </div>
                            <div className="col-span-2 pt-2">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Net Profit / Loss</p>
                              <p className="text-xs font-bold text-[#0B2A5B]">{financialOne.netProfit || "—"}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {financialTwo && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                          <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Statement 2 (FY Ending {financialTwo.yearEnding || "—"})</h5>
                          <p className="text-xs text-slate-500 font-semibold">Currency: {financialTwo.currency || "—"}</p>
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Revenue</p>
                              <p className="text-xs font-bold text-slate-800">{financialTwo.totalRevenue || "—"}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Operating Revenue</p>
                              <p className="text-xs font-bold text-slate-800">{financialTwo.operatingRevenue || "—"}</p>
                            </div>
                            <div className="col-span-2 pt-2">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Net Profit / Loss</p>
                              <p className="text-xs font-bold text-[#0B2A5B]">{financialTwo.netProfit || "—"}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Files & Preferences */}
            {activeTab === "files" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-[#0B2A5B]">Preferences & Supporting Files</h3>
                  <p className="text-xs text-slate-500 mt-1">Uploaded document files, presentation pitches, and incubator tags.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Website & Socials */}
                  {hasField("websiteUrl") && (
                    <ReadOnlyField label="Website URL" value={app.websiteUrl} />
                  )}
                  {hasField("website") && (
                    <ReadOnlyField label="Business Website" value={app.website} />
                  )}
                  {hasField("linkedInUrl") && (
                    <ReadOnlyField label="LinkedIn Profile" value={app.linkedInUrl} />
                  )}
                  {hasField("videoUrl") && (
                    <ReadOnlyField label="Video Pitch Presentation Link" value={app.videoUrl} />
                  )}
                  {hasField("videoLink") && (
                    <ReadOnlyField label="Video Link of working prototype" value={app.videoLink} />
                  )}

                  {/* Incubator preferences */}
                  {hasField("incubator1") && (
                    <ReadOnlyField label="Incubator Preference #1" value={app.incubator1} />
                  )}
                  {hasField("incubator2") && (
                    <ReadOnlyField label="Incubator Preference #2" value={app.incubator2} />
                  )}
                  {hasField("incubator3") && (
                    <ReadOnlyField label="Incubator Preference #3" value={app.incubator3} />
                  )}
                </div>

                {/* Uploaded Documents display */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0B2A5B]">Attached Files</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pitch deck */}
                    <div
                      onClick={() => handleDownload("pitchDeck", app.pitchDeckName || "PitchDeck.pdf")}
                      className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex items-center gap-3.5 shadow-sm cursor-pointer transition hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98]"
                    >
                      <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">Pitch Deck Presentation</p>
                        <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{app.pitchDeckName || "PitchDeck.pdf"}</p>
                      </div>
                    </div>

                    {/* Prototype Photos */}
                    {hasField("prototypePhotosName") && (
                      <div
                        onClick={() => handleDownload("prototypePhotos", app.prototypePhotosName)}
                        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex items-center gap-3.5 shadow-sm cursor-pointer transition hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98]"
                      >
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Prototype / POC Photos</p>
                          <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{app.prototypePhotosName}</p>
                        </div>
                      </div>
                    )}

                    {/* Block Diagram */}
                    {hasField("blockDiagramName") && (
                      <div
                        onClick={() => handleDownload("blockDiagram", app.blockDiagramName)}
                        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex items-center gap-3.5 shadow-sm cursor-pointer transition hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98]"
                      >
                        <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Block Diagram</p>
                          <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{app.blockDiagramName}</p>
                        </div>
                      </div>
                    )}

                    {/* Additional documents */}
                    {hasField("additionalDocumentsName") && (
                      <div
                        onClick={() => handleDownload("additionalDocuments", app.additionalDocumentsName)}
                        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex items-center gap-3.5 shadow-sm cursor-pointer transition hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98]"
                      >
                        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <FileCode className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Supporting Attachment</p>
                          <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{app.additionalDocumentsName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#0B2A5B] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#102e68]"
          >
            Close view
          </button>
        </div>

      </div>
    </div>
  );
};
