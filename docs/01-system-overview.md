# 📄 01-system-overview.md (System Overview)

## 🎯 Project kya hai?
**BHASKAR Startup India** ek sovereign portal hai jise Department for Promotion of Industry and Internal Trade (DPIIT) ke guidelines ke according banaya gaya hai. Yeh platform **Startup India Seed Fund Scheme (SISFS)** aur doosre startup assistance programs ko streamline karne ke liye design kiya gaya hai. 

Is portal par:
1. **Founders/Startups** apne entity details ke sath register kar sakte hain, support programs me apply kar sakte hain, aur unki applications ke review process ko track kar sakte hain.
2. **Nodal/Ministerial Admins** startup registrations ko verify/approve kar sakte hain, applications review karke status (जैसे Approved, Rejected, document requested) update kar sakte hain, new support cohorts/programs start kar sakte hain aur analytics dekh sakte hain.

---

## 🛠️ Technology Stack (Tech Stack)

### 1. Frontend (Client-side)
- **Vite + React.js**: Single Page Application (SPA) fast loading aur smooth component rendering ke liye.
- **TypeScript**: Static typing ke liye, jisse compile-time par errors pakde ja sakein aur code dynamic yet robust rahe.
- **Tailwind CSS**: Modern UI styling, gradients, and custom utility-first UI frames.
- **React Router DOM**: Declarative client-side routing, protected routes (founder-only and admin-only lanes).
- **Lucide React**: Vector icons ke liye.

### 2. Backend (Server-side)
- **Node.js + Express.js**: REST API server implementation ke liye, modular router-controller structure.
- **MongoDB + Mongoose**: Database storage ke liye. Yahan Schemas ko custom structure ke according dynamic (`strict: false`) rakha gaya hai taaki startup fields me flexibility rahe.
- **Bcrypt.js**: Security codes aur founder/admin passwords ko double-hashing ke sath database me store karne ke liye.
- **JSON Web Token (JWT)**: Security token transmission, stateless API authentication aur role validation ke liye.
- **Cookie Parser & Morgan**: HTTP request parsing and developer request logging.
- **Nodemailer**: Startup approvals, status changes, and OTP authorization mails transfer karne ke liye.

---

## 👥 Roles & Target Users (Kaun use karega?)

### 1. Founder (Startup User)
- Registration form bhar ke startup register karna.
- Email Verification (OTP-based) pass karna.
- Apni company details update karna (State, Sector, CIN, MSME/Udyog Aadhaar, Stage, etc.).
- Active Support Program choose karna aur schemes ke liye apply karna.
- Application stages track karna (Submitted ➡️ Under Review ➡️ Approved/Document Requested).

### 2. Ministerial Admin (Vetting Authority)
- Vetting criteria check karna (promoter share 51%+, age less than 2 years).
- Startups ki profiles ko verify karna aur unhe approve/deny karna.
- Form submissions review karna aur application status change karna.
- New schemes/programs create karna aur purani schemes ko active/inactive toggle karna.
- Dashboard par metrics dekhna (Total Startups, Pending applications, Approved count, Unresolved Queries, active programs pool).

---

## 🌟 Core Features (Khaas Baat)
- **Multi-Step Dynamic Forms**: Registration form ko steps (About, Contact, Category, Interests) me baanta gaya hai taaki data capture asan ho.
- **Verification Loop**: Direct signup nahi hota, system user ke registered email par verification OTP bhejta hai. Verification ke baad hi founder login karke applications process kar sakta hai.
- **Auditing Dashboard**: Admins ke paas complete details modal, audit timelines aur specific status options hote hain.
- **Interactive UI**: Sleek dark card panels, status badges (visual overlays), toast popups, aur fully responsive viewport screens jo web aur mobile dono par mast chalte hain.
