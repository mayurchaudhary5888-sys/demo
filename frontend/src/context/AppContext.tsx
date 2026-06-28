/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  StartupProfile,
  Program,
  Application,
  ContactQuery,
  ApplicationStatus,
} from "../types";
import { authApi } from "../services/authApi";
import { contentApi } from "../services/contentApi";
import { normalizeStartupProfile } from "../pages/startup/utils/normalizeStartupProfile";

// ── Toast type ──
interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error" | "warning";
}

// ── User session shape ──
interface UserSession {
  email: string;
  role: "admin" | "founder" | string;
  name: string;
  startupId?: string | null;
  selectedProgram?: string | null;
  isOnboarded?: boolean;
  dept?: string;
  isActive?: boolean;
}

// ── Context value shape ──
interface AppContextValue {
  // State
  user: UserSession | null;
  startups: StartupProfile[];
  programs: Program[];
  applications: Application[];
  queries: ContactQuery[];
  toasts: Toast[];

  // Auth actions
  login: (email: string, password: string) => Promise<UserSession>;
  logout: () => void;
  verifyOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  verifyUserEmail: (otp: string) => Promise<void>;

  // Toast actions
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;

  // Admin actions
  toggleStartupApproval: (startupId: string) => void;
  updateStartupProfile: (startupId: string, updates: Partial<StartupProfile>) => Promise<void>;
  toggleProgramStatus: (programId: string) => void;
  addProgram: (program: any) => void;

  // Application actions
  applyToProgram: (data: any) => Promise<Application>;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, remarks?: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ── Provider ──
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hydrate from localStorage or use mock defaults
  const [user, setUser] = useState<UserSession | null>(() => {
    const raw = localStorage.getItem("bsi_session");
    return raw ? JSON.parse(raw) : null;
  });

  const [startups, setStartups] = useState<StartupProfile[]>(() => {
    return [];
  });

  const [programs, setPrograms] = useState<Program[]>(() => {
    return [];
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    return [];
  });

  const [queries, setQueries] = useState<ContactQuery[]>(() => {
    return [];
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Persist helpers ──
  useEffect(() => {
    const hydrate = async () => {
      try {
        const [remoteStartups, remotePrograms, remoteApplications, remoteQueries] = await Promise.all([
          contentApi.getStartups(),
          contentApi.getPrograms(),
          contentApi.getApplications(),
          contentApi.getQueries(),
        ]);

        setStartups(remoteStartups.map((profile) => normalizeStartupProfile(profile as Record<string, unknown>)));
        setPrograms(remotePrograms);
        setApplications(remoteApplications);
        setQueries(remoteQueries);
      } catch {
        // Backend is the source of truth; remain empty if the API is unavailable.
      }
    };

    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Toast helpers ──
  const showToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    // Auto-dismiss after 4s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Auth actions ──
  const login = useCallback(async (email: string, password: string): Promise<UserSession> => {
    const response = await authApi.login({ email, password });
    localStorage.setItem("bsi_auth_token", response.token);
    localStorage.setItem("bsi_session", JSON.stringify(response.user));
    setUser(response.user);
    if (response.startupProfile) {
      const startupProfile = normalizeStartupProfile(response.startupProfile);
      setStartups((prev) => {
        const exists = prev.some((item) => item.id === startupProfile.id || item.email === startupProfile.email);
        if (exists) {
          return prev.map((item) =>
            item.id === startupProfile.id || item.email === startupProfile.email ? { ...item, ...startupProfile } : item
          );
        }
        return [startupProfile, ...prev];
      });
    }
    return response.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("bsi_session");
    localStorage.removeItem("bsi_auth_token");
    setUser(null);
  }, []);

  const verifyOtp = useCallback(async (otp: string) => {
    const tempReg = JSON.parse(localStorage.getItem("bsi_temp_registration") || "{}");
    const email = tempReg.email;
    if (!email) {
      throw new Error("Registration email not found. Please register again.");
    }

    const response = await authApi.verifyOtp({ email, otp });
    localStorage.setItem("bsi_auth_token", response.token);
    localStorage.setItem("bsi_session", JSON.stringify(response.user));

    if (response.startupProfile || tempReg.startupProfile) {
      const profile = (response.startupProfile || tempReg.startupProfile) as Record<string, unknown>;
      const startupProfile: StartupProfile = normalizeStartupProfile({
        ...profile,
        id: response.user.startupId || tempReg.startupId || profile.id || `startup-${Date.now()}`,
        email: response.user.email || tempReg.email || profile.email,
        mobile: tempReg.mobile || profile.mobile,
        founderName: response.user.name || tempReg.name,
      });

      setStartups((prev) => {
        const exists = prev.some((item) => item.id === startupProfile.id || item.email === startupProfile.email);
        if (exists) {
          return prev.map((item) =>
            item.id === startupProfile.id || item.email === startupProfile.email ? { ...item, ...startupProfile } : item
          );
        }
        return [startupProfile, ...prev];
      });

      try {
        await contentApi.submitStartup(startupProfile as unknown as Record<string, unknown>);
      } catch {
        // Local state already reflects the new profile; backend sync can retry later.
      }
    }

    setUser(response.user);
  }, []);

  const resendOtp = useCallback(async () => {
    const tempReg = JSON.parse(localStorage.getItem("bsi_temp_registration") || "{}");
    const email = tempReg.email;
    if (!email) {
      throw new Error("Registration email not found. Please register again.");
    }

    await authApi.resendOtp({ email });
  }, []);

  // ── Admin actions ──
  const toggleStartupApproval = useCallback((startupId: string) => {
    setStartups((prev) => prev.map((s) => (s.id === startupId ? { ...s, isApproved: !s.isApproved } : s)));
    contentApi.toggleStartupApproval(startupId).catch(() => {});
  }, []);

  const updateStartupProfile = useCallback(async (startupId: string, updates: Partial<StartupProfile>) => {
    setStartups((prev) => prev.map((s) => (s.id === startupId ? { ...s, ...updates } : s)));
    await contentApi.updateStartup(startupId, updates as Record<string, unknown>);
  }, []);

  const toggleProgramStatus = useCallback((programId: string) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === programId ? { ...p, isOpen: !p.isOpen, isActive: !(p as any).isActive } as any : p))
    );
    contentApi.toggleProgramStatus(programId).catch(() => {});
  }, []);

  const addProgram = useCallback((program: any) => {
    const newProg: Program = {
      id: program.id || `prog-${Date.now()}`,
      name: program.name,
      shortDescription: program.description || "",
      longDescription: program.description || "",
      benefits: program.benefits || [],
      eligibility: program.eligibility || [],
      requiredDocuments: program.documentsRequired || [],
      processSteps: [],
      isOpen: program.isActive ?? true,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      iconName: "Award",
    };
    // Attach extra "isActive" for AdminProgramManagement compatibility
    (newProg as any).isActive = program.isActive ?? true;
    (newProg as any).description = program.description || "";

    setPrograms((prev) => [newProg, ...prev]);
    contentApi.addProgram(newProg as unknown as Record<string, unknown>).catch(() => {});
  }, []);

  // ── Application action ──
  const applyToProgram = useCallback(
    async (data: any) => {
      try {
        if (user?.role !== "admin" && user?.isActive === false) {
          throw new Error("Your profile is under review. Please try again later.");
        }
        const startupId = data.startupId || user?.startupId;
        if (user?.role !== "admin" && (!startupId || startupId === "temp-id" || String(startupId).startsWith("temp-"))) {
          throw new Error("Your startup profile is missing. Please complete registration before applying.");
        }
        const created = await contentApi.submitApplication({
          ...data,
          programId: data.programId,
          programName: data.programName,
          startupId,
          startupName: data.startupName,
          selectedProgram: user?.selectedProgram || data.selectedProgram || data.programId,
          submittedByEmail: user?.email || data.submittedByEmail,
          submittedByName: user?.name || data.submittedByName,
          problemStatement: data.problemStatement,
          solutionDescription: data.solutionDescription,
          currentStage: data.currentStage,
          teamSize: data.teamSize,
          fundingStatus: data.fundingStatus,
          pitchDeckName: data.pitchDeckName || "PitchDeck.pdf",
          additionalDocumentsName: data.additionalDocumentsName,
        });

        setApplications((prev) => [created as unknown as Application, ...prev]);
        return created as Application;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to submit application.";
        showToast(message, "error");
        throw error;
      }
    },
    [showToast, user]
  );

  const updateApplicationStatus = useCallback(
    async (appId: string, status: ApplicationStatus, remarks?: string) => {
      try {
        await contentApi.updateApplicationStatus(appId, { status, remarks });
        setApplications((prev) =>
          prev.map((app) => {
            if (app.id === appId) {
              const updatedTimeline = [
                {
                  status,
                  timestamp: new Date().toLocaleString(),
                  remarks: remarks || `Status updated to ${status}.`,
                },
                ...app.timeline,
              ];
              return {
                ...app,
                status,
                lastUpdated: new Date().toISOString().split("T")[0],
                adminRemarks: remarks || app.adminRemarks,
                timeline: updatedTimeline,
              };
            }
            return app;
          })
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update application status.";
        showToast(message, "error");
      }
    },
    [showToast]
  );

  const value: AppContextValue = {
    user,
    startups,
    programs,
    applications,
    queries,
    toasts,
    login,
    logout,
    verifyOtp,
    resendOtp,
    verifyUserEmail: verifyOtp,
    showToast,
    removeToast,
    toggleStartupApproval,
    updateStartupProfile,
    toggleProgramStatus,
    addProgram,
    applyToProgram,
    updateApplicationStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ── Hook ──
export const useAppState = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return ctx;
};
