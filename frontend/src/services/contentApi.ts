const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem("bsi_auth_token");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
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
};
