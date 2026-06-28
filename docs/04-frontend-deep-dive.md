# 📄 04-frontend-deep-dive.md (Frontend Source Deep Dive)

Is file me hum **frontend/src/** folder ke component tree, routing model, aur global state architecture ko Hinglish me details me explain karenge.

---

## 📂 Frontend File Structure

```text
frontend/src/
├── main.tsx              # Application index launcher
├── App.tsx               # Primary layout routing mapping & protectors
├── types.ts              # System static interface models
├── index.css             # Main styling, Tailwind directives & custom CSS variables
├── context/
│   └── AppContext.tsx    # State management provider
├── services/             # Axios/fetch network API wrappers
│   ├── authApi.ts
│   └── contentApi.ts
├── pages/                # Page views
│   ├── auth/             # Sign-up and verification
│   ├── startup/          # Founder portal controls
│   ├── admin/            # Nodal console screens
│   └── public/           # General information channels
└── components/
    ├── common/           # Shareable components (Navbar, Modals, Toasts)
    └── layout/           # Frame structures
```

---

## 📝 Detailed File Explanations

### 1. Root & Routing Config (`App.tsx`)
- **App Launcher**: `App.tsx` routes map karta hai aur code-splitting ke liye dynamic lazy loading (`lazy()`, `<Suspense>`) implements karta hai taaki start time load minimal rahe.
- **Route Protectors**:
  - `ProtectedRoute`: Logged-in startup user status check karta hai. Auth token na hone par home page (`/`) aur admin ko admin console par automatic redirect karta hai.
  - `AdminRoute`: Restricted route jahan non-admin users block hote hain.
  - `LegacyProgramRedirect`: `/programs/:slug` jaise purane support slugs ko `/support/:slug` par update (redirect) karta hai.
- **Header & Footer Render Flags**: Current path track karke login panels, register wizards aur dashboard views me main portal footer (`<Footer />`) auto-hide karta hai.

---

### 2. Context Provider (`/context/AppContext.tsx`)
Yeh frontend state ka dil (heart) hai jo pura application flow monitor karta hai:
- **State Properties**:
  - `user`: Currently active token payload object (name, role, startupId, etc.).
  - `startups`: DPIIT registered companies network lists.
  - `programs`: Available support cohorts lists.
  - `applications`: Live scheme submissions status cache.
  - `toasts`: HUD visual popup stacks.
- **Authentication Functions**:
  - `login()`: Call `authApi.login`, local stores me session aur token sets karta hai aur user state verify karke dashboard render trigger karta hai.
  - `logout()`: Keys destroy karke home screen redirect backup execute karta hai.
  - `verifyOtp()`: Email authentication complete hone par temporary registration profile details ko `startups` listing database sync trigger call pass karta hai.
- **CRUD Wrappers**: Add new programs (`addProgram`), toggle active status (`toggleProgramStatus`), approve/reject applications (`updateApplicationStatus`), and profile update helpers (`updateStartupProfile`).

---

### 3. API Services Module (`/services`)
- **`authApi.ts`**: Pure authentication endpoints (`/auth/register`, `/auth/login`, `/auth/verify-otp`, `/auth/resend-otp`) ke request payloads serialize karta hai aur standard fetch settings (Content-Type header, token integration) apply karta hai.
- **`contentApi.ts`**: Program profiles CRUD backend updates, contact form posts, admin metrics calculations endpoints aur update read notification counts fetch requests run karta hai. `unwrap()` filter generic responses structure se data key safely fetch karta hai.

---

### 4. Page Modules (`/pages`)

#### A. Auth Pages (`/pages/auth`)
- **`Register.tsx`**: 4-step wizard registration form. Step 1 (Logo, Name, Brief, Funding, Stage), Step 2 (Email, Mobile, Password, Address, Web Links), Step 3 (Sector, Services list, CIN, MSME, selected cohort), Step 4 (Target interests, Terms agreement). Har tab switch par specific fields checking errors triggers fire hote hain.
- **`VerifyOtp.tsx`**: 6 distinct verification digit input boxes setup karta hai. Automatic shift-focus, backspace logic checks aur dynamic resend count-down timers (59s) code verification user-experience ko seamless banate hain.

#### B. Founder pages (`/pages/startup`)
- **`StartupDashboard.tsx`**: Onboarded startup profile card render karta hai. Selected program information block details show karta hai aur application review tracking timeline status indicators ke sath draw karta hai.
- **`Settings.tsx`**: Founder portal update screen, jahan registered variables (cin, mobile, support required services) real-time edit kiye ja sakte hain.

#### C. Admin pages (`/pages/admin`)
- **`AdminDashboard.tsx`**: Grid card summary showing statistics (Total registered startups, applications audits status, funds pool counters). Vetting requirements instructions panel list display karta hai.
- **`AdminApplicationManagement.tsx`**: Table containing applicant startup details, program requested, submitted date. Reviews button clicking par ApplicationDetailsModal overlay trigger hota hai.
- **`AdminProgramManagement.tsx`**: Admin control form to create new programs with eligibility, document list, processes parameters.

#### D. Public pages (`/pages/public`)
- **`Home.tsx`**: Main landing hub displaying schemes guidelines, statistics widgets, latest cohorts carousel slider links, contact information cards.
- **`StartupNetwork.tsx` / `InvestorNetwork.tsx`**: registries grid, jisme startup industries filter tags, search text inputs aur connection requests support cards interactive layout elements ke sath design hain.

---

### 5. Shared Components Module (`/components/common`)
- **`Navbar.tsx`**: Primary navigation header. Roles check karke founders ko founder panel link, admin ko admin console link, aur guest user ko Login popups display karta hai.
- **`ApplicationDetailsModal.tsx`**: Multi-column popups displaying full details: Problem statement block, team sizes details, funding stage parameters, uploaded files paths, admin panel decision dropdown targets (status changes, remarks).
- **`ToastContainer.tsx`**: Alert system showing info, success, warnings or critical error feedback prompts inside slides boxes.
