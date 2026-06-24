/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Globe, LogIn, LogOut, User, Award, Eye, EyeOff, LayoutDashboard, Users, Bell, Settings } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { authApi } from "../../services/authApi";

export const Navbar: React.FC = () => {
  const { user, login, logout, showToast } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [settingsSubmenuOpen, setSettingsSubmenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // Modal Login / Register Popup states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Login Form input states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form input states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regLoading, setRegLoading] = useState(false);

  const navConfig = [
    { label: "HOME", path: "/" },
    {
      label: "ABOUT US",
      path: "/about-us",
    },
    {
      label: "PROGRAMS",
      path: "/programs",
      dropdownItems: [
        { label: "All Programs", path: "/programs" },
        { label: "Startup Program", path: "/programs/startup-program" },
        { label: "MSME Program", path: "/programs/msme-program" },
        { label: "Foundation Program", path: "/programs/foundation-program" },
        { label: "Idea Validation Program", path: "/programs/idea-validation-program" },
        { label: "Global Impact Program", path: "/programs/global-impact-program" },
        { label: "Track Application", path: "/programs/track-application" },
      ],
    },
    {
      label: "NETWORK",
      path: "/network",
      dropdownItems: [
        { label: "Startup Profiles", path: "/network/startup-profiles" },
        { label: "Angel / VC / Investor Profiles", path: "/network/investor-profiles" },
      ],
    },
    {
      label: "PORTFOLIOS",
      path: "/portfolios",
      dropdownItems: [
        { label: "Incubator Portfolios", path: "/portfolios/incubators" },
        { label: "Startup Portfolios", path: "/portfolios/startups" },
      ],
    },
    { label: "CONTACT US", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "success");
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isPathActive = (item: typeof navConfig[number]) => {
    if (item.path === "/") {
      return location.pathname === "/";
    }
    if (item.dropdownItems) {
      return item.dropdownItems.some((sub) => location.pathname === sub.path.split("?")[0]);
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
        setSettingsSubmenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      showToast(err.message || "Invalid account credentials entered.", "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const profileLinks = [
    { label: "Dashboard", path: "/startup/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Connections", path: "/startup/connections", icon: <Users className="w-4 h-4" /> },
    { label: "Notifications", path: "/startup/notifications", icon: <Bell className="w-4 h-4" /> },
  ];

  const settingsLinks = [
    { label: "Privacy Settings", path: "/startup/settings#privacy", icon: <Settings className="w-3.5 h-3.5" /> },
    { label: "Change Email ID", path: "/startup/settings#email", icon: <Settings className="w-3.5 h-3.5" /> },
    { label: "Change Password", path: "/startup/settings#password", icon: <Settings className="w-3.5 h-3.5" /> },
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
    else if (regPassword.length < 6) errs.password = "Minimum 6 characters.";

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
          registeredAt: Date.now(),
        },
      });

      localStorage.setItem("bsi_temp_registration", JSON.stringify({
        name: regName,
        email: regEmail,
        mobile: regMobile,
        startupId: response.startupId,
        timestamp: Date.now()
      }));
      showToast("Registration initiated! Please verify your email.", "success");
      setShowLoginModal(false);
      
      setRegName("");
      setRegEmail("");
      setRegMobile("");
      setRegPassword("");

      navigate(`/verify-otp?email=${encodeURIComponent(regEmail)}`);
    } catch {
      showToast("Registration failed. Please try again.", "error");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col z-50 sticky top-0" id="main-navbar-container">
      {/* Primary White Navbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm relative h-20 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo on Left: Yellow bulb logo + text */}
          <Link to="/" className="flex items-center gap-3 shrink-0" id="navbar-logo">
            {/* SVG Yellow Light Bulb Logo */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="45" r="28" fill="#FFF9C4" opacity="0.6" />
                <path
                  d="M 50 15 C 33.4 15 20 28.4 20 45 C 20 54.3 24.3 62.6 31 68 L 31 79 C 31 81.2 32.8 83 35 83 L 65 83 C 67.2 83 69 81.2 69 79 L 69 68 C 75.7 62.6 80 54.3 80 45 C 80 28.4 66.6 15 50 15 Z"
                  fill="#FDD835"
                />
                <circle cx="50" cy="45" r="12" fill="none" stroke="#0B2A5B" strokeWidth="2.5" />
                <line x1="50" y1="33" x2="50" y2="57" stroke="#0B2A5B" strokeWidth="1.5" />
                <line x1="38" y1="45" x2="62" y2="45" stroke="#0B2A5B" strokeWidth="1.5" />
                <line x1="41.5" y1="36.5" x2="58.5" y2="53.5" stroke="#0B2A5B" strokeWidth="1" />
                <line x1="41.5" y1="53.5" x2="58.5" y2="36.5" stroke="#0B2A5B" strokeWidth="1" />
                <path d="M 38 65 L 50 53 L 62 65" stroke="#E65100" strokeWidth="3" fill="none" />
                <rect x="37" y="83" width="26" height="5" rx="1.5" fill="#90A4AE" />
                <rect x="39" y="89" width="22" height="5" rx="1.5" fill="#78909C" />
                <path d="M 43 94 L 57 94 L 50 99 Z" fill="#37474F" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF6B00] rounded-full border border-white flex items-center justify-center">
                <span className="text-[6px] text-white font-bold">★</span>
              </div>
            </div>
            {/* Text logo brand */}
            <div className="flex flex-col leading-tight select-none">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">DPIIT | Govt of India</span>
              <span className="text-lg font-black text-[#0B2A5B] tracking-tight block">BHASKAR</span>
              <div className="text-[8.5px] font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                <span className="text-[#FF6B00]">SEED</span>
                <span className="text-[#0B2A5B]">FUND</span>
                <span className="text-[#0B2A5B]">SCHEME</span>
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 h-full" id="desktop-nav">
            {navConfig.map((item) => {
              const active = isPathActive(item);
              if (item.dropdownItems) {
                return (
                  <div key={item.label} className="relative group h-full flex items-center">
                    <button
                      className={`text-[12px] font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors relative py-2 ${
                        active ? "text-[#FF6B00]" : "text-[#0B2A5B] hover:text-[#FF6B00]"
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
                          className={`block px-3 py-2 text-[11px] font-bold rounded transition-colors ${
                            location.pathname === sub.path.split("?")[0]
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
                  className={`text-[12px] font-extrabold uppercase tracking-wider relative py-2 transition-colors ${
                    active ? "text-[#FF6B00]" : "text-[#0B2A5B] hover:text-[#FF6B00]"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00]"></div>
                  )}
                </Link>
              );
            })}

            {/* Globe Language Link */}
            <div className="relative group h-full flex items-center">
              <button className="text-[#0B2A5B] hover:text-[#FF6B00] py-2 relative">
                <Globe className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-[70%] hidden group-hover:block w-32 bg-white rounded-lg shadow-lg border border-slate-155 p-1.5 z-[100]">
                <button
                  onClick={() => showToast("Language changed to English.", "info")}
                  className="block w-full text-left px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 rounded"
                >
                  English
                </button>
                <button
                  onClick={() => showToast("भाषा बदलकर हिंदी की गई।", "info")}
                  className="block w-full text-left px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 rounded"
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>
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
                      className="px-5 py-2.5 bg-[#FCD34D] hover:bg-[#FBBF24] text-[#0B2A5B] font-extrabold text-[11.5px] uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center gap-1.5 active:scale-97"
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
                      className="px-5 py-2.5 bg-[#FCD34D] hover:bg-[#FBBF24] text-[#0B2A5B] font-extrabold text-[11.5px] uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center gap-1.5 active:scale-97"
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
                              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${
                                location.pathname === item.path
                                  ? "bg-slate-50 text-[#0B2A5B]"
                                  : "text-slate-700 hover:bg-slate-50 hover:text-[#0B2A5B]"
                              }`}
                            >
                              <span className="text-slate-400">{item.icon}</span>
                              <span>{item.label}</span>
                            </Link>
                          ))}
                          <button
                            type="button"
                            onClick={() => setSettingsSubmenuOpen((prev) => !prev)}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors ${
                              location.pathname.startsWith("/startup/settings")
                                ? "bg-slate-50 text-[#0B2A5B]"
                                : "text-slate-700 hover:bg-slate-50 hover:text-[#0B2A5B]"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <Settings className="w-4 h-4 text-slate-400" />
                              <span>Settings</span>
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${settingsSubmenuOpen ? "rotate-180" : ""}`} />
                          </button>
                          {settingsSubmenuOpen && (
                            <div className="bg-slate-50/80 border-t border-slate-100">
                              {settingsLinks.map((item) => (
                                <Link
                                  key={item.path}
                                  to={item.path}
                                  onClick={() => {
                                    setProfileMenuOpen(false);
                                    setSettingsSubmenuOpen(false);
                                  }}
                                  className="flex items-center gap-3 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-[#0B2A5B] hover:bg-white border-t border-slate-100"
                                >
                                  <span className="text-slate-400">{item.icon}</span>
                                  <span>{item.label}</span>
                                </Link>
                              ))}
                            </div>
                          )}
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
                {/* Solid Yellow REGISTER Button opens the registration route */}
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-[#FCD34D] hover:bg-[#FBBF24] text-[#0B2A5B] font-extrabold text-[11.5px] uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center gap-1.5 active:scale-97"
                  id="nav-register-btn"
                >
                  <Award className="w-3.5 h-3.5 text-[#0B2A5B]" />
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
                      className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                        active
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
                  className={`block px-3 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    active
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
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#0B2A5B] bg-[#FCD34D] rounded-full text-center"
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
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#0B2A5B] bg-[#FCD34D] rounded-full text-center cursor-pointer"
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-3xl w-full flex flex-col md:flex-row overflow-hidden relative min-h-[460px] animate-in zoom-in-95 duration-200">
            
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
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-[#1E293B] tracking-tight">LOGIN</h2>
                    <p className="text-[10px] text-slate-500 font-bold leading-normal">
                      You can also access your account using your Startup India credentials.
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Please enter your email address"
                        className={`w-full px-3 py-2.5 border rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#F05A28] ${
                          loginErrors.email ? "border-red-500 bg-red-50/10" : "border-slate-300"
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
                          className={`w-full px-3 py-2.5 border rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#F05A28] pr-10 ${
                            loginErrors.password ? "border-red-500 bg-red-50/10" : "border-slate-300"
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

                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        Admin: admin@startupindia.gov.in / admin@123
                      </span>
                      <button
                        type="button"
                        onClick={() => showToast("Password restoration parameters set to email.", "info")}
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
                      {loginLoading ? "Authenticating..." : "Login"}
                    </button>
                  </form>

                  <div className="text-center text-[10px] font-bold text-slate-405 flex items-center justify-center gap-2">
                    <span className="h-[1px] bg-slate-200 flex-1"></span>
                    <span>Login with others</span>
                    <span className="h-[1px] bg-slate-200 flex-1"></span>
                  </div>

                  <button
                    onClick={() => {
                      showToast("Google SSO session connected successfully.", "info");
                    }}
                    className="w-full py-2 border border-slate-250 hover:bg-slate-50 rounded-lg text-xs font-extrabold text-[#1E293B] flex items-center justify-center gap-2 cursor-pointer shadow-xs bg-white"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    <span>Login with Google</span>
                  </button>
                </div>
              </div>
            ) : (
              // Registration Form Left side
              <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col justify-between bg-white min-h-[380px] overflow-y-auto max-h-[90vh]">
                <div className="space-y-4 z-10 w-full">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-[#1E293B] tracking-tight">REGISTER</h2>
                    <p className="text-[10px] text-slate-500 font-bold leading-normal">
                      Configure your secure founder profile to file scheme applications.
                    </p>
                  </div>

                  <form onSubmit={handleRegSubmit} className="space-y-2.5">
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Full Name"
                        className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#F05A28] ${
                          regErrors.name ? "border-red-500 bg-red-50/10" : "border-slate-300"
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
                        className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#F05A28] ${
                          regErrors.email ? "border-red-500 bg-red-50/10" : "border-slate-300"
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
                        className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#F05A28] ${
                          regErrors.mobile ? "border-red-500 bg-red-50/10" : "border-slate-300"
                        }`}
                      />
                      {regErrors.mobile && (
                        <p className="text-red-500 text-[9px] font-bold">⚠ {regErrors.mobile}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Choose Security Password (Min 6 chars)"
                        className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#F05A28] ${
                          regErrors.password ? "border-red-500 bg-red-50/10" : "border-slate-300"
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
                </div>
              </div>
            )}

            {/* RIGHT COLUMN: Soft yellow brand info box with gold borders */}
            <div className="w-full md:w-2/5 p-6 sm:p-8 bg-[#FFFDF4] border-t md:border-t-0 md:border-l border-[#FCD34D]/40 flex flex-col justify-between items-center text-center gap-6">
              
              {/* BHASKAR brand stack */}
              <div className="space-y-3 w-full">
                <svg viewBox="0 0 200 100" className="h-14 mx-auto drop-shadow-xs">
                  <path
                    d="M40,10 C15,10 10,35 10,60 C10,85 30,90 50,90 C70,90 85,75 85,50 C85,25 70,10 50,10"
                    fill="none"
                    stroke="#1B5E20"
                    strokeWidth="11"
                    strokeLinecap="round"
                  />
                  <rect x="50" y="28" width="45" height="9" fill="#FF9933" rx="2" />
                  <rect x="50" y="44" width="55" height="9" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="1" rx="2" />
                  <rect x="50" y="60" width="50" height="9" fill="#128807" rx="2" />
                  <circle cx="77" cy="48" r="4.5" fill="none" stroke="#000088" strokeWidth="1.2" />
                </svg>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Welcome to</span>
                  <h3 className="text-base font-black text-[#1E293B]">BHASKAR</h3>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono block leading-tight">
                    Bharat Startup Knowledge Access Registry
                  </span>
                  <p className="text-[9px] text-[#F05A28] font-extrabold tracking-wide pt-1">
                    Innovate. Connect. Thrive.
                  </p>
                  <span className="text-[7.5px] text-slate-400 font-bold uppercase block tracking-wider">
                    A Startup India Initiative
                  </span>
                </div>
              </div>

              {/* Action Box to switch modalMode */}
              <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-sm w-full max-w-[210px] z-10">
                {modalMode === "login" ? (
                  <>
                    <p className="text-[10px] font-bold text-slate-500">Don't have an account?</p>
                    <button
                      onClick={() => {
                        setModalMode("register");
                        setRegErrors({});
                      }}
                      className="text-xs font-black text-[#F05A28] hover:underline cursor-pointer block mt-1 mx-auto"
                    >
                      Register Now
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-bold text-slate-500">Already registered?</p>
                    <button
                      onClick={() => {
                        setModalMode("login");
                        setLoginErrors({});
                      }}
                      className="text-xs font-black text-[#F05A28] hover:underline cursor-pointer block mt-1 mx-auto"
                    >
                      Login Now
                    </button>
                  </>
                )}
              </div>

              {/* DPIIT logo bottom panel */}
              <div className="w-full border-t border-[#FCD34D]/25 pt-4">
                <svg viewBox="0 0 240 60" className="h-9 mx-auto opacity-80">
                  <path d="M15,40 C15,20 35,20 35,40 Z" fill="#78909C" />
                  <rect x="22" y="40" width="6" height="15" fill="#546E7A" />
                  <rect x="15" y="52" width="20" height="4" fill="#37474F" />
                  <text x="45" y="30" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#37474F">DPIIT</text>
                  <text x="45" y="46" fontFamily="sans-serif" fontSize="10.5" fontWeight="bold" fill="#1B5E20">#startupindia</text>
                </svg>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
