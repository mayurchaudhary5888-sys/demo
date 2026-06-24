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
  Connection,
  ApplicationStatus,
} from "../types";
import { authApi } from "../services/authApi";
import { contentApi } from "../services/contentApi";

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
  isOnboarded?: boolean;
  dept?: string;
}

// ── Context value shape ──
interface AppContextValue {
  // State
  user: UserSession | null;
  startups: StartupProfile[];
  programs: Program[];
  applications: Application[];
  connections: Connection[];
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
  applyToProgram: (data: any) => Promise<void>;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, remarks?: string) => void;
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

  const [connections, setConnections] = useState<Connection[]>([]);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Persist helpers ──
  useEffect(() => {
    const hydrate = async () => {
      try {
        const [remoteStartups, remotePrograms, remoteApplications, remoteQueries, remoteConnections] = await Promise.all([
          contentApi.getStartups(),
          contentApi.getPrograms(),
          contentApi.getApplications(),
          contentApi.getQueries(),
          contentApi.getConnections().catch(() => []),
        ]);

        setStartups(remoteStartups);
        setPrograms(remotePrograms);
        setApplications(remoteApplications);
        setQueries(remoteQueries);
        setConnections(remoteConnections as Connection[]);
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
      const profile = (response.startupProfile || tempReg.startupProfile) as any;
      const startupProfile: StartupProfile = {
        id: response.user.startupId || tempReg.startupId || profile.id || `startup-${Date.now()}`,
        name: profile.startupName || response.user.name || tempReg.name || "Founder Startup",
        logoUrl: profile.logoPreview || undefined,
        stage: profile.stage || "Validation",
        fundingType: profile.fundingStatus || "Bootstrapped",
        description: profile.startupBrief || "Registered through BHASKAR Startup India.",
        email: response.user.email,
        mobile: profile.mobile || tempReg.mobile || "",
        state: profile.state || "Other",
        city: profile.city || "",
        website: profile.website || undefined,
        appLink: profile.appLink || undefined,
        sector: profile.sector || "Other",
        startupType: profile.industry || profile.nature || "Other",
        isDpiitRecognized: Boolean(profile.cin),
        dpiitNumber: profile.cin || undefined,
        isMsmeRegistered: Boolean(profile.udhyogAadhaar),
        msmeNumber: profile.udhyogAadhaar || undefined,
        interestedPrograms: profile.interests || [],
        supportRequired: profile.services || [],
        isApproved: false,
        registrationDate: new Date().toISOString().split("T")[0],
      };

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
      const created = await contentApi.submitApplication({
        programId: data.programId,
        programName: data.programName,
        startupId: data.startupId,
        startupName: data.startupName,
        problemStatement: data.problemStatement,
        solutionDescription: data.solutionDescription,
        currentStage: data.currentStage,
        teamSize: data.teamSize,
        fundingStatus: data.fundingStatus,
        pitchDeckName: data.pitchDeckName || "PitchDeck.pdf",
        additionalDocumentsName: data.additionalDocumentsName,
      });

      setApplications((prev) => [created as unknown as Application, ...prev]);
      showToast(`Application ${(created as any).id} submitted successfully to ${data.programName}!`, "success");
    },
    [showToast]
  );

  const updateApplicationStatus = useCallback(
    (appId: string, status: ApplicationStatus, remarks?: string) => {
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
      contentApi.updateApplicationStatus(appId, { status, remarks }).catch(() => {});
    },
    []
  );

  const value: AppContextValue = {
    user,
    startups,
    programs,
    applications,
    connections,
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
