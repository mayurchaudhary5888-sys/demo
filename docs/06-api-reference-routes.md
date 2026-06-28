# 📄 06-api-reference-routes.md (API Reference Directory)

Is file me hum **BHASKAR backend** ke saare Express endpoints, unke HTTP methods, required headers, payloads, aur output structures ko details me list karenge.

---

## 🔐 1. Authentication Endpoints (`/api/auth`)

Sare auth requests par **brute-force rate limiting** (`authRateLimiter`) active hai.

### A. Register Startup Account
- **Endpoint**: `POST /api/auth/register`
- **Auth required**: None (Public)
- **Request Body**:
  ```json
  {
    "name": "Arjun Kumar",
    "email": "arjun@agrofield.in",
    "mobile": "9876543210",
    "password": "SecurePassword123",
    "selectedProgram": "prog-seed-fund",
    "startupProfile": { ... }
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Verification code sent to your email address.",
    "email": "arjun@agrofield.in",
    "startupId": "startup-168819280182"
  }
  ```

### B. Verify OTP
- **Endpoint**: `POST /api/auth/verify-otp`
- **Auth required**: None
- **Request Body**:
  ```json
  {
    "email": "arjun@agrofield.in",
    "otp": "123456"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Verification code approved! Welcome to Bhaskar.",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "email": "arjun@agrofield.in",
      "role": "founder",
      "name": "Arjun Kumar",
      "startupId": "startup-168819280182",
      "isOnboarded": true,
      "isActive": true
    },
    "startupProfile": { ... }
  }
  ```

### C. Login User
- **Endpoint**: `POST /api/auth/login`
- **Auth required**: None
- **Request Body**:
  ```json
  {
    "email": "arjun@agrofield.in",
    "password": "SecurePassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Secure session active.",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": { ... },
    "startupProfile": { ... }
  }
  ```

### D. Resend OTP
- **Endpoint**: `POST /api/auth/resend-otp`
- **Auth required**: None
- **Request Body**:
  ```json
  {
    "email": "arjun@agrofield.in"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "A new verification code has been sent to your email address.",
    "email": "arjun@agrofield.in"
  }
  ```

---

## 📂 2. Content & Business Endpoints (`/api`)

### A. Programs (Support Schemes Cohorts)
- **GET `/programs`**: List of all schemes (Public).
- **GET `/programs/:id`**: Single program full profile details (Public).
- **POST `/admin/programs`**: Create new support program (Admin Only, requires token).
- **PATCH `/admin/programs/:id/toggle`**: Open/Close scheme applications (Admin Only, requires token).

### B. Startups (DPIIT Registries)
- **GET `/startups`**: List of startups. Use `GET /startups?approvedOnly=true` to only fetch verified directories (Public).
- **GET `/startups/:id`**: Startup profile by ID (Public).
- **POST `/startups`**: Complete registration profiles save (Requires token).
- **PATCH `/startups/:id`**: Edit company details like address, industry, sector (Requires token).
- **PATCH `/admin/startups/:id/approval`**: Approve or disapprove startup listing in network registry (Admin Only, requires token).

### C. Scheme Applications (SISFS proposals)
- **GET `/applications`**: Fetch applications list. Query parameter option `?startupId=XYZ` fetches owner records (Requires token).
- **GET `/applications/:id`**: Single proposal full specifications (Requires token).
- **POST `/applications`**: Save naya scheme application form submission. (Requires token, Founder-only).
- **PATCH `/admin/applications/:id/status`**: Auditing status update endpoint. (Admin Only, requires token).
  - *Payload*:
    ```json
    { "status": "Document Requested", "remarks": "Submit Promoters ID & CIN copy." }
    ```
  - *Response*: Status badge timelines update aur user ko dynamic email verification alerts fire honge.

### D. Inquiries Queries & Support Tickets
- **POST `/queries`**: Public Contact Form post requests (Public).
- **GET `/queries`**: List incoming query list (Public).
- **PATCH `/admin/queries/:id/reply`**: Issue resolution remark post (Admin Only, requires token).

### E. Notifications & Core Stats
- **GET `/notifications`**: List dashboard alerts (Requires token).
- **PATCH `/notifications/mark-all-read`**: Mark all alerts as read (Requires token).
- **GET `/admin/stats`**: Admin summary variables calculation (Total users, unresolved queries count, pending files queue). (Admin Only, requires token).
- **GET `/faqs`** / **GET `/announcements`**: Information details lists (Public).
