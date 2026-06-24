const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type ApiResponse<T> = T & {
  success: boolean;
  message?: string;
};

const request = async <T>(path: string, options: RequestInit): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem("bsi_auth_token");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed. Please try again.");
  }

  return data;
};

export type AuthSession = {
  email: string;
  role: "admin" | "founder" | string;
  name: string;
  startupId?: string | null;
  isOnboarded?: boolean;
  dept?: string;
};

export const authApi = {
  register: (payload: {
    name: string;
    email: string;
    mobile: string;
    password?: string;
    startupId?: string;
    startupProfile?: Record<string, unknown>;
  }) =>
    request<{ email: string; startupId: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: AuthSession }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyOtp: (payload: { email: string; otp: string }) =>
    request<{ token: string; user: AuthSession; startupProfile?: Record<string, unknown> }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resendOtp: (payload: { email: string }) =>
    request<{ email: string }>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
