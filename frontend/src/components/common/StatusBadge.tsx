/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CheckCircle, AlertTriangle, Clock, ShieldCheck, XCircle, FileClock } from "lucide-react";
import { ApplicationStatus } from "../../types";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Normalize the status string to map properly
  let badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
  let dotColor = "bg-blue-500";
  let icon = <Clock className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;

  switch (status) {
    case ApplicationStatus.APPROVED:
    case "Approved":
    case "Active":
    case "accepted":
      badgeStyle = "bg-green-50 text-green-700 border-green-200";
      dotColor = "bg-green-500";
      icon = <CheckCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      break;
    case ApplicationStatus.UNDER_REVIEW:
    case "Under Review":
    case "Pending":
    case "pending":
      badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
      dotColor = "bg-amber-500";
      icon = <Clock className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      break;
    case ApplicationStatus.DOCUMENT_REQUESTED:
    case "Document Requested":
      badgeStyle = "bg-orange-50 text-orange-800 border-orange-200";
      dotColor = "bg-orange-500";
      icon = <FileClock className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-orange-600 animate-pulse" />;
      break;
    case ApplicationStatus.SHORTLISTED:
    case "Shortlisted":
      badgeStyle = "bg-[#FFFDF0] text-amber-900 border-amber-300";
      dotColor = "bg-amber-400";
      icon = <ShieldCheck className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      break;
    case ApplicationStatus.REJECTED:
    case "Rejected":
    case "Suspended":
      badgeStyle = "bg-red-50 text-red-700 border-red-200";
      dotColor = "bg-red-500";
      icon = <XCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      break;
    case ApplicationStatus.SUBMITTED:
    case "Submitted":
    default:
      badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
      dotColor = "bg-blue-500";
      icon = <Clock className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle} select-none whitespace-nowrap`}
      id={`badge-${status.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`}></span>
      {icon}
      {status}
    </span>
  );
};
