# 🇮🇳 BHASKAR Startup India Codebase Documentation 🚀

Swagat hai! Yeh **BHASKAR Startup India** project ki complete technical documentation hai. Is system ko Department for Promotion of Industry and Internal Trade (DPIIT) aur Startup India Seed Fund Scheme (SISFS) ke guidelines ke anusaar banaya gaya hai.

Neeche diye gaye alag-alag `.md` files me system ke har ek aspect ko details me explain kiya gaya hai:

---

## 📂 Documentation Index

| File Name | Description (Hinglish) | Key Topics Covered |
| :--- | :--- | :--- |
| 📄 [01-system-overview.md](./01-system-overview.md) | BHASKAR application kya hai aur isme kaunsi technologies use hui hain. | Tech Stack, Core Value, Scheme Intro |
| 📄 [02-architecture-workflow.md](./02-architecture-workflow.md) | Registration, OTP authentication, and DB syncing ka step-by-step flow chart aur details. | Multi-step Signup, Email OTP, Post-OTP registration, User Roles |
| 📄 [03-backend-deep-dive.md](./03-backend-deep-dive.md) | Backend codebase structure aur server files ka deep analysis. | server.js, app.js, controller endpoints, helper utilities |
| 📄 [04-frontend-deep-dive.md](./04-frontend-deep-dive.md) | Frontend React + TypeScript application aur state structure ki poori details. | AppContext.tsx, App.tsx router, page modules, component layouts |
| 📄 [05-database-schema.md](./05-database-schema.md) | MongoDB collections aur dynamically dynamic Schemas (`strict: false`) ki detail. | User schema, StartupProfile, ApplicationRecord, TTL indexes |
| 📄 [06-api-reference-routes.md](./06-api-reference-routes.md) | Auth and content routes ke endpoints ki exhaustive documentation. | POST, GET, PATCH methods parameters, access roles, responses |
| 📄 [07-connection-integration.md](./07-connection-integration.md) | Frontend aur backend aapas me kaise communicate karte hain. | Token transmission, Fetch custom wrapper, CORS header, Env configurations |

---

## 🛠️ Project Run Karne Ke Steps

### 1. Prerequisite:
- Node.js (v16+) installed hona chahiye.
- MongoDB server running hona chahiye.

### 2. Backend Start Karein:
```bash
cd backend
npm install
# Create .env file based on .env.example
npm run dev # Runs on http://localhost:5000
```

### 3. Frontend Start Karein:
```bash
cd frontend
npm install
# Create .env file based on .env.example
npm run dev # Runs on http://localhost:3000 (usually) or Vite port
```

---
*Bhaskar Startup India project ko aasaani se samajhne aur maintain karne ke liye kripya upar diye gaye links ya files ko details me padhein.*
