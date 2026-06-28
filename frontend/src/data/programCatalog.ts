import { BookOpen, Building2, Globe2, Lightbulb, Rocket, type LucideIcon } from "lucide-react";
import type { Program } from "../types";

export type ProgramSlug =
  | "idea-validation-program"
  | "msme-program"
  | "foundation-program"
  | "startup-program"
  | "global-impact-program";

export type CatalogProgram = Program & {
  slug: ProgramSlug;
  partner: string;
  funding: string;
  tagline: string;
  icon: LucideIcon;
  focusAreas: string[];
};

export const programCatalog: CatalogProgram[] = [
  {
    id: "idea-validation-program",
    slug: "idea-validation-program",
    name: "Idea Validation Program",
    partner: "BHASKAR",
    funding: "Up to ₹10 lakh grant",
    tagline: "Validate the problem, test the market, and shape a fundable early venture.",
    shortDescription: "An idea validation track for founders who need customer discovery, prototype guidance, and early grant support before company scale-up.",
    longDescription:
      "The Idea Validation Program helps aspiring founders move from assumption to evidence. The cohort focuses on problem discovery, user interviews, prototype testing, mentor reviews, and a clear validation report that can support future grant or incubation applications.",
    benefits: [
      "Grant support up to ₹10 lakh for validation, prototype experiments, and pilot-readiness activities.",
      "Structured mentor reviews for customer discovery, market sizing, product assumptions, and early revenue models.",
      "Access to incubation guidance, founder clinics, and validation milestone tracking.",
    ],
    eligibility: [
      "Founder or team has an original idea with a clear problem statement.",
      "Prototype may be early, incomplete, or still under testing.",
      "Applicants should be ready to conduct user interviews and submit validation evidence.",
    ],
    requiredDocuments: ["Founder profile", "Idea note or concept deck", "Problem statement", "Any prototype or research evidence"],
    processSteps: [
      "Submit the idea profile and validation hypothesis.",
      "Attend mentor screening and problem-market review.",
      "Complete validation milestones and submit evidence.",
      "Receive grant recommendation and next-stage guidance.",
    ],
    focusAreas: ["Customer discovery", "Prototype validation", "Market evidence", "Founder readiness"],
    isOpen: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    iconName: "Lightbulb",
    icon: Lightbulb,
  },
  {
    id: "msme-program",
    slug: "msme-program",
    name: "MSME Program",
    partner: "iCreate",
    funding: "Up to ₹15 lakh grant",
    tagline: "Modernize MSME-led innovation through digital, product, and manufacturing support.",
    shortDescription: "An iCreate-linked MSME support program for small enterprises building technology, manufacturing, or market-expansion capability.",
    longDescription:
      "The MSME Program supports small businesses and MSME-linked startups that need practical capital, expert guidance, and technology adoption support. It is built for teams improving production, digitizing operations, launching new products, or strengthening their market access.",
    benefits: [
      "Grant support up to ₹15 lakh for approved innovation, digitization, or manufacturing improvement activities.",
      "Mentor support around product readiness, operations, compliance, and go-to-market planning.",
      "Access to structured reviews for MSME documentation, financial readiness, and implementation milestones.",
    ],
    eligibility: [
      "Applicant should be an MSME or startup working closely with MSME innovation needs.",
      "The proposed solution should improve productivity, technology adoption, product quality, or market access.",
      "Applicant should be able to provide basic business and financial documents.",
    ],
    requiredDocuments: ["Udyam or business registration", "Business profile", "Bank statements", "Project proposal", "Founder KYC"],
    processSteps: [
      "Submit MSME and project details.",
      "Complete document verification and readiness assessment.",
      "Present implementation plan to the review panel.",
      "Receive approval, milestones, and grant disbursement schedule.",
    ],
    focusAreas: ["MSME digitization", "Manufacturing support", "Product improvement", "Market access"],
    isOpen: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    iconName: "Building2",
    icon: Building2,
  },
  {
    id: "foundation-program",
    slug: "foundation-program",
    name: "Foundation Program",
    partner: "BHASKAR",
    funding: "Up to ₹30 lakh grant",
    tagline: "Build the operating foundation for a high-impact startup from idea to pilot.",
    shortDescription: "A foundation track for early teams that need grant support, mentor depth, and pilot planning.",
    longDescription:
      "The Foundation Program is designed for first-time founders and early teams preparing to convert a promising idea into a structured venture. It covers founder readiness, problem framing, pilot design, legal and finance basics, impact measurement, and grant-backed execution planning.",
    benefits: [
      "Grant support up to ₹30 lakh for approved pilots, capacity building, and early implementation.",
      "Hands-on guidance across legal setup, business model design, impact metrics, and founder operations.",
      "Cohort-based reviews that help teams move from foundation work to formal startup acceleration.",
    ],
    eligibility: [
      "Open to early-stage founders, student innovators, and first-time entrepreneurs.",
      "The idea should address a meaningful social, market, or community problem.",
      "Applicant should be willing to complete structured cohort milestones.",
    ],
    requiredDocuments: ["Founder profile", "Idea or pilot note", "Pitch deck if available", "Education or entity proof", "Basic budget plan"],
    processSteps: [
      "Submit founder and idea details.",
      "Complete foundation-readiness screening.",
      "Join cohort sessions and refine pilot plan.",
      "Submit milestone plan for grant approval.",
    ],
    focusAreas: ["Founder readiness", "Pilot design", "Impact planning", "Legal and finance basics"],
    isOpen: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    iconName: "BookOpen",
    icon: BookOpen,
  },
  {
    id: "startup-program",
    slug: "startup-program",
    name: "Startup Program",
    partner: "SISFS",
    funding: "₹20 lakh grant / ₹50 lakh loan",
    tagline: "Move from proof of concept to commercialization with seed-stage capital.",
    shortDescription: "A SISFS-based startup track for DPIIT-recognized ventures seeking grant support for validation and loan/debt support for market entry.",
    longDescription:
      "The Startup Program supports eligible startups through the Startup India Seed Fund Scheme model. It is meant for ventures with an innovative product or service that need proof-of-concept funding, prototype development, product trials, market entry, or commercialization support.",
    benefits: [
      "Grant support up to ₹20 lakh for proof of concept, prototype development, and product trials.",
      "Loan, debt, or convertible support up to ₹50 lakh for market entry and commercialization.",
      "Incubator-led evaluation, milestone tracking, and founder mentoring.",
    ],
    eligibility: [
      "Startup should be DPIIT-recognized and early stage.",
      "Indian promoters should hold majority ownership as per scheme requirements.",
      "Startup should not have received incompatible government grant support beyond permitted limits.",
    ],
    requiredDocuments: ["DPIIT recognition certificate", "Pitch deck", "Incorporation certificate", "Shareholding details", "Financial statements"],
    processSteps: [
      "Submit startup profile and scheme application.",
      "Select preferred incubator or review partner.",
      "Complete screening, pitch evaluation, and due diligence.",
      "Receive sanction, milestone terms, and disbursement path.",
    ],
    focusAreas: ["Proof of concept", "Prototype trials", "Commercialization", "Seed funding"],
    isOpen: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    iconName: "Rocket",
    icon: Rocket,
  },
  {
    id: "global-impact-program",
    slug: "global-impact-program",
    name: "Global Impact Program",
    partner: "BHASKAR",
    funding: "Up to ₹5 crore grant",
    tagline: "Scale measurable impact ventures with global ambition and strong governance.",
    shortDescription: "An impact program for ventures solving large social, climate, finance, health, education, or livelihood challenges.",
    longDescription:
      "The Global Impact Program supports mature impact ventures that can scale measurable outcomes. It emphasizes clear theory of change, governance, financial discipline, and credible plans for reaching underserved communities or climate-positive markets.",
    benefits: [
      "Grant support up to ₹5 crore for eligible high-impact scale initiatives.",
      "Impact measurement, governance, financial planning, and scale strategy reviews.",
      "Visibility with impact ecosystem partners, funders, and strategic collaborators.",
    ],
    eligibility: [
      "Applicant should have a measurable impact model and a credible operating track record.",
      "Solution should address social, climate, financial inclusion, health, education, or livelihood outcomes.",
      "Team should be able to provide financial statements, impact data, and scale plan.",
    ],
    requiredDocuments: ["Company profile", "Impact report", "Financial statements", "Scale proposal", "Governance documents"],
    processSteps: [
      "Submit company, impact, and financial details.",
      "Complete impact and governance review.",
      "Present scale proposal to the program panel.",
      "Finalize milestones, reporting framework, and grant access.",
    ],
    focusAreas: ["Impact scale", "Governance", "Financial discipline", "Global partnerships"],
    isOpen: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    iconName: "Globe2",
    icon: Globe2,
  },
];

export const getCatalogProgram = (slugOrId?: string) =>
  programCatalog.find((program) => program.slug === slugOrId || program.id === slugOrId);
