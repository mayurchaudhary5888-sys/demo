# 📄 07-connection-integration.md (Frontend-Backend Connection)

Is document me hum yeh dekhenge ki **Frontend (React Client)** aur **Backend (Express API Server)** aapas me kaise communicate karte hain aur unka security hand-shake kaise kaam karta hai.

---

## 🌐 1. Base URL Configuration

Frontend me API endpoints call karne ke liye `VITE_API_BASE_URL` configure kiya jata hai.
- **Development**: Environment parameters me default address `http://localhost:5000/api` define hota hai.
- **Production**: Deploy hone par production domain url (jaise Vercel or custom server address) `.env` file me set kiya jata hai:
  ```env
  VITE_API_BASE_URL=https://api.bhaskar-startupindia.gov.in/api
  ```

Vite client files me is variable ko access karne ke liye code is tarah likha jata hai:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
```

---

## 🔑 2. LocalStorage & Session Maintenance

Authentication state aur user info client browser me persist karne ke liye hum teen primary LocalStorage keys use karte hain:

1. **`bsi_auth_token`**: Isme backend se mila JWT (Json Web Token) secure string save hoti hai.
2. **`bsi_session`**: Isme current user ke state details (email, role, startupId, name) stringify JSON format me save hote hain.
3. **`bsi_temp_registration`**: Multi-step registration complete hone aur OTP screen redirect ke dauran user fields ko temporary local hold dene ke liye iska use hota hai. OTP verify hone par is data se backend database update karke ise remove kar diya jata hai.

---

## 📡 3. The Custom API Request Wrappers

Frontend me raw `fetch()` calls bar-bar likhne se bachne aur standard request validation apply karne ke liye custom handlers design kiye gaye hain:

### A. Token Injection & Error Interceptor (`authApi.ts`)
```typescript
const request = async <T>(path: string, options: RequestInit): Promise<ApiResponse<T>> => {
  // 1. Get token from LocalStorage
  const token = localStorage.getItem("bsi_auth_token");
  
  // 2. Set headers automatically
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Authorization Bearer format
      ...options.headers,
    },
  });

  // 3. Process response and capture HTTP status errors
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed. Please try again.");
  }

  return data;
};
```

### B. The Unwrap Filter (`contentApi.ts`)
Backend standard content responses ko `{ success: true, data: [...] }` envelope structure me return karta hai. Frontend UI components me directly clean list populate karne ke liye unwrap filter call pass kiya jata hai:
```typescript
const unwrap = async <T>(promise: Promise<ApiResponse<T>>) => {
  const response = await promise;
  return response.data; // Extracts only the database models payload
};

// Usage Example:
getStartups: () => unwrap(request<any[]>("/startups")),
```

---

## 🛡️ 4. CORS & Cookie Policy Settings on Backend

Frontend request security check handle karne ke liye Express app me cors middleware configurations use ki gayi hain (`backend/src/middleware/security.js`):

```javascript
import cors from "cors";

export const securityMiddleware = [
  helmet(),
  cors({
    origin: env.clientOrigin, // Client origin (e.g. http://localhost:3000)
    credentials: true,       // Allow secure cookies transmission
  }),
];
```

### Key parameters:
- **`origin`**: Server sirf usi source client applications se incoming AJAX/Fetch request process karega jiska address `env.clientOrigin` ke barabar ho. Baaki random domains queries automatic block ho jayengi.
- **`credentials`**: Yeh configuration authorization headers aur sessions validation cookies parameters ko cross-origin network operations me seamlessly allow karti hai.
