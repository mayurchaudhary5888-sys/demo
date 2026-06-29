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
    name: "Idea Validation Support",
    partner: "BHASKAR",
    funding: "Up to ₹10 lakh grant",
    tagline: "Turn an early idea into a tested proof of concept.",
    shortDescription: "Support is provided to help early-stage startups and student innovators develop Proof of Concept (PoC) and Minimum Viable Product (MVP). Eligible startups may also receive grant support to build prototypes, validate their ideas, and transform innovative concepts into market-ready solutions.",
    longDescription:
      "Support is provided to help early-stage startups and student innovators develop Proof of Concept (PoC) and Minimum Viable Product (MVP). Eligible startups may also receive grant support to build prototypes, validate their ideas, and transform innovative concepts into market-ready solutions.",
    benefits: [
      "Grant support for prototype development, idea validation, and pilot readiness.",
      "Guidance for customer discovery, testing, and early product refinement.",
      "Support to move innovative concepts toward market-ready solutions.",
    ],
    eligibility: [
      "Best suited for early-stage startups and student innovators.",
      "Applicants should have an idea, prototype, or MVP that needs validation.",
      "Teams should be ready to share concept notes, prototype evidence, or testing details.",
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
    name: "MSME Support",
    partner: "iCreate",
    funding: "Up to ₹15 lakh grant",
    tagline: "Strengthen innovation, commercial readiness, and growth potential.",
    shortDescription: "Eligible innovators, startups, MSMEs, students, and entrepreneurs can access grant support for innovative ideas with strong commercialization potential. These non-equity, non-repayable grants help fund prototype development, product validation, technology development, testing, commercialization, and business incubation.",
    longDescription:
      "Eligible innovators, startups, MSMEs, students, and entrepreneurs can access grant support for innovative ideas with strong commercialization potential. These non-equity, non-repayable grants help fund prototype development, product validation, technology development, testing, commercialization, and business incubation.",
    benefits: [
      "Non-equity, non-repayable grant support for approved ideas.",
      "Funding for prototype development, product validation, and technology testing.",
      "Support for commercialization, incubation, and business growth planning.",
    ],
    eligibility: [
      "Open to eligible innovators, startups, MSMEs, students, and entrepreneurs.",
      "The idea should have strong commercialization potential.",
      "Applicants should be able to share basic project and business details.",
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
    name: "Foundation / CSR Support",
    partner: "BHASKAR",
    funding: "Up to ₹30 lakh grant",
    tagline: "Secure grants and CSR backing for purpose-led work.",
    shortDescription: "Support is provided to Foundations, Section 8 Companies, NGOs, and Social Enterprises to secure grants and CSR funding from corporate and institutional partners. We help with funding strategy, proposal development.",
    longDescription:
      "Support is provided to Foundations, Section 8 Companies, NGOs, and Social Enterprises to secure grants and CSR funding from corporate and institutional partners. We help with funding strategy, proposal development.",
    benefits: [
      "Support for CSR and grant funding strategy.",
      "Proposal development and partner outreach guidance.",
      "Help for organizations building structured social impact funding plans.",
    ],
    eligibility: [
      "Open to Foundations, Section 8 Companies, NGOs, and Social Enterprises.",
      "Applicants should have a clear social or community-focused mission.",
      "Teams should be ready to develop funding proposals and outreach materials.",
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
    name: "Startup Support",
    partner: "SISFS",
    funding: "₹20 lakh grant / ₹50 lakh loan",
    tagline: "Move from proof of concept to market entry with seed support.",
    shortDescription: "Seed fund aims to provide financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization. This would enable these startups to graduate to a level where they will be able to raise investments from angel investors or venture capitalists or seek loans from commercial banks or financial institutions.",
    longDescription:
      "Seed fund aims to provide financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization. This would enable these startups to graduate to a level where they will be able to raise investments from angel investors or venture capitalists or seek loans from commercial banks or financial institutions.",
    benefits: [
      "Seed support for proof of concept, prototype development, and product trials.",
      "Assistance for market entry and commercialization.",
      "Help for startups preparing to attract investors or institutional lending.",
    ],
    eligibility: [
      "Best suited for startups needing seed-stage commercialization support.",
      "Applicants should have an innovative product or service and clear growth intent.",
      "Teams should be ready to share pitch, incorporation, and ownership details.",
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
    name: "Global Impact Support",
    partner: "BHASKAR",
    funding: "Up to ₹5 crore grant",
    tagline: "Back innovative solutions creating social, environmental, and economic change.",
    shortDescription: "The Global Impact Grant is an international funding support established to support organizations that are developing innovative solutions to address social, environmental, and economic challenges across the world.",
    longDescription:
      "The Global Impact Grant is an international funding support established to support organizations that are developing innovative solutions to address social, environmental, and economic challenges across the world.",
    benefits: [
      "Grant support for high-impact solutions with global relevance.",
      "Support for social, environmental, and economic challenge areas.",
      "Visibility with partners focused on scale and measurable impact.",
    ],
    eligibility: [
      "Best suited for organizations with innovative impact solutions.",
      "Applicants should show potential for measurable social, environmental, or economic outcomes.",
      "Teams should be able to share impact evidence and scale plans.",
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
