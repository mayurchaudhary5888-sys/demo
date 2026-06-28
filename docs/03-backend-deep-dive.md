# 📄 03-backend-deep-dive.md (Backend Source Deep Dive)

Is file me hum **backend/src/** folder ke har ek component aur file ko details me explain karenge. Backend framework Node.js + Express.js par structured hai aur standard MVC pattern implement karta hai.

---

## 📂 Backend File Structure

```text
backend/src/
├── app.js               # Express application initialization and middleware
├── server.js            # Node HTTP server entry point
├── config/              # Environment configurations & DB connections
│   ├── db.js
│   └── env.js
├── controllers/         # Endpoint business logic
│   ├── authController.js
│   └── contentController.js
├── data/                # Initial seed JSON arrays
│   └── seedData.js
├── middleware/          # Request filters (Security, Auth, Rate-limiter)
│   ├── auth.js
│   └── security.js
├── models/              # Mongoose DB models
│   ├── User.js
│   ├── StartupProfile.js
│   └── ... (Other models)
├── services/            # Profile clean-up & normalization logic
│   └── startupProfileService.js
├── utils/               # App errors, bootstrappers, emailers, ID generators
│   ├── applicationId.js
│   ├── auth.js
│   ├── bootstrap.js
│   ├── errors.js
│   ├── fileStore.js
│   └── otpEmail.js
└── validators/          # Payload validation logic
    └── authValidators.js
```

---

## 📝 Detailed File Explanations

### 1. Root Files
- **`server.js`**: Backend ka entry point hai. Yeh database connection (`connectDb()`) verify karta hai, database me initial mock data load (`bootstrapContent()`) karta hai, aur express server port (`env.port`) par listen shuru karta hai.
- **`app.js`**: Isme express app build hota hai. Isme globally apply hone wale middlewares register hote hain:
  - `securityMiddleware`: Helmet (security headers) aur CORS configuration.
  - Express json parser with limits (`1mb`).
  - `cookieParser()`: Incoming cookies process karne ke liye.
  - `morgan('dev')`: HTTP request logs console me print karne ke liye.
  - Routes registration: `/api/auth` (auth routes) aur `/api` (content routes).
  - Wildcard routes ke liye `notFound` controller aur system errors catch karne ke liye generic `errorHandler`.

---

### 2. Config Module (`/config`)
- **`db.js`**: `mongoose.connect()` use karke database connection return karta hai. Database start me connect na hone par process exit control code fire hota hai.
- **`env.js`**: Environment parameters compile karta hai. Dotenv package config initialize karke system level environment variables read karta hai aur sensible default values provide karta hai (e.g. port `5000`, local database uri, JWT secrets, Nodemailer mail settings, etc.).

---

### 3. Middleware Module (`/middleware`)
- **`auth.js`**: 
  - `requireAuth`: Incoming request ke header me `Authorization: Bearer <token>` check karta hai. Token verify hone par JWT details decode karke request object (`req.user`) me set kar deta hai. Token missing ya invalid hone par `401 Unauthorized` block response throw karta hai.
  - `requireAdmin`: Yeh check karta hai ki verification token me user role `admin` hai ya nahi. Role match na karne par `403 Forbidden` return hota hai.
- **`security.js`**:
  - CORS policies control karta hai aur client applications origins define karta hai.
  - `authRateLimiter`: brute force logins and registration spam rokne ke liye rate-limiting setup karta hai. Isme per IP range `15 mins` me maximum `80 queries` allow hoti hain.

---

### 4. Services Module (`/services`)
- **`startupProfileService.js`**: 
  - `normalizeStartupProfile`: User input registration fields (cin, funding, services list, description, etc.) ko filter and sanitize karta hai. String empty hone par fallbacks input karta hai aur MSME/DPIIT details validation flags automatic enable/disable karta hai.
  - `syncStartupProfileRecord`: User login par founder profile aur main listing documents database collection (`startups`) ko check karke sync (upsert) karta hai taaki analytics mismatch na ho.

---

### 5. Utils Module (`/utils`)
- **`auth.js`**: Verification tokens creation (`jwt.sign`), random 6-digit number generator (`generateOtp`), email values sanitation (`normalizeEmail`), and OTP text parsing helpers define karta hai.
- **`bootstrap.js`**: Database empty hone par default models arrays seed data inject karta hai (Faqs, programs directory lists, seed startup details, test applications, connections network).
- **`errors.js`**: Central custom error classes (`AppError`) and global middleware catches. Jisse database schema errors or invalid requests clean JSON responses bankar client side par render honge.
- **`applicationId.js`**: Naye application form submissions par serial identifier string formulates karta hai (e.g. `APP-` followed by random sequence numbers).
- **`otpEmail.js`**: Central SMTP client (Nodemailer setup) and template designer. Isme dynamic user templates save hain (OTP verification mail, admin custom requested documents details notification).

---

### 6. Controllers & Validators (`/controllers`, `/validators`)
- **`authController.js`**: Authentication logic handling endpoint targets:
  - `ensureAdminUser`: Agar Database me central admin document present nahi hai, toh `env.js` ke values ke sath dynamic admin create karega login attempt triggers par.
  - `register`: Naya startup signup input parse karega, password hashing logic execute karega, verification code dispatch trigger karega.
  - `verifyOtp` & `resendOtp`: User registration code check targets and dynamic authentication tokens creation logic.
- **`contentController.js`**: Program schemes updates, applications creation & auditing methods, client inquiries reply loops, updates read badges.
- **`authValidators.js`**: Input fields formatting rules (password patterns check, valid input ranges checks, empty arrays checkers).
