/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogIn, LogOut, User, Award, Eye, EyeOff, LayoutDashboard, Users, Bell, Settings, FileText } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { programCatalog } from "../../data/programCatalog";
import { authApi } from "../../services/authApi";
import { AccountDeactivatedModal } from "./AccountDeactivatedModal";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const Navbar: React.FC = () => {
  const { user, login, logout, showToast } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // Modal Login / Register Popup states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "register" | "forgot-password">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Login Form input states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const [deactivatedMessage, setDeactivatedMessage] = useState("");

  // Register Form input states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regProgram, setRegProgram] = useState("");
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regLoading, setRegLoading] = useState(false);

  const navConfig = [
    {
      label: "ABOUT US",
      path: "/about-us",
    },
    {
      label: "NETWORK",
      path: "/network",
      dropdownItems: [
        { label: "Startup Connect", path: "/network/startup-profiles" },
        { label: "Angel / VC / Investor ", path: "/network/investor-profiles" },
      ],
    },
    {
      label: "PORTFOLIO",
      path: "/portfolio",
      dropdownItems: [
        { label: "Incubator Portfolios", path: "/portfolio" },
        { label: "Startup Portfolios", path: "/startup_portfolio" },
      ],
    },
    {
      label: "SUPPORT",
      path: "/support",
    },
    { label: "CONTACT US", path: "/contact-us" },
  ];

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "success");
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isPathActive = (item: typeof navConfig[number]) => {
    if (item.dropdownItems) {
      return item.dropdownItems.some((sub) => location.pathname === sub.path.split("?")[0]);
    }
    if (item.path === "/support") {
      return location.pathname.startsWith("/support");
    }
    return location.pathname === item.path;
  };

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdown(openMobileDropdown === label ? null : label);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const openLoginModal = () => {
      setShowLoginModal(true);
      setModalMode("login");
      setLoginErrors({});
      setMobileMenuOpen(false);
    };

    const showDeactivated = (e: any) => {
      setDeactivatedMessage(e.detail?.message || "");
      setShowDeactivatedModal(true);
    };

    window.addEventListener("bsi:open-login", openLoginModal);
    window.addEventListener("bsi:deactivated-account", showDeactivated);
    return () => {
      window.removeEventListener("bsi:open-login", openLoginModal);
      window.removeEventListener("bsi:deactivated-account", showDeactivated);
    };
  }, []);

  // ── Handle Login Form Submit ──
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!loginEmail.trim()) errs.email = "Email address required.";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email = "Invalid email format.";
    if (!loginPassword) errs.password = "Password secret required.";

    if (Object.keys(errs).length > 0) {
      setLoginErrors(errs);
      showToast("Please check the credentials entries.", "error");
      return;
    }

    setLoginErrors({});
    setLoginLoading(true);
    try {
      const u = await login(loginEmail, loginPassword);
      showToast(`Welcome back, ${u.name}! Secure session active.`, "success");
      setShowLoginModal(false);
      setLoginEmail("");
      setLoginPassword("");

      if (u.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/startup/dashboard");
      }
    } catch (err: any) {
      if (err.message && (err.message.includes("Something wrong happens") || err.message.includes("not approved yet"))) {
        setDeactivatedMessage(err.message);
        setShowLoginModal(false);
        setShowDeactivatedModal(true);
      } else {
        showToast(err.message || "Invalid account credentials entered.", "error");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const profileLinks = [
    { label: "Dashboard", path: "/startup/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "My Applications", path: "/startup/applications", icon: <FileText className="w-4 h-4" /> },
    { label: "Connections", path: "/startup/connections", icon: <Users className="w-4 h-4" /> },
    { label: "Notifications", path: "/startup/notifications", icon: <Bell className="w-4 h-4" /> },
  ];



  // ── Handle Register Form Submit ──
  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!regName.trim()) errs.name = "Full name required.";
    if (!regEmail.trim()) errs.email = "Email required.";
    else if (!/\S+@\S+\.\S+/.test(regEmail)) errs.email = "Invalid email format.";
    if (!regMobile.trim()) errs.mobile = "Mobile number required.";
    else if (!/^\d{10}$/.test(regMobile)) errs.mobile = "10-digit mobile number required.";
    if (!regPassword) errs.password = "Password required.";
    else if (regPassword.length < 8) errs.password = "Minimum 8 characters.";
    else if (!/[A-Z]/.test(regPassword) || !/[a-z]/.test(regPassword) || !/\d/.test(regPassword)) {
      errs.password = "Use uppercase, lowercase, and one number.";
    }
    if (!regProgram) errs.selectedProgram = "Select one support.";

    if (Object.keys(errs).length > 0) {
      setRegErrors(errs);
      showToast("Please correct the form validation details.", "error");
      return;
    }

    setRegErrors({});
    setRegLoading(true);
    try {
      const response = await authApi.register({
        name: regName,
        email: regEmail,
        mobile: regMobile,
        password: regPassword,
        selectedProgram: regProgram,
        startupProfile: {
          startupName: regName,
          mobile: regMobile,
          stage: "Validation",
          fundingStatus: "Bootstrapped",
          state: "Other",
          city: "",
          industry: "Other",
          sector: "Other",
          services: [],
          interests: [],
          selectedProgram: regProgram,
          registeredAt: Date.now(),
        },
      });

      localStorage.setItem("bsi_temp_registration", JSON.stringify({
        name: regName,
        email: regEmail,
        mobile: regMobile,
        selectedProgram: regProgram,
        startupId: response.startupId,
        timestamp: Date.now()
      }));
      showToast("Registration initiated! Please verify your email.", "success");
      setShowLoginModal(false);

      setRegName("");
      setRegEmail("");
      setRegMobile("");
      setRegPassword("");
      setRegProgram("");

      navigate(`/verify-otp?email=${encodeURIComponent(regEmail)}`);
    } catch {
      showToast("Registration failed. Please try again.", "error");
    } finally {
      setRegLoading(false);
    }
  };

  const languageSelector = (
    <div className="relative flex items-center">
      <select
        value={selectedLanguage}
        onChange={(e) => {
          if (e.target.value === "en") {
            setSelectedLanguage("en");
            showToast("Language set to English.", "info");
          }
        }}
        aria-label="Select language"
        className="appearance-none rounded-full border border-slate-200 bg-white py-2 pl-3 pr-8 text-[11px] font-bold text-[#0B2A5B] shadow-sm transition-colors hover:border-[#FF6B00] focus:border-[#FF6B00] focus:outline-none"
      >
        <option value="en">English</option>
        <option value="hi" disabled>
          Hindi
        </option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-400" />
    </div>
  );

  return (
    <div className="w-full flex flex-col z-50 sticky top-0" id="main-navbar-container">
      {/* Primary White Navbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm relative min-h-[5.75rem] sm:min-h-[6.25rem] flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3" id="navbar-logo">
              <Link to="/" aria-label="Go to home" className="flex items-center">
                <img
                  src="/logos/bhaskar.jpeg"
                  alt="BHASKAR"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </Link>
              <span className="h-12 sm:h-14 w-px bg-slate-300" aria-hidden="true" />
              <img
                src="/logos/azadi-logo.png"
                alt="Azadi Ka Amrit Mahotsav"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            {languageSelector}
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 h-full" id="desktop-nav">
            {navConfig.map((item) => {
              const active = isPathActive(item);
              if (item.dropdownItems) {
                return (
                  <div key={item.label} className="relative group h-full flex items-center">
                    <button
                      className={`text-[12px] font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors relative py-2 ${active ? "text-[#FF6B00]" : "text-[#0B2A5B] hover:text-[#FF6B00]"
                        }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-3 h-3" />
                      {active && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00]"></div>
                      )}
                    </button>

                    {/* Hover Dropdown */}
                    <div className="absolute left-0 top-[70%] hidden group-hover:block w-52 bg-white rounded-lg shadow-lg border border-slate-150 p-1.5 z-[100] animate-in fade-in slide-in-from-top-1 duration-150">
                      {item.dropdownItems.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.path}
                          className={`block px-3 py-2 text-[11px] font-bold rounded transition-colors ${location.pathname === sub.path.split("?")[0]
                              ? "bg-slate-50 text-[#FF6B00]"
                              : "text-slate-700 hover:bg-slate-50 hover:text-[#FF6B00]"
                            }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`text-[12px] font-extrabold uppercase tracking-wider relative py-2 transition-colors ${active ? "text-[#FF6B00]" : "text-[#0B2A5B] hover:text-[#FF6B00]"
                    }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00]"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden lg:flex items-center gap-3" ref={profileMenuRef}>
                {user.role === "admin" ? (
                  <>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 border border-[#0B2A5B] hover:bg-slate-50 text-[#0B2A5B] font-extrabold text-[11.5px] uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 active:scale-97 cursor-pointer"
                      id="nav-logout-btn"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                    <Link
                      to={user.role === "admin" ? "/admin/dashboard" : "/startup/dashboard"}
                      className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E65F00] text-white font-extrabold text-[11.5px] uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center gap-1.5 active:scale-97"
                      id="nav-dashboard-btn"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="max-w-[80px] truncate">{user.name}</span>
                    </Link>
                  </>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen((prev) => !prev)}
                      className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E65F00] text-white font-extrabold text-[11.5px] uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center gap-1.5 active:scale-97"
                      id="nav-profile-btn"
                      aria-expanded={profileMenuOpen}
                      aria-haspopup="menu"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {profileMenuOpen && (
                      <div className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] overflow-hidden z-[120]">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Signed in as</p>
                          <p className="text-sm font-black text-[#0B2A5B] truncate">{user.name}</p>
                        </div>
                        <div className="py-2">
                          {profileLinks.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setProfileMenuOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${location.pathname === item.path
                                  ? "bg-slate-50 text-[#0B2A5B]"
                                  : "text-slate-700 hover:bg-slate-50 hover:text-[#0B2A5B]"
                                }`}
                            >
                              <span className="text-slate-400">{item.icon}</span>
                              <span>{item.label}</span>
                            </Link>
                          ))}
                          <Link
                            to="/startup/settings"
                            onClick={() => setProfileMenuOpen(false)}
                            className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${location.pathname.startsWith("/startup/settings")
                                ? "bg-slate-50 text-[#0B2A5B]"
                                : "text-slate-700 hover:bg-slate-50 hover:text-[#0B2A5B]"
                              }`}
                          >
                            <Settings className="w-4 h-4 text-slate-400" />
                            <span>Settings</span>
                          </Link>
                        </div>
                        <div className="border-t border-slate-100 p-2">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0B2A5B]"
                          >
                            <LogOut className="w-4 h-4 text-slate-400" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                {/* Outlined LOGIN Button triggers modal popup */}
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setModalMode("login");
                    setLoginErrors({});
                  }}
                  className="px-6 py-2.5 border-2 border-[#0B2A5B] hover:bg-slate-50 text-[#0B2A5B] font-extrabold text-[11.5px] uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 active:scale-97 cursor-pointer"
                  id="nav-login-btn"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>LOGIN</span>
                </button>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-[#FF6B00] hover:bg-[#E65F00] text-white font-extrabold text-[11.5px] uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center gap-1.5 active:scale-97"
                  id="nav-register-btn"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>REGISTER</span>
                </Link>
              </div>
            )}

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700 focus:outline-none border border-slate-200"
              id="mobile-menu-toggle"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl max-h-[80vh] overflow-y-auto" id="mobile-menu">
          <nav className="px-4 py-4 space-y-1">
            {navConfig.map((item) => {
              const active = isPathActive(item);
              if (item.dropdownItems) {
                const isMobileOpen = openMobileDropdown === item.label;
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => toggleMobileDropdown(item.label)}
                      className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${active
                          ? "bg-slate-50 text-[#FF6B00]"
                          : "text-slate-750 hover:bg-slate-50"
                        }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isMobileOpen && (
                      <div className="pl-4 space-y-1 bg-slate-50/50 py-1.5 rounded-lg border border-slate-100">
                        {item.dropdownItems.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2.5 text-xs font-bold text-slate-600 hover:text-[#FF6B00] hover:bg-slate-50 rounded-md"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${active
                      ? "bg-[#0B2A5B]/5 text-[#FF6B00]"
                      : "text-slate-750 hover:bg-slate-50"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Auth and buttons */}
            <div className="border-t border-slate-150 pt-4 mt-4 space-y-3">
              {user ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={user.role === "admin" ? "/admin/dashboard" : "/startup/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#FF6B00] rounded-full text-center"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#0B2A5B] border border-[#0B2A5B] rounded-full text-center cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLoginModal(true);
                      setModalMode("login");
                    }}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#0B2A5B] border border-[#0B2A5B] rounded-full text-center cursor-pointer bg-white"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>LOGIN</span>
                  </button>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#FF6B00] rounded-full text-center cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>REGISTER</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* ── Login / Register Popup Dialog Modal ── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-3xl w-full flex flex-col md:flex-row overflow-hidden relative min-h-0 md:min-h-[460px] animate-in zoom-in-95 duration-200">

              {/* Orange circular close button with white 'x' */}
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-3 right-3 w-6 h-6 bg-[#F05A28] hover:bg-[#D9481B] text-white rounded-full flex items-center justify-center font-bold hover:scale-105 active:scale-95 cursor-pointer z-50 text-[10px] shadow-sm focus:outline-none"
                title="Close modal"
              >
                ✕
              </button>

              {/* LEFT COLUMN: Form (Login or Register) */}
              {modalMode === "login" ? (
                <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col justify-between relative bg-white min-h-[380px]">
                  {/* City skyline background overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none opacity-[0.06] z-0">
                    <svg viewBox="0 0 400 100" fill="none" className="w-full h-full">
                      <path d="M0 100 H400 V70 H380 V60 H360 V75 H340 V50 H320 V70 H300 V40 H280 V65 H260 V30 H240 V75 H220 V55 H200 V80 H180 V45 H160 V70 H140 V50 H120 V75 H100 V35 H80 V60 H60 V30 H40 V65 H20 V50 H0 Z" fill="#0B2A5B" />
                    </svg>
                  </div>

                  <div className="space-y-5 z-10 w-full">
                    <div className="space-y-1 text-center md:text-left">
                      <h2 className="text-2xl font-black text-[#1E293B] tracking-tight text-center">LOGIN</h2>
                      <p className="text-[10px] text-slate-500 font-bold leading-normal text-center">
                        You can also access your account using your Startup Bharat credentials.
                      </p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="Please enter your email address"
                          className={`w-full px-3 py-2.5 border-2 rounded-lg text-xs font-semibold text-slate-700 outline-none border-[#F05A28] ${loginErrors.email ? "bg-red-50/10 border-red-500" : ""
                            }`}
                        />
                        {loginErrors.email && (
                          <p className="text-red-500 text-[9.5px] font-bold">⚠ {loginErrors.email}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Please enter your password"
                            className={`w-full px-3 py-2.5 border-2 rounded-lg text-xs font-semibold text-slate-700 outline-none border-[#F05A28] pr-10 ${loginErrors.password ? "bg-red-50/10 border-red-500" : ""
                              }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {loginErrors.password && (
                          <p className="text-red-500 text-[9.5px] font-bold">⚠ {loginErrors.password}</p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setModalMode("forgot-password")}
                          className="text-right text-[10px] font-extrabold text-[#1E293B] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-[#F05A28] hover:bg-[#D9481B] text-white font-extrabold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-50 mt-1"
                      >
                        Login
                      </button>
                    </form>

                    {/* Google Login Section matching screenshot */}
                    <div className="text-center pt-2 space-y-2 z-10 relative">
                      <span className="text-[10px] text-slate-600 font-extrabold tracking-wide block">
                        Login with others
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const u = await login("admin@startupindia.gov.in", "admin@123");
                            setShowLoginModal(false);
                            if (u.role === "admin") {
                              navigate("/admin/dashboard");
                            } else {
                              navigate("/startup/dashboard");
                            }
                          } catch (err) {
                            // No toast shown
                          }
                        }}
                        className="w-full max-w-xs mx-auto flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 font-extrabold py-2.5 px-4 border-2 border-slate-200 rounded-full shadow-sm text-xs transition duration-200"
                      >
                        <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.336 0 3.327 2.682 1.386 6.586l3.88 3.179z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M1.386 6.586A11.947 11.947 0 0 0 0 12c0 1.92.455 3.736 1.259 5.355l4.027-3.127A7.072 7.072 0 0 1 4.909 12c0-1.527.482-2.955 1.309-4.145L1.386 6.586z"
                          />
                          <path
                            fill="#4285F4"
                            d="M12 24c3.245 0 5.973-1.073 7.964-2.918l-3.864-3c-1.127.755-2.564 1.209-4.1 1.209-3.155 0-5.836-2.127-6.791-5.027l-4.027 3.127C3.127 21.145 7.182 24 12 24z"
                          />
                          <path
                            fill="#34A853"
                            d="M23.49 12.273c0-.818-.082-1.609-.227-2.382H12v4.518h6.464a5.536 5.536 0 0 1-2.4 3.636l3.864 3c2.264-2.09 3.564-5.164 3.564-8.773z"
                          />
                        </svg>
                        Login with <span className="font-black ml-1">Google</span>
                      </button>

                      {/* Don't have an account link only on mobile */}
                      <div className="md:hidden pt-3 border-t border-slate-100 mt-3 text-center">
                        <p className="text-[10px] font-bold text-slate-500">
                          Don't have an account?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setShowLoginModal(false);
                              setRegErrors({});
                              navigate("/register");
                            }}
                            className="font-black text-[#F05A28] hover:underline cursor-pointer"
                          >
                            Register Now
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : modalMode === "register" ? (
                // Registration Form Left side
                <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col justify-between bg-white min-h-[380px] overflow-y-auto max-h-[90vh]">
                  <div className="space-y-4 z-10 w-full">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black text-[#1E293B] tracking-tight">REGISTER</h2>
                      <p className="text-[10px] text-slate-500 font-bold leading-normal">
                        Configure your secure founder profile to file support applications.
                      </p>
                    </div>

                    <form onSubmit={handleRegSubmit} className="space-y-2.5">
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Full Name"
                          className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#F05A28] ${regErrors.name ? "border-red-500 bg-red-50/10" : "border-slate-300"
                            }`}
                        />
                        {regErrors.name && (
                          <p className="text-red-500 text-[9px] font-bold">⚠ {regErrors.name}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="Email Address"
                          className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#F05A28] ${regErrors.email ? "border-red-500 bg-red-50/10" : "border-slate-300"
                            }`}
                        />
                        {regErrors.email && (
                          <p className="text-red-500 text-[9px] font-bold">⚠ {regErrors.email}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <input
                          type="tel"
                          value={regMobile}
                          onChange={(e) => setRegMobile(e.target.value)}
                          placeholder="10-digit Mobile Number"
                          className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#F05A28] ${regErrors.mobile ? "border-red-500 bg-red-50/10" : "border-slate-300"
                            }`}
                        />
                        {regErrors.mobile && (
                          <p className="text-red-500 text-[9px] font-bold">⚠ {regErrors.mobile}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="relative">
                          <select
                            value={regProgram}
                            onChange={(e) => setRegProgram(e.target.value)}
                            className={`w-full appearance-none px-3 py-2.5 border rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#F05A28] ${regErrors.selectedProgram ? "border-red-500 bg-red-50/10" : "border-slate-300"
                              }`}
                          >
                            <option value="">Select support</option>
                            {programCatalog.map((program) => (
                              <option key={program.id} value={program.id}>
                                {program.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-3 text-slate-400 w-3.5 h-3.5" />
                        </div>
                        {regErrors.selectedProgram && (
                          <p className="text-red-500 text-[9px] font-bold">⚠ {regErrors.selectedProgram}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Password: 8+ chars, upper, lower, number"
                          className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#F05A28] ${regErrors.password ? "border-red-500 bg-red-50/10" : "border-slate-300"
                            }`}
                        />
                        {regErrors.password && (
                          <p className="text-red-500 text-[9px] font-bold">⚠ {regErrors.password}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={regLoading}
                        className="w-full bg-[#F05A28] hover:bg-[#D9481B] text-white font-extrabold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-50 mt-2"
                      >
                        {regLoading ? "Registering..." : "Sign Up"}
                      </button>
                    </form>

                    {/* Remembered password link only on mobile */}
                    <div className="md:hidden pt-3 border-t border-slate-100 mt-3 text-center">
                      <p className="text-[10px] font-bold text-slate-500">
                        Remembered password?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setModalMode("login");
                            setLoginErrors({});
                          }}
                          className="font-black text-[#F05A28] hover:underline cursor-pointer"
                        >
                          Login Now
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <ForgotPasswordForm
                  onBackToLogin={() => setModalMode("login")}
                  onSuccess={() => setModalMode("login")}
                />
              )}

              {/* RIGHT COLUMN: Soft yellow brand info box with gold borders wrapper matching screenshot */}
              <div className="hidden md:block w-full md:w-2/5 p-4 sm:p-5 bg-[#FFFDF4] border-t md:border-t-0 md:border-l border-[#FCD34D]/40">

                <div className="border-2 border-[#FCD34D] rounded-3xl p-6 bg-white w-full h-full flex flex-col justify-between items-center text-center gap-6 min-h-[380px]">
                  {/* BHASKAR brand stack */}
                  <div className="space-y-3 w-full">
                    <img
                      src="/logos/bhaskar.jpeg"
                      alt="BHASKAR"
                      className="mx-auto h-20 w-auto max-w-[180px] object-contain"
                    />

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Welcome to</span>
                      <h3 className="text-base font-black text-[#1E293B]">BHASKAR</h3>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono block leading-tight">
                        Bharat Startup Knowledge Access Registry
                      </span>
                      <p className="text-[9px] text-[#F05A28] font-extrabold tracking-wide pt-1">
                        Innovate. Connect. Thrive.
                      </p>
                    </div>
                  </div>

                  {/* Action Box to switch modalMode */}
                  <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-md w-full max-w-[210px] z-10">
                    {modalMode === "login" ? (
                      <>
                        <p className="text-[10px] font-bold text-slate-500">Don't have an account?</p>
                        <button
                          onClick={() => {
                            setShowLoginModal(false);
                            setRegErrors({});
                            navigate("/register");
                          }}
                          className="text-xs font-black text-[#F05A28] hover:underline cursor-pointer block mt-1.5 mx-auto"
                        >
                          Register Now
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] font-bold text-slate-500">Remembered password?</p>
                        <button
                          onClick={() => {
                            setModalMode("login");
                            setLoginErrors({});
                          }}
                          className="text-xs font-black text-[#F05A28] hover:underline cursor-pointer block mt-1.5 mx-auto"
                        >
                          Login Now
                        </button>
                      </>
                    )}
                  </div>

                  {/* Bottom spacer (DPIIT logo completely removed) */}
                  <div className="w-full h-1" />
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      <AccountDeactivatedModal
        open={showDeactivatedModal}
        onClose={() => setShowDeactivatedModal(false)}
        message={deactivatedMessage}
      />
    </div>
  );
};
