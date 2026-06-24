/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppState } from "../../context/AppContext";
import { User, Lock, Save, Globe, Shield, Eye, EyeOff, Mail, KeyRound, LockKeyhole } from "lucide-react";

export const Settings: React.FC = () => {
  const { user, startups, showToast, updateStartupProfile } = useAppState();
  const location = useLocation();
  const myStartup = startups.find((s) => s.id === user?.startupId);

  const [founderName, setFounderName] = useState(user?.name || "Founder Owner");
  const [email, setEmail] = useState(user?.email || "founder@company.in");
  const [mobile, setMobile] = useState(myStartup?.mobile || "9876543210");
  const [website, setWebsite] = useState(myStartup?.website || "https://company.in");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [privacyMode, setPrivacyMode] = useState("standard");
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    Promise.resolve()
      .then(async () => {
        if (user?.startupId) {
          await updateStartupProfile(user.startupId, {
            mobile,
            website,
          });
        }

        const session = JSON.parse(localStorage.getItem("bsi_session") || "{}");
        session.name = founderName;
        session.email = email;
        localStorage.setItem("bsi_session", JSON.stringify(session));

        showToast("Profile settings saved successfully.", "success");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <div className="space-y-6 text-xs text-slate-700" id="settings-container">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-3 space-y-1">
        <h2 className="text-md font-bold text-[#0B2A5B] flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#FF6B00]" />
          <span>Security & profile controls</span>
        </h2>
        <p className="text-[11px] text-slate-500 font-medium">
          Manage your founder dashboard settings, contact information, and security configurations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5" id="settings-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block font-bold text-[#0B2A5B]">Founder Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-slate-350 rounded-lg w-full outline-none font-semibold text-slate-800 focus:border-[#0B2A5B]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-[#0B2A5B]">Email Address *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                disabled
                className="pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-lg w-full outline-none font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-[#0B2A5B]">Contact Phone *</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="p-2.5 border border-slate-350 rounded-lg w-full outline-none font-semibold text-slate-800 focus:border-[#0B2A5B]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-[#0B2A5B]">Company Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-slate-350 rounded-lg w-full outline-none font-semibold text-slate-800 focus:border-[#0B2A5B]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white font-extrabold uppercase py-2.5 px-6 rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-55 transition-all"
            id="btn-settings-save"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving changes..." : "Save Profile Settings"}</span>
          </button>
        </div>
      </form>
      </div>

      <div id="privacy" className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 space-y-1">
          <h2 className="text-md font-bold text-[#0B2A5B] flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#FF6B00]" />
            <span>Privacy Settings</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">Control visibility and data-sharing preferences for your founder profile.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {["standard", "private", "public"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPrivacyMode(mode)}
              className={`rounded-xl border px-4 py-3 text-left font-semibold capitalize transition ${
                privacyMode === mode
                  ? "border-[#0B2A5B] bg-[#0B2A5B] text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div id="email" className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 space-y-1">
          <h2 className="text-md font-bold text-[#0B2A5B] flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#FF6B00]" />
            <span>Change Email ID</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">Email changes are handled through verified profile updates.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Your current login email is <span className="font-mono font-bold text-[#0B2A5B]">{email}</span>.
        </div>
      </div>

      <div id="password" className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 space-y-1">
          <h2 className="text-md font-bold text-[#0B2A5B] flex items-center gap-1.5">
            <LockKeyhole className="w-4 h-4 text-[#FF6B00]" />
            <span>Change Password</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">Update your portal password from the secure founder account controls.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="block font-bold text-[#0B2A5B]">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 pr-10 py-2.5 border border-slate-350 rounded-lg w-full outline-none font-semibold text-slate-800 focus:border-[#0B2A5B]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-[#0B2A5B]">New Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-slate-350 rounded-lg w-full outline-none font-semibold text-slate-800 focus:border-[#0B2A5B]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-[#0B2A5B]">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-slate-350 rounded-lg w-full outline-none font-semibold text-slate-800 focus:border-[#0B2A5B]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
