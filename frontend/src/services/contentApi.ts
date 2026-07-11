const getApiBaseUrl = () => {
  const isLocal = typeof window !== "undefined" && /^localhost$|^127\./.test(window.location.hostname);
  if (!isLocal) {
    return "/api";
  }
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableNetworkError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return /Failed to fetch|NetworkError|ERR_NETWORK_CHANGED|Load failed/i.test(message);
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem("bsi_auth_token");
  const requestInit: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  };

  let response: Response | null = null;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      response = await fetch(`${API_BASE_URL}${path}`, requestInit);
      lastError = null;
      break;
    } catch (error) {
      lastError = error;
      if (attempt === 1 || !isRetryableNetworkError(error)) {
        throw error;
      }
      await sleep(300 * (attempt + 1));
    }
  }

  if (!response) {
    throw lastError instanceof Error ? lastError : new Error("Request failed. Please try again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (data.message && data.message.includes("Something wrong happens")) {
      window.dispatchEvent(new CustomEvent("bsi:deactivated-account"));
    }
    throw new Error(data.message || "Request failed. Please try again.");
  }

  return data;
};

const unwrap = async <T>(promise: Promise<ApiResponse<T>>) => {
  const response = await promise;
  return response.data;
};

export const contentApi = {
  getPrograms: () => unwrap(request<any[]>("/programs")),
  getProgramById: (id: string) => unwrap(request<any>(`/programs/${id}`)),
  getStartups: () => unwrap(request<any[]>("/startups")),
  getUsers: () => unwrap(request<any[]>("/admin/users")),
  getInvestors: () => unwrap(request<any[]>("/investors")),
  getApplications: (startupId?: string) =>
    unwrap(request<any[]>(`/applications${startupId ? `?startupId=${encodeURIComponent(startupId)}` : ""}`)),
  getApplicationById: (id: string) => unwrap(request<any>(`/applications/${id}`)),
  getQueries: () => unwrap(request<any[]>("/queries")),
  getNotifications: () => unwrap(request<any[]>("/notifications")),
  getAdminStats: () => unwrap(request<any>("/admin/stats")),
  getFaqs: () => unwrap(request<any[]>("/faqs")),
  getAnnouncements: () => unwrap(request<any[]>("/announcements")),
  markAllNotificationsRead: () =>
    unwrap(request<any[]>("/notifications/mark-all-read", { method: "PATCH" })),
  submitStartup: (payload: Record<string, unknown>) =>
    unwrap(request<any>("/startups", { method: "POST", body: JSON.stringify(payload) })),
  updateStartup: (id: string, payload: Record<string, unknown>) =>
    unwrap(request<any>(`/startups/${id}`, { method: "PATCH", body: JSON.stringify(payload) })),
  toggleStartupApproval: (id: string) =>
    unwrap(request<any>(`/admin/startups/${id}/approval`, { method: "PATCH" })),
  updateUserStatus: (id: string, payload: Record<string, unknown>) =>
    unwrap(request<any>(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) })),
  addProgram: (payload: Record<string, unknown>) =>
    unwrap(request<any>("/admin/programs", { method: "POST", body: JSON.stringify(payload) })),
  toggleProgramStatus: (id: string) =>
    unwrap(request<any>(`/admin/programs/${id}/toggle`, { method: "PATCH" })),
  submitApplication: (payload: Record<string, unknown>) =>
    unwrap(request<any>("/applications", { method: "POST", body: JSON.stringify(payload) })),
  updateApplicationStatus: (id: string, payload: Record<string, unknown>) =>
    unwrap(request<any>(`/admin/applications/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) })),
  updateApplicationIncubatorStatus: (id: string, payload: { preferenceOrder: number; status?: string; completenessStatus?: string; comments?: string }) =>
    unwrap(request<any>(`/admin/applications/${id}/incubator-status`, { method: "PATCH", body: JSON.stringify(payload) })),
  createQuery: (payload: Record<string, unknown>) =>
    unwrap(request<any>("/queries", { method: "POST", body: JSON.stringify(payload) })),
  replyQuery: (id: string, reply: string) =>
    unwrap(request<any>(`/admin/queries/${id}/reply`, { method: "PATCH", body: JSON.stringify({ reply }) })),
  updateNotification: (id: string, payload: Record<string, unknown>) =>
    unwrap(request<any>(`/notifications/${id}`, { method: "PATCH", body: JSON.stringify(payload) })),
  deleteNotification: (id: string) =>
    unwrap(request<any>(`/notifications/${id}`, { method: "DELETE" })),
  uploadLogo: (payload: { imageData: string; filename?: string }) =>
    unwrap(request<{ secureUrl: string; publicId: string; width?: number; height?: number; format?: string }>("/uploads/logo", {
      method: "POST",
      body: JSON.stringify(payload),
    })),
  submitInvestorProfile: (payload: Record<string, unknown>) =>
    unwrap(request<any>("/investors", { method: "POST", body: JSON.stringify(payload) })),
};
