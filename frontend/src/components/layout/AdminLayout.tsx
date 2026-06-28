/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { 
  Building, FileSpreadsheet, ListTodo, Terminal, ShieldAlert, Users
} from "lucide-react";
import { useAppState } from "../../context/AppContext";

export const AdminLayout: React.FC = () => {
  const { user, startups, applications } = useAppState();
  const location = useLocation();

  const pendingStartups = startups.filter(s => !s.isApproved).length;
  const pendingApps = applications.filter(a => a.status === "Submitted" || a.status === "Under Review").length;

  const adminMenu = [
    { name: "Overview Stats", path: "/admin/dashboard", icon: <Terminal className="w-4 h-4" /> },
    { name: "Users", path: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { name: "Startups", path: "/admin/startups", icon: <Building className="w-4 h-4" />, count: pendingStartups },
    { name: "Applications", path: "/admin/applications", icon: <FileSpreadsheet className="w-4 h-4" />, count: pendingApps },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* SECURE SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 border-r border-slate-800 py-6 px-4 shrink-0 flex flex-col justify-between" id="admin-sidebar">
        <div>
          {/* Admin Header Title */}
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800" id="admin-sidebar-header">
            <ShieldAlert className="w-6 h-6 text-[#F9B233] animate-pulse" />
            <div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">DPIIT Desk Mode</p>
              <p className="text-sm font-bold text-white truncate">Administrator Console</p>
            </div>
          </div>

          {/* Nav list */}
          <nav className="space-y-1">
            {adminMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-md transition-all ${
                    isActive
                      ? "bg-[#FF6B00] text-white font-extrabold shadow"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  id={`admin-nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-white" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  {item.count && item.count > 0 ? (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-white text-slate-900" : "bg-red-500 text-white animate-pulse"}`}>
                      {item.count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Security Audit Stamp */}
        <div className="mt-8 bg-slate-950 p-3 rounded border border-slate-800 text-[10px] space-y-1 font-mono text-slate-500 leading-snug">
          <p className="text-slate-400 font-bold uppercase tracking-wider">Access Clearance:</p>
          <p>AUTHORIZED ID: AK_SHARMA</p>
          <p>DEPT: SEED COMMITTEE</p>
          <p className="text-emerald-500 flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SECURITY TAMPER ON
          </p>
        </div>
      </aside>

      {/* ADMIN CONSOLE WORKSPACE */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto" id="main-content">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};
