const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  // Use relative "/api" when running on a deployed domain; localhost uses the dev backend.
  const isLocal = typeof window !== "undefined" && /^localhost$|^127\./.test(window.location.hostname);
  return isLocal ? "http://localhost:5000/api" : "/api";
};

const API_BASE_URL = getApiBaseUrl();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableNetworkError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return /Failed to fetch|NetworkError|ERR_NETWORK_CHANGED|Load failed/i.test(message);
};

type ApiResponse<T> = T & {
  success: boolean;
  message?: string;
};

const request = async <T>(path: string, options: RequestInit): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem("bsi_auth_token");
  const requestInit: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
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
    throw new Error(data.message || "Request failed. Please try again.");
  }

  return data;
};

export type AuthSession = {
  email: string;
  role: "admin" | "founder" | string;
  name: string;
  startupId?: string | null;
  selectedProgram?: string | null;
  isOnboarded?: boolean;
  dept?: string;
  isActive?: boolean;
};

export const authApi = {
  register: (payload: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    startupId?: string;
    selectedProgram: string;
    startupProfile?: Record<string, unknown>;
  }) =>
    request<{ email: string; startupId: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: AuthSession; startupProfile?: Record<string, unknown> }>("/auth/login", {
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

  forgotPassword: (payload: { email: string }) =>
    request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload: { email: string; otp: string; password?: string }) =>
    request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
