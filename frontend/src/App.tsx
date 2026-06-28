/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { AppProvider, useAppState } from "./context/AppContext";

import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { ToastContainer } from "./components/common/ToastContainer";

// Public Pages
const Home = lazy(() => import("./pages/public/Home").then((mod) => ({ default: mod.Home })));
const AboutUs = lazy(() => import("./pages/public/about-us/AboutUs").then((mod) => ({ default: mod.AboutUs })));
const InformationCenter = lazy(() => import("./pages/public/InformationCenter").then((mod) => ({ default: mod.InformationCenter })));
const StartupProfiles = lazy(() => import("./pages/public/network/startup-profiles/StartupProfiles").then((mod) => ({ default: mod.StartupProfiles })));
const InvestorProfiles = lazy(() => import("./pages/public/network/investor-profiles/InvestorProfiles").then((mod) => ({ default: mod.InvestorProfiles })));
const ProgramsListing = lazy(() => import("./pages/public/ProgramsListing").then((mod) => ({ default: mod.ProgramsListing })));
const ProgramInfoPage = lazy(() => import("./pages/public/ProgramInfoPage").then((mod) => ({ default: mod.ProgramInfoPage })));
const ProgramDetail = lazy(() => import("./pages/public/ProgramDetail").then((mod) => ({ default: mod.ProgramDetail })));
const ContactUs = lazy(() => import("./pages/public/ContactUs").then((mod) => ({ default: mod.ContactUs })));
const PortfolioIndex = lazy(() => import("./pages/public/portfolio/PortfolioIndex").then((mod) => ({ default: mod.PortfolioIndex })));
const IncubatorPortfolio = lazy(() => import("./pages/public/portfolio/IncubatorPortfolio").then((mod) => ({ default: mod.IncubatorPortfolio })));
const StartupPortfolio = lazy(() => import("./pages/public/portfolio/StartupPortfolio").then((mod) => ({ default: mod.StartupPortfolio })));

const Register = lazy(() => import("./pages/auth/Register").then((mod) => ({ default: mod.Register })));
const VerifyOtp = lazy(() => import("./pages/auth/VerifyOtp").then((mod) => ({ default: mod.VerifyOtp })));

// Startup Dashboard Pages
const StartupDashboard = lazy(() => import("./pages/startup/StartupDashboard").then((mod) => ({ default: mod.StartupDashboard })));
const MyConnections = lazy(() => import("./pages/startup/MyConnections").then((mod) => ({ default: mod.MyConnections })));
const Notifications = lazy(() => import("./pages/startup/Notifications").then((mod) => ({ default: mod.Notifications })));
const Settings = lazy(() => import("./pages/startup/Settings").then((mod) => ({ default: mod.Settings })));

// Admin Settings
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then((mod) => ({ default: mod.AdminDashboard })));
const AdminUserManagement = lazy(() => import("./pages/admin/AdminUserManagement").then((mod) => ({ default: mod.AdminUserManagement })));
const AdminStartupManagement = lazy(() => import("./pages/admin/AdminStartupManagement").then((mod) => ({ default: mod.AdminStartupManagement })));
const AdminApplicationManagement = lazy(() => import("./pages/admin/AdminApplicationManagement").then((mod) => ({ default: mod.AdminApplicationManagement })));
const AdminProgramManagement = lazy(() => import("./pages/admin/AdminProgramManagement").then((mod) => ({ default: mod.AdminProgramManagement })));

// Inner Layout wrappers
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout").then((mod) => ({ default: mod.DashboardLayout })));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout").then((mod) => ({ default: mod.AdminLayout })));

// ROLE PROTECTION DECORATORS
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppState();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppState();
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const LegacyProgramRedirect: React.FC<{ apply?: boolean }> = ({ apply = false }) => {
  const { id, slug } = useParams();
  const programId = id || slug;
  return <Navigate to={programId ? `/support/${programId}${apply ? "/apply" : ""}` : "/support"} replace />;
};

// Main Routing Router Node
const AppContent: React.FC = () => {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/startup") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/verify-otp");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900" id="app-root-wrapper">
      {/* Primary Navigation Bar */}
      <Navbar />

      {/* Skip to Main Content target */}
      <main className="relative flex-grow" id="main-content">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center text-sm font-medium text-slate-500">
              Loading...
            </div>
          }
        >
          <Routes>
            {/* Public Channels */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/about" element={<Navigate to="/about-us" replace />} />
            <Route path="/information-center" element={<InformationCenter />} />
            <Route path="/info-center" element={<Navigate to="/information-center" replace />} />
            <Route path="/network" element={<Navigate to="/network/startup-profiles" replace />} />
            <Route path="/network/startup-profiles" element={<StartupProfiles />} />
            <Route path="/network/investor-profiles" element={<InvestorProfiles />} />
            <Route path="/investors" element={<Navigate to="/network/investor-profiles" replace />} />
            <Route path="/support" element={<ProgramsListing />} />
            <Route path="/support/:id/apply" element={<ProgramDetail />} />
            <Route path="/support/:slug" element={<ProgramInfoPage />} />
            <Route path="/programs" element={<Navigate to="/support" replace />} />
            <Route path="/programs/:id/apply" element={<LegacyProgramRedirect apply />} />
            <Route path="/programs/:slug" element={<LegacyProgramRedirect />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
            <Route path="/portfolio" element={<PortfolioIndex />} />
            <Route path="/portfolio/incubators" element={<IncubatorPortfolio />} />
            <Route path="/portfolio/startups" element={<StartupPortfolio />} />
            <Route path="/portfolios" element={<Navigate to="/portfolio" replace />} />
            <Route path="/portfolios/incubators" element={<Navigate to="/portfolio/incubators" replace />} />
            <Route path="/portfolios/startups" element={<Navigate to="/portfolio/startups" replace />} />

            {/* Auth Channels */}
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* Backward-compatible onboarding redirect */}
            <Route path="/startup/onboarding" element={<Navigate to="/startup/dashboard" replace />} />

            {/* Nested tab layout wrapper for Founders Dashboard */}
            <Route 
              path="/startup" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<StartupDashboard />} />
              <Route path="connections" element={<MyConnections />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Nested sidebar layout wrapper for ministerial ADMIN console */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
            <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUserManagement />} />
              <Route path="startups" element={<AdminStartupManagement />} />
              <Route path="applications" element={<AdminApplicationManagement />} />
              <Route path="programs" element={<AdminProgramManagement />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* 3. Central Footer Area */}
      {!hideFooter && <Footer />}

      {/* Toasts alert visual HUD overlay */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
