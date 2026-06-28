# 📄 05-database-schema.md (Database Schemas)

Is document me hum **MongoDB + Mongoose** database schemas aur data models ko detail me discuss karenge. BHASKAR Startup India application dynamic structure use karti hai taaki system flexible aur scalable rahe.

---

## 🛠️ Schema Strictness Settings (`strict: false`)

Mongoose schemas define karte samay humne `{ strict: false }` use kiya hai. Iska reason aur importance kya hai?
- **Flexibility**: DPIIT recognizes multiple kinds of startups (LLPs, Private Limited, Sole Proprietorships). Har startup type ke fields alag ho sakte hain (e.g. CIN, LLPIN, MSME Aadhaar numbers). `strict: false` set karne se hum bina schema restart kiye dynamic attributes directly database me save kar sakte hain.
- **Migration Avoidance**: Naye options aane par database migrations likhne ki zaroorat nahi padti. JSON structure direct save aur fetch kiya ja sakta hai.

---

## 👥 1. User Model (`User.js`)

Is collection me client credentials aur credentials-related attributes save hote hain.

### Schema Fields:
```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      select: false, // Security precaution: search query me password field automatic hide rahega
    },
    role: {
      type: String,
      enum: ["admin", "founder"],
      default: "founder",
    },
    dept: String,          // Only for Admin (e.g., 'DPIIT Seed Fund Committee')
    startupId: {
      type: String,
      default: null,
    },
    startupProfile: startupProfileSchema, // Embedded schema for caching during registration
    isOnboarded: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,      // verify-otp flow verify hone par true hoga
    },
    isActive: {
      type: Boolean,
      default: true,      // Admin is user state toggle kar ke sign-in suspend kar sakta hai
    },
  },
  { timestamps: true }     // createdAt and updatedAt automated tracking
);
```

---

## 🔑 2. OtpToken Model (`OtpToken.js`)

Verification OTP temporary records collection hai. Isme automatic expiration data mechanism hai:

### Schema Fields:
- **`email`**: Identifier string (trim + lowercase).
- **`otpHash`**: 6-digit verification code ka safe SHA-256/bcrypt-like hash.
- **`purpose`**: Enum: `["registration"]`.
- **`expiresAt`**: Date format. Index property `{ expires: 0 }` dynamic TTL (Time To Live) create karti hai. Iska matlab jaise hi current system time `expiresAt` ke aage jayega, MongoDB automatic background service se is entry ko permanently delete kar dega.
- **`attempts`**: Counter field. Agar `attempts >= 5` hote hain, toh user session query automatic terminate ho jayegi taaki security bani rahe.

---

## 🏢 3. StartupProfile Model (`StartupProfile.js`)

Startups registry document collection. Collection name `startups`.
- **Properties**: Dynamic document structure (`strict: false`).
- **Core fields mapped by normalization service**:
  - `id`: Startup unique serial string.
  - `name` / `startupName` / `legalName`: Name configurations.
  - `cin`: Corporate Identification Number (if DPIIT recognized).
  - `udhyogAadhaar`: MSME registration credentials.
  - `stage`: `Ideation` | `Validation` | `Early Traction` | `Scaling`.
  - `fundingStatus`: `Bootstrapped` | `Funded`.
  - `isApproved`: Boolean. Is property ko Admin panel se control kiya jata hai. Jab yeh property `true` set hogi, tabhi yeh startup public startup list (`StartupNetwork.tsx`) me display hoga.

---

## 📝 4. ApplicationRecord Model (`ApplicationRecord.js`)

Schemes submissions tracking registry. Collection name `applications`.
- **Properties**: `{ strict: false }`.
- **Standard Vetting Fields**:
  - `id`: Automated serial formatted ID (e.g., `APP-XXXXXX`).
  - `programId` & `programName`: Link to program cohort applied.
  - `startupId` & `startupName`: Link to applicant entity.
  - `status`: `Submitted` | `Under Review` | `Document Requested` | `Shortlisted` | `Approved` | `Rejected`.
  - `pitchDeckName`: Name of uploaded pitch deck pdf.
  - `adminRemarks`: Remarks added by admin boards during auditing.
  - `timeline`: State change tracking stack:
    ```javascript
    timeline: [
      {
        status: String,
        timestamp: String,
        remarks: String
      }
    ]
    ```

---

## 📢 5. Other Dynamic Collections
1. **`Program` (collection `programs`)**: Scheme guidelines, required documents arrays, eligibility criteria lines, registration start and end date details.
2. **`ContactQuery` (collection `queries`)**: Public query support tickets (query category, client name, question, isResolved state flags, admin reply string).
3. **`Notification` (collection `notifications`)**: Dashboard visual updates alerts (type, message string, timestamp, isRead status).
