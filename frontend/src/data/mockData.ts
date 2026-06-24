/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  StartupProfile, 
  InvestorProfile, 
  Program, 
  Application, 
  Announcement, 
  ContactQuery, 
  Notification,
  StartupStage,
  FundingType,
  ApplicationStatus
} from "../types";

export const mockPrograms: Program[] = [
  {
    id: "sisfs-seed-fund",
    name: "Startup India Seed Fund Scheme (SISFS)",
    shortDescription: "Providing financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.",
    longDescription: "The Startup India Seed Fund Scheme (SISFS) was launched by DPIIT with an outlay of ₹945 crore to build a strong funding bridge for early-stage entrepreneurs. Under this scheme, we support innovative, sector-agnostic ideas with a priority on social impact, agriculture, agriculture-waste, healthcare, clean energy, waste management, biotechnology, and mobility.",
    benefits: [
      "Grant of up to ₹20 Lakh: Milestone-based disbursement for validation of proof of concept, prototype development, or product trials with zero repayment commitments.",
      "Investment of up to ₹50 Lakh: Disbursed via convertible debentures, debt-linked instruments, or equity for market entry, commercialization, and scaling.",
      "Incubator-Led Support: Mentorship, testing labs, shared facilities, and corporate networks provided directly by top, partner incubators across India.",
      "Streamlined Review: Decisions and evaluations of pitches on the portal within an expected timeline of 45 days."
    ],
    eligibility: [
      "Startup must be recognized by DPIIT (Department for Promotion of Industry and Internal Trade).",
      "Incorporated less than 2 years at the time of application.",
      "Indian promoters must hold at least 51% of shareholding at the time of application.",
      "Must have an innovative, technology-supported, or socially impact-driven scalable business model.",
      "Should not have received more than ₹10 Lakh in monetary support from any other Central or State Government scheme (excluding prize money, subsidies, and free incubation space)."
    ],
    requiredDocuments: [
      "DPIIT Recognition Certificate (PDF)",
      "Proof of Concept (PoC) report / Pitch Deck (PDF / PPTX)",
      "Company Incorporation Certificate & MoA/AoA",
      "Shareholding Pattern Certified by a Chartered Accountant",
      "Latest Audited / Self-certified Financial Statements"
    ],
    processSteps: [
      "Submission: Fill out the application form on the Bhaskar Startup India portal specifying details of your venture.",
      "Incubator Selection: Select up to 3 incubator partners in order of priority who will review your application.",
      "ISMC Evaluation: The selected incubator's Incubator Seed Management Committee (ISMC) benchmarks and reviews eligible applications.",
      "Pitch Presentation: Shortlisted founders are invited to present their pitch live or virtually.",
      "Sanction & Disbursement: Milestone contracts are signed and funds are disbursed directly to you via the selected incubator inside 45 days."
    ],
    isOpen: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    iconName: "Award",
    disclaimer: "Disclaimer: Seed fund allocation, selection, and disbursements are evaluated and managed directly by DPIIT-recognized incubator ISMC partners. Bhaskar Startup India is a digital facilitation portal and is not the final disbursing authority."
  },
  {
    id: "startup-program",
    name: "National Startup Acceleration Program",
    shortDescription: "12-week comprehensive mentoring program for early-traction startups to scale tech infrastructures and access enterprise clients.",
    longDescription: "Our signature accelerator program provides deep engineering audits, growth marketing consulting, and warm connections with Fortune 500 decision makers to turbocharge your B2B sales pipelines.",
    benefits: [
      "Direct weekly mentorship from industry leaders and exit-proven founders.",
      "₹10,000 worth of serverless and AI cloud compute credits.",
      "Fast-track presentation opportunity for capital grants plus corporate pilots.",
      "Intensive pitch polish training prior to Demo Day."
    ],
    eligibility: [
      "Must have an active MVP with early paid users or pilots.",
      "Strong tech component (SaaS, DeepTech, AI/ML or hardware-enabled).",
      "Full-time dedicated co-founders based in India."
    ],
    requiredDocuments: [
      "Pitch Deck detailing current product architecture",
      "Revenue statements or letter of intents from corporate pilots"
    ],
    processSteps: [
      "Application review by selection committee",
      "Technical code/product audit",
      "Virtual interview panel",
      "Onboarding kickoff"
    ],
    isOpen: true,
    startDate: "2026-05-01",
    endDate: "2026-07-31",
    iconName: "TrendingUp"
  },
  {
    id: "msme-program",
    name: "MSME Digital Transformation Initiative",
    shortDescription: "Empowering traditional manufacturing, textiles, and local service enterprises with digitized supply chains and e-commerce capabilities.",
    longDescription: "Under the Ministry of Micro, Small & Medium Enterprises, this scheme delivers specialized micro-grants and tech training programs to bring rural and suburban Indian businesses onto national e-commerce pipelines.",
    benefits: [
      "Subsidized ERP software packages and digital catalog builder tools.",
      "Direct grants of up to ₹5 Lakh for procuring high-tech automation equipment.",
      "Access to safe government-sponsored e-marketplace listings."
    ],
    eligibility: [
      "Has a valid Udyam Registration Certificate.",
      "Engaged in raw manufacturing, handicrafts, textiles, logistics, or regional services.",
      "Headquartered outside primary Tier-1 metropolitan locations."
    ],
    requiredDocuments: [
      "UDYAM Registration Card (Copy)",
      "Bank statements for the previous 6 months"
    ],
    processSteps: [
      "Online verification of UDYAM documents",
      "Interactive assessment of digital readiness",
      "Approval & allocation to regional digital centers"
    ],
    isOpen: true,
    startDate: "2026-04-15",
    endDate: "2026-10-31",
    iconName: "Workflow"
  },
  {
    id: "foundation-program",
    name: "Sankalp Foundation & Entrepreneurship Program",
    shortDescription: "Nurturing first-generation founders and student innovators with structured blueprints on legal, financial, and regulatory frameworks.",
    longDescription: "A pre-incubation curriculum designed to turn innovative raw ideas into robust registered entities, providing foundational legal clinics, co-founder match systems, and business-model canvases.",
    benefits: [
      "Free company incorporation guidance and company-secretary consulting hours.",
      "Step-by-step masterclasses on commercializing research papers and patents.",
      "Interactive co-founder matching network events across active Indian university hubs."
    ],
    eligibility: [
      "Open to university graduates, final-year students, or first-time regional entrepreneurs.",
      "No corporate registration required at the initial phase.",
      "A raw, innovative idea focused on local or global community problems."
    ],
    requiredDocuments: [
      "Student ID Card or highest educational degree certificate",
      "Single-page write-up of the proposed solution state"
    ],
    processSteps: [
      "Submitting conceptual framework application",
      "Joining regional cohort webinar",
      "Publishing certificate of boot-camp completion"
    ],
    isOpen: true,
    startDate: "2026-06-01",
    endDate: "2026-12-15",
    iconName: "BookOpen"
  },
  {
    id: "idea-validation",
    name: "Ideation to Proof of Concept Sandbox",
    shortDescription: "Interactive technology prototyping labs and hardware sandbox access to validate scientific and architectural hypotheses.",
    longDescription: "Access state-of-the-art incubation laboratories, 3D printing labs, chemical analysis kits, and silicon synthesis boards sponsored by regional technology departments.",
    benefits: [
      "Unlimited access to specialized physics, hardware, and bio labs for 6 months.",
      "Access to standard industrial tools worth ₹15 Lakh.",
      "A non-repayable materials grant of ₹2 Lakh to buy hardware sensors and components."
    ],
    eligibility: [
      "Hardware-focused, biotechnology, drone-tech, robotic systems, or IoT concepts.",
      "No prior significant external funding received."
    ],
    requiredDocuments: [
      "Hypothesis statement detailing technical specifications",
      "Estimated Bill of Materials (BoM)"
    ],
    processSteps: [
      "Application and technical feasibility checklist",
      "Safety and compliance verification review",
      "Lab workspace allocation"
    ],
    isOpen: false,
    startDate: "2026-02-01",
    endDate: "2026-05-30",
    iconName: "Cpu"
  },
  {
    id: "global-impact",
    name: "Global Impact & Cross-Border Expansion Program",
    shortDescription: "Selected DPIIT startups receive global soft-landing pads, foreign market compliance coaching, and international investor outreach.",
    longDescription: "An elite cross-border initiative preparing Indian tech leaders to safely expand their solutions into G20 markets, providing regulatory licenses, tax guidance, and sovereign market pilots.",
    benefits: [
      "Subsidized workspace in Singapore, London, or San Francisco for 4 weeks.",
      "Direct legal consultation for international trademarks, HIPAA, and GDPR compliance.",
      "Elite private pitching sessions with foreign institutional VC funds."
    ],
    eligibility: [
      "DPIIT recognized startup earning >₹1 Crore ARR or showing sustained high usage.",
      "Operational in commercial markets for regular clients for at least 12 months.",
      "Global scaling potential within SaaS, clean-tech, or deeptech."
    ],
    requiredDocuments: [
      "DPIIT recognition certificate",
      "Audited financial statements confirming revenue",
      "Trademark and patent status certificates"
    ],
    processSteps: [
      "Document screening and scale vetting",
      "Fireside jury interview",
      "International alignment and soft-landing kickoff"
    ],
    isOpen: true,
    startDate: "2026-08-01",
    endDate: "2026-09-30",
    iconName: "Globe"
  }
];

export const mockStartups: StartupProfile[] = [
  {
    id: "startup-kisan-bot",
    name: "KisanBot Agrotech",
    logoUrl: "https://images.unsplash.com/photo-1595151108425-45136ab2620a?w=128&fit=crop&auto=format&q=80",
    stage: StartupStage.EARLY_TRACTION,
    fundingType: FundingType.BOOTSTRAPPED,
    description: "KisanBot designs autonomous AI solar-powered weed-removers and pest monitoring micro-rovers for smallhold Indian farming layouts. Our solution saves up to 70% of crop pesticide costs and optimizes organic harvest yield.",
    email: "contact@kisanbot.in",
    mobile: "9876543210",
    state: "Maharashtra",
    city: "Pune",
    website: "https://kisanbot.in",
    sector: "AgriTech",
    startupType: "Product (Hardware)",
    isDpiitRecognized: true,
    dpiitNumber: "DPIIT-897621",
    isMsmeRegistered: true,
    msmeNumber: "UDYAM-MH-12-0034221",
    interestedPrograms: ["sisfs-seed-fund", "startup-program"],
    supportRequired: ["Funding & Grants", "Mentorship & Technical Advice", "Market Access & Enterprise Sales"],
    isApproved: true,
    registrationDate: "2026-02-14"
  },
  {
    id: "startup-heallink",
    name: "HealLink Diagnostics",
    logoUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=128&fit=crop&auto=format&q=80",
    stage: StartupStage.VALIDATION,
    fundingType: FundingType.FUNDED,
    description: "HealLink is an AI diagnostics platform delivering automated radiology reporting for remote diagnostic camps and district hospitals, functioning seamlessly at under 100kbps bandwidth layouts.",
    email: "info@heallink.co.in",
    mobile: "9123456789",
    state: "Karnataka",
    city: "Bengaluru",
    website: "https://heallink.co.in",
    sector: "HealthTech",
    startupType: "Product (Software/SaaS)",
    isDpiitRecognized: true,
    dpiitNumber: "DPIIT-331245",
    isMsmeRegistered: false,
    interestedPrograms: ["sisfs-seed-fund", "idea-validation"],
    supportRequired: ["Funding & Grants", "Technology Infrastructure & Cloud Credits"],
    isApproved: true,
    registrationDate: "2026-03-01"
  },
  {
    id: "startup-bheed-pay",
    name: "BheedPay Technologies",
    logoUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&fit=crop&auto=format&q=80",
    stage: StartupStage.IDEATION,
    fundingType: FundingType.BOOTSTRAPPED,
    description: "BheedPay provides unified digital ledger solutions and automated expense reconciliation systems specifically crafted for local village Kirana merchants and wholesale mandis.",
    email: "merchants@bheedpay.com",
    mobile: "9345678901",
    state: "Uttar Pradesh",
    city: "Noida",
    website: "https://bheedpay.com",
    sector: "FinTech",
    startupType: "Platform",
    isDpiitRecognized: false,
    isMsmeRegistered: false,
    interestedPrograms: ["foundation-program"],
    supportRequired: ["Mentorship & Technical Advice", "Legal & Regulatory Compliance"],
    isApproved: true,
    registrationDate: "2026-06-10"
  },
  {
    id: "startup-urja-recycle",
    name: "Urja EcoCells",
    logoUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=128&fit=crop&auto=format&q=80",
    stage: StartupStage.SCALING,
    fundingType: FundingType.FUNDED,
    description: "Urja EcoCells manufactures bio-degradable lightweight grid batteries and energy storage cells supporting rural microgrids and solar agricultural water pumps.",
    email: "energy@urjaecocells.org",
    mobile: "9000188992",
    state: "Gujarat",
    city: "Ahmedabad",
    website: "https://urjaecocells.org",
    sector: "CleanTech",
    startupType: "Product (Hardware)",
    isDpiitRecognized: true,
    dpiitNumber: "DPIIT-554432",
    isMsmeRegistered: true,
    msmeNumber: "UDYAM-GJ-01-998311",
    interestedPrograms: ["global-impact"],
    supportRequired: ["Market Access & Enterprise Sales", "Government Schemes & DPIIT Benefits"],
    isApproved: true,
    registrationDate: "2025-11-20"
  },
  {
    id: "startup-rural-learn",
    name: "Rural Learn LMS",
    stage: StartupStage.VALIDATION,
    fundingType: FundingType.BOOTSTRAPPED,
    description: "An offline-first learning management platform packed in localized low-cost microcontrollers for vernacular secondary schools missing continuous electricity grid support.",
    email: "shiksha@rurallearn.edu",
    mobile: "8122334455",
    state: "Bihar",
    city: "Patna",
    sector: "EdTech",
    startupType: "Hybrid",
    isDpiitRecognized: true,
    dpiitNumber: "DPIIT-449102",
    isMsmeRegistered: false,
    interestedPrograms: ["sisfs-seed-fund", "foundation-program"],
    supportRequired: ["Mentorship & Technical Advice", "Funding & Grants"],
    isApproved: false, // For testing pending approval states
    registrationDate: "2026-06-17"
  }
];

export const mockInvestors: InvestorProfile[] = [
  {
    id: "inv-sbi-ventures",
    name: "SBI Startup Capital Fund",
    organization: "State Bank of India",
    investmentFocus: ["FinTech", "Logistics", "DeepTech", "AgriTech"],
    website: "https://sbi.co.in",
    type: "Funding Partner"
  },
  {
    id: "inv-kalaari-india",
    name: "Kalaari Capital Partners",
    organization: "Kalaari Capital",
    investmentFocus: ["SaaS", "EdTech", "HealthTech", "AI & ML"],
    website: "https://kalaari.com",
    linkedInUrl: "https://linkedin.com/company/kalaari-capital",
    type: "VC Partner"
  },
  {
    id: "inv-sharma-angel",
    name: "Rajesh Sharma",
    organization: "Mumbai Angels Syndicate",
    investmentFocus: ["AgriTech", "CleanTech", "Logistics"],
    linkedInUrl: "https://linkedin.com/in/rajeshsharma",
    type: "Angel Investor"
  },
  {
    id: "inv-chiratae",
    name: "Chiratae Ventures Trust",
    organization: "Chiratae Ventures",
    investmentFocus: ["BioTech", "SpaceTech", "HealthTech", "FinTech"],
    website: "https://chiratae.com",
    type: "Partner Investor"
  },
  {
    id: "inv-shrishti-grants",
    name: "Shrishti Innovation Hub",
    organization: "Government of India Initiative",
    investmentFocus: ["Social Impact", "CleanTech", "AgriTech", "BioTech"],
    website: "https://shrishti.gov.in",
    type: "Funding Partner"
  }
];

export const mockApplications: Application[] = [
  {
    id: "APP-2026-0091",
    programId: "sisfs-seed-fund",
    programName: "Startup India Seed Fund Scheme (SISFS)",
    startupId: "startup-kisan-bot",
    startupName: "KisanBot Agrotech",
    submittedDate: "2026-05-18",
    lastUpdated: "2026-06-15",
    status: ApplicationStatus.UNDER_REVIEW,
    problemStatement: "Smallhold Indian farmers spend excessive amounts on chemical weed killers and manually extraction, decreasing soil bio-fertility and raising cultivation overheads.",
    solutionDescription: "Solar utility micro-rovers navigating fields autonomously to extract weeds mechanically using smart computer vision, feeding organic matter back to the ground.",
    currentStage: "MVP functional, tested in 15 farms in Saswad district.",
    teamSize: 4,
    fundingStatus: "Bootstrap capital and small family grant.",
    pitchDeckName: "Kisan_SeedFund_Pitch_v2.pdf",
    adminRemarks: "Assigned to ISMC, waiting for scheduled physical demo at the Pune Agriculture College center.",
    timeline: [
      {
        status: ApplicationStatus.SUBMITTED,
        timestamp: "2026-05-18 10:24 AM",
        remarks: "Form filed and documents validated successfully."
      },
      {
        status: ApplicationStatus.UNDER_REVIEW,
        timestamp: "2026-06-15 02:40 PM",
        remarks: "ISMC partner Pune Ag-Incubator reviewed the eligibility. Waiting for Physical Test Assessment scheduling."
      }
    ]
  },
  {
    id: "APP-2026-0105",
    programId: "sisfs-seed-fund",
    programName: "Startup India Seed Fund Scheme (SISFS)",
    startupId: "startup-heallink",
    startupName: "HealLink Diagnostics",
    submittedDate: "2026-06-01",
    lastUpdated: "2026-06-16",
    status: ApplicationStatus.DOCUMENT_REQUESTED,
    problemStatement: "Over 70% of rural Indian clinics have medical machinery but miss certified radiologists, delaying critical trauma diagnosis by multiple days.",
    solutionDescription: "Lightweight AI neural framework digesting radiology scans, executing on-device categorization and pushing 5KB report summary via standard GSM telemetry.",
    currentStage: "Passed clinical trials with 230 test cases under institutional validation.",
    teamSize: 5,
    fundingStatus: "₹10 Lakh from Angel, now seeking milestone grant.",
    pitchDeckName: "Heal_Diagnostics_Doc.pdf",
    adminRemarks: "Please upload the official self-certified clinical validation report signed by the medical expert. Need the PDF via document portal.",
    timeline: [
      {
        status: ApplicationStatus.SUBMITTED,
        timestamp: "2026-06-01 11:15 AM",
        remarks: "Submitted initial files."
      },
      {
        status: ApplicationStatus.DOCUMENT_REQUESTED,
        timestamp: "2026-06-16 09:12 AM",
        remarks: "Academic validation report requested. Status changed by Administrator."
      }
    ]
  },
  {
    id: "APP-2026-0044",
    programId: "startup-program",
    programName: "National Startup Acceleration Program",
    startupId: "startup-urja-recycle",
    startupName: "Urja EcoCells",
    submittedDate: "2026-04-20",
    lastUpdated: "2026-05-10",
    status: ApplicationStatus.APPROVED,
    problemStatement: "Grid dependencies in remote agricultural tube wells limit crop irrigation during random load-shedding hours.",
    solutionDescription: "Bio-degradable thermal cell arrays storage backup supplying peak current surges.",
    currentStage: "Active commercial manufacturing in Jamnagar facility.",
    teamSize: 12,
    fundingStatus: "Seed equity round closed.",
    pitchDeckName: "Urja_Scale_Proposal.pdf",
    adminRemarks: "Welcome to Cohort-IV! Onboarding email sent for technical audit sessions.",
    timeline: [
      {
        status: ApplicationStatus.SUBMITTED,
        timestamp: "2026-04-20 09:00 AM"
      },
      {
        status: ApplicationStatus.UNDER_REVIEW,
        timestamp: "2026-04-30 02:22 PM",
        remarks: "Verification of manufacturing certificates completed."
      },
      {
        status: ApplicationStatus.SHORTLISTED,
        timestamp: "2026-05-05 11:45 AM",
        remarks: "Excellent jury ratings during online pitches."
      },
      {
        status: ApplicationStatus.APPROVED,
        timestamp: "2026-05-10 04:00 PM",
        remarks: "Approved for National Acceleration cohort support."
      }
    ]
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-01",
    title: "DPIIT registers record milestone of 1.3 Lakh Recognized Startups across Indian States",
    description: "The Department for Promotion of Industry and Internal Trade (DPIIT) announced that India's active recognized physical startup count has surpassed 1,30,000, creating upwards of 12 lakh direct high-skilled digital jobs.",
    category: "Notification",
    publishDate: "2026-06-15",
    isPublished: true
  },
  {
    id: "ann-02",
    title: "Startup India Seed Fund Scheme (SISFS) releases ₹75 Crore incremental grants to 45 incubators",
    description: "To support early validation prototypes, DPIIT authorized direct budget expansions for regional incubators specifically residing in Tier-2 and Tier-3 geographies. Startups can apply now select preferred incubators.",
    category: "Scheme",
    publishDate: "2026-06-12",
    isPublished: true
  },
  {
    id: "ann-03",
    title: "Special Patent Prosecution Highway (PPH) launched giving fast-track IP relief to recognized bio-startups",
    description: "New Fast-track guidelines for intellectual patents cut down processing queues from 30 months down to 4 months for qualified Indian developers.",
    category: "Policy",
    publishDate: "2026-06-05",
    isPublished: true
  },
  {
    id: "ann-04",
    title: "Up-coming National Startup Day Celebrations and Awards ceremony on July 15",
    description: "Nominations are officially accepted starting today. Registered startups are encouraged to check national guidelines and submit portfolio highlights.",
    category: "Event",
    publishDate: "2026-06-18",
    isPublished: true
  }
];

export const mockConnections = [
  {
    id: "conn-1",
    fromId: "startup-heallink",
    fromName: "HealLink Diagnostics",
    fromSector: "HealthTech",
    fromStage: "Validation",
    toId: "startup-kisan-bot",
    toName: "KisanBot Agrotech",
    status: "accepted",
    timestamp: "2026-06-10"
  },
  {
    id: "conn-2",
    fromId: "startup-bheed-pay",
    fromName: "BheedPay Technologies",
    fromSector: "FinTech",
    fromStage: "Ideation",
    toId: "startup-kisan-bot",
    toName: "KisanBot Agrotech",
    status: "pending",
    timestamp: "2026-06-17"
  }
];

export const mockContactQueries: ContactQuery[] = [
  {
    id: "TKT-2026-0045",
    entityType: "Startup",
    entityName: "KisanBot Agrotech",
    contactName: "Sanjay Deshmukh",
    email: "contact@kisanbot.in",
    state: "Maharashtra",
    city: "Pune",
    queryType: "Funding & Seed Fund Related",
    message: "We want to verify if we are allowed to apply for both SISFS seed fund grant and the MSME Equipment subsidy concurrently. Are there overlap limitations?",
    submittedDate: "2026-06-14",
    isResolved: true,
    adminReply: "You can apply for both, provided the total direct grants from other Central/State Govt schemes for your exact prototype doesn't exceed ₹10 Lakh. Equipment subsidy on CAPEX does not violate the seed fund mandate."
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
    message: "Is DPIIT recognition compulsory to attend the Sankalp Foundation Boot-camp program? We haven't registered our company yet.",
    submittedDate: "2026-06-16",
    isResolved: false
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "not-01",
    title: "Application Track Update",
    message: "Your SISFS Seed Fund Application APP-2026-0091 has changed its status to 'Under Review' by the Pune Ag-Incubator ISMC.",
    type: "warning",
    timestamp: "2026-06-15 02:40 PM",
    isRead: false
  },
  {
    id: "not-02",
    title: "New Connection Request",
    message: "BheedPay Technologies wants to connect with your startup KisanBot Agrotech.",
    type: "info",
    timestamp: "2026-06-17 11:15 AM",
    isRead: false
  },
  {
    id: "not-03",
    title: "Profile Status Approved",
    message: "Congratulations! Your founder profile is approved by the admin. You are now discoverable in the public network.",
    type: "success",
    timestamp: "2026-06-12 10:00 AM",
    isRead: true
  }
];

export const FAQS = [
  {
    q: "Is DPIIT recognition mandatory for applying to the Startup India Seed Fund Scheme?",
    a: "Yes. An entity must be a recognized startup under DPIIT to be eligible for applying to the Seed Fund portal. You can easily register for DPIIT Recognition online via the information resources provided on our site."
  },
  {
    q: "Can a startup register if they are in the Ideation stage?",
    a: "Absolutely. Early-stage entrepreneurs are encouraged to list and register. We have dedicated programs like the 'Sankalp Foundation Program' and the 'Ideation sandbox' specifically to support founders without registered companies who are still validating concepts."
  },
  {
    q: "How does the incubator-led evaluation operate for SISFS?",
    a: "Startups can select up to 3 incubators in India according to preference while submitting their form. The selected incubators' internal Committees (ISMC) review criteria, hold live presentation sessions, and disburse sanctioned milestone amounts directly."
  },
  {
    q: "How long does the application review process take?",
    a: "Generally, application status changes and review feedbacks are updated on the portal in real time. We aim to complete the evaluations and hold pitch committees within a span of 45 days from initial filing."
  },
  {
    q: "Who is the disbursing authority for the seed grants?",
    a: "DPIIT-recognized incubators acts as the primary evaluation and disbursement nodes. Bhaskar Startup India acts as an interactive administrative & verification portal to track submissions, rather than distributing funding autonomously."
  }
];
