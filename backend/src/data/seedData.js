export const seedPrograms = [
  {
    id: "sisfs-seed-fund",
    name: "Startup India Seed Fund Scheme (SISFS)",
    shortDescription: "Providing financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.",
    longDescription: "The Startup India Seed Fund Scheme (SISFS) was launched by DPIIT with an outlay of ₹945 crore to build a strong funding bridge for early-stage entrepreneurs.",
    benefits: ["Grant of up to ₹20 Lakh", "Investment of up to ₹50 Lakh", "Incubator-Led Support", "Streamlined Review"],
    eligibility: [
      "Startup must be recognized by DPIIT.",
      "Incorporated less than 2 years at the time of application.",
      "Indian promoters must hold at least 51% of shareholding.",
      "Must have an innovative, technology-supported, or socially impact-driven scalable business model."
    ],
    requiredDocuments: ["DPIIT Recognition Certificate", "Pitch Deck", "Company Incorporation Certificate", "Shareholding Pattern", "Financial Statements"],
    processSteps: ["Submission", "Incubator Selection", "ISMC Evaluation", "Pitch Presentation", "Sanction & Disbursement"],
    isOpen: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    iconName: "Award",
    disclaimer: "Disclaimer: Seed fund allocation and disbursements are managed by DPIIT-recognized incubators."
  },
  {
    id: "startup-program",
    name: "National Startup Acceleration Program",
    shortDescription: "12-week comprehensive mentoring program for early-traction startups.",
    longDescription: "Our signature accelerator program provides deep engineering audits, growth marketing consulting, and warm connections with enterprise decision makers.",
    benefits: ["Weekly mentorship", "Cloud credits", "Capital grant pitch opportunity", "Pitch polish training"],
    eligibility: ["Must have an active MVP", "Strong tech component", "Full-time dedicated co-founders based in India"],
    requiredDocuments: ["Pitch Deck", "Revenue statements"],
    processSteps: ["Review", "Technical audit", "Interview", "Onboarding"],
    isOpen: true,
    startDate: "2026-05-01",
    endDate: "2026-07-31",
    iconName: "TrendingUp"
  },
  {
    id: "msme-program",
    name: "MSME Digital Transformation Initiative",
    shortDescription: "Empowering MSMEs with digitized supply chains and e-commerce capabilities.",
    longDescription: "A digital enablement initiative for MSMEs with training and micro-grants.",
    benefits: ["ERP packages", "Automation grants", "E-marketplace listings"],
    eligibility: ["Has a valid Udyam Registration Certificate", "Engaged in manufacturing or services", "Outside Tier-1 metropolitan locations"],
    requiredDocuments: ["UDYAM Registration Card", "Bank statements"],
    processSteps: ["Verification", "Digital readiness assessment", "Approval"],
    isOpen: true,
    startDate: "2026-04-15",
    endDate: "2026-10-31",
    iconName: "Workflow"
  },
  {
    id: "foundation-program",
    name: "Sankalp Foundation & Entrepreneurship Program",
    shortDescription: "Pre-incubation curriculum for first-generation founders.",
    longDescription: "Designed to turn innovative raw ideas into robust registered entities.",
    benefits: ["Incorporation guidance", "Commercialization masterclasses", "Co-founder matching"],
    eligibility: ["University graduates", "Final-year students", "First-time entrepreneurs", "Raw idea focused on local or global problems"],
    requiredDocuments: ["Student ID / degree certificate", "Write-up of proposed solution"],
    processSteps: ["Application", "Webinar", "Completion certificate"],
    isOpen: true,
    startDate: "2026-06-01",
    endDate: "2026-12-15",
    iconName: "BookOpen"
  },
  {
    id: "idea-validation",
    name: "Ideation to Proof of Concept Sandbox",
    shortDescription: "Interactive prototyping labs and hardware sandbox access to validate hypotheses.",
    longDescription: "Access state-of-the-art incubation laboratories and hardware tools.",
    benefits: ["Lab access", "Industrial tools", "Materials grant"],
    eligibility: ["Hardware-focused or biotech concepts", "No prior significant external funding"],
    requiredDocuments: ["Hypothesis statement", "Bill of Materials"],
    processSteps: ["Checklist", "Compliance review", "Workspace allocation"],
    isOpen: false,
    startDate: "2026-02-01",
    endDate: "2026-05-30",
    iconName: "Cpu"
  },
  {
    id: "global-impact",
    name: "Global Impact & Cross-Border Expansion Program",
    shortDescription: "Cross-border initiative preparing Indian tech leaders to expand globally.",
    longDescription: "International compliance coaching, market pilots, and investor outreach.",
    benefits: ["Workspace", "Legal consultation", "Pitching sessions"],
    eligibility: ["DPIIT recognized startup", "Operational for at least 12 months", "Global scaling potential"],
    requiredDocuments: ["Recognition certificate", "Audited financial statements", "Trademark/patent certificates"],
    processSteps: ["Screening", "Interview", "Soft-landing kickoff"],
    isOpen: true,
    startDate: "2026-08-01",
    endDate: "2026-09-30",
    iconName: "Globe"
  }
];

export const seedInvestors = [
  { id: "inv-sbi-ventures", name: "SBI Startup Capital Fund", organization: "State Bank of India", investmentFocus: ["FinTech", "Logistics", "DeepTech", "AgriTech"], website: "https://sbi.co.in", type: "Funding Partner" },
  { id: "inv-kalaari-india", name: "Kalaari Capital Partners", organization: "Kalaari Capital", investmentFocus: ["SaaS", "EdTech", "HealthTech", "AI & ML"], website: "https://kalaari.com", linkedInUrl: "https://linkedin.com/company/kalaari-capital", type: "VC Partner" },
  { id: "inv-sharma-angel", name: "Rajesh Sharma", organization: "Mumbai Angels Syndicate", investmentFocus: ["AgriTech", "CleanTech", "Logistics"], linkedInUrl: "https://linkedin.com/in/rajeshsharma", type: "Angel Investor" },
  { id: "inv-chiratae", name: "Chiratae Ventures Trust", organization: "Chiratae Ventures", investmentFocus: ["BioTech", "SpaceTech", "HealthTech", "FinTech"], website: "https://chiratae.com", type: "Partner Investor" },
  { id: "inv-shrishti-grants", name: "Shrishti Innovation Hub", organization: "Government of India Initiative", investmentFocus: ["Social Impact", "CleanTech", "AgriTech", "BioTech"], website: "https://shrishti.gov.in", type: "Funding Partner" }
];

export const seedApplications = [];

export const seedQueries = [
  {
    id: "TKT-2026-0045",
    entityType: "Startup",
    entityName: "KisanBot Agrotech",
    contactName: "Sanjay Deshmukh",
    email: "contact@kisanbot.in",
    state: "Maharashtra",
    city: "Pune",
    queryType: "Funding & Seed Fund Related",
    message: "Can we apply for both SISFS seed fund grant and MSME subsidy concurrently?",
    submittedDate: "2026-06-14",
    isResolved: true,
    adminReply: "You can apply for both, provided the total direct grants remain within the cap."
  },
  {
    id: "TKT-2026-0052",
    entityType: "Student/Aspiring Entrepreneur",
    entityName: "None",
    contactName: "Priya Nair",
    email: "priya.nair@univ.edu",
    state: "Kerala",
    city: "Kochi",
    queryType: "Program Support",
    message: "Is DPIIT recognition compulsory to attend the Foundation program?",
    submittedDate: "2026-06-16",
    isResolved: false
  }
];



export const seedConnections = [
  { id: "conn-1", fromId: "startup-heallink", fromName: "HealLink Diagnostics", fromSector: "HealthTech", fromStage: "Validation", toId: "startup-kisan-bot", toName: "KisanBot Agrotech", status: "accepted", timestamp: "2026-06-10" },
  { id: "conn-2", fromId: "startup-bheed-pay", fromName: "BheedPay Technologies", fromSector: "FinTech", fromStage: "Ideation", toId: "startup-kisan-bot", toName: "KisanBot Agrotech", status: "pending", timestamp: "2026-06-17" }
];

export const seedFaqs = [
  { q: "Is DPIIT recognition mandatory for applying to the Startup India Seed Fund Scheme?", a: "Yes. An entity must be a recognized startup under DPIIT to be eligible." },
  { q: "Can a startup register if they are in the Ideation stage?", a: "Yes. Early-stage entrepreneurs are encouraged to register." },
  { q: "How does the incubator-led evaluation operate for SISFS?", a: "Startups can select up to 3 incubators and their internal committees review the application." }
];

export const seedAnnouncements = [
  { id: "ann-01", title: "DPIIT startup milestone update", description: "National startup count has surpassed 1,30,000.", category: "Notification", publishDate: "2026-06-15", isPublished: true },
  { id: "ann-02", title: "Seed Fund expansion", description: "Additional grants released to partner incubators.", category: "Scheme", publishDate: "2026-06-12", isPublished: true }
];
