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
    name: "Idea Validation Support (Grant up to ₹10 Lakhs)",
    partner: "BHASKAR",
    funding: "Up to ₹10 lakh grant",
    tagline: "Turn an early idea into a tested proof of concept.",
    shortDescription: "Support is provided to help early-stage startups and student innovators develop Proof of Concept (PoC) and Minimum Viable Product (MVP). Eligible applicants can receive grant support of up to ₹10 lakhs to build prototypes, validate innovative ideas, and transform concepts into market-ready solutions.",
    longDescription:
      "Support is provided to help early-stage startups and student innovators develop Proof of Concept (PoC) and Minimum Viable Product (MVP). Eligible applicants can receive grant support of up to ₹10 lakhs to build prototypes, validate innovative ideas, and transform concepts into market-ready solutions.",
    benefits: [
      "Grant support of up to ₹10 lakhs (subject to scheme guidelines).",
      "Funding for PoC and MVP development.",
      "Prototype design, testing, and product validation support.",
      "Assistance in technology development and commercialization.",
      "Expert mentoring and incubation support.",
      "Increased investor readiness for angel, VC, and government funding opportunities.",
    ],
    eligibility: [
      "Open to applicants from all sectors and industries.",
      "Early-stage startups with an innovative and scalable business idea.",
      "Student innovators developing technology-driven or impactful solutions.",
      "Startups with a clear Proof of Concept (PoC) or prototype development plan.",
      "Applicants with innovation that has commercialization potential.",
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
    name: "MSME Support (Grant up to ₹15 Lakhs)",
    partner: "iCreate",
    funding: "Up to ₹15 lakh grant",
    tagline: "Strengthen innovation, commercial readiness, and growth potential.",
    shortDescription: "The MSME Support helps eligible MSMEs, startups, innovators, students, and entrepreneurs access grant funding of up to ₹15 lakhs for innovative projects with strong commercialization. These non-equity, non-repayable grants support product development, technology innovation, testing, and business growth.",
    longDescription:
      "The MSME Support helps eligible MSMEs, startups, innovators, students, and entrepreneurs access grant funding of up to ₹15 lakhs for innovative projects with strong commercialization. These non-equity, non-repayable grants support product development, technology innovation, testing, and business growth.",
    benefits: [
      "Grant support of up to ₹15 lakhs (subject to scheme guidelines).",
      "Non-equity and non-repayable financial assistance.",
      "Funding for prototype development and product validation.",
      "Support for technology development, testing, and commercialization.",
      "Assistance with business incubation and innovation scaling.",
      "Expert guidance for project execution and access to government support programs.",
    ],
    eligibility: [
      "Indian citizens with a valid mobile number and email ID.",
      "Applicants can apply under any of the following categories: MSMEs (with a valid Udyam Registration), Students, or Individual Innovators.",
      "The proposed idea should be an innovative & scalable business, with strong prototype development and commercialization potential.",
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
    name: "Foundation / CSR Support (Grant up to ₹40 Lakhs)",
    partner: "BHASKAR",
    funding: "Up to ₹40 lakh grant",
    tagline: "Secure grants and CSR backing for purpose-led work.",
    shortDescription: "The Foundation / CSR Support helps Foundations, Section 8 Companies, NGOs, and Social Enterprises access grant funding of up to ₹40 lakhs and CSR funding from corporate and institutional partners.",
    longDescription:
      "The Foundation / CSR Support helps Foundations, Section 8 Companies, NGOs, and Social Enterprises access grant funding of up to ₹40 lakhs and CSR funding from corporate and institutional partners.",
    benefits: [
      "Grant support of up to ₹40 lakhs",
      "Access to Corporate CSR and Institutional Grant opportunities.",
      "CSR partnership identification and corporate connect.",
      "Funding for social impact, innovation, education, healthcare, sustainability, livelihood, and community development projects.",
    ],
    eligibility: [
      "Registered Section 8 Companies, Trusts, and Societies.",
      "Registered NGOs, Foundations, and Social Enterprises.",
      "Organizations with a clear social impact project and implementation plan.",
      "Valid registration, PAN, and bank account in the organization's name.",
      "Organizations complying with applicable statutory and CSR eligibility requirements.",
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
    name: "Startup Support (Funding up to ₹70 Lakhs)",
    partner: "SISFS",
    funding: "Funding up to ₹70 Lakhs",
    tagline: "Move from proof of concept to market entry with seed support.",
    shortDescription: "Seed fund aims to provide financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization. This would enable these startups to graduate to a level where they will be able to raise investments from angel investors or venture capitalists or seek loans from commercial banks or financial institutions.",
    longDescription:
      "Seed fund aims to provide financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization. This would enable these startups to graduate to a level where they will be able to raise investments from angel investors or venture capitalists or seek loans from commercial banks or financial institutions.",
    benefits: [
      "Eligible startups incorporated on or after 2023 can receive funding of up to ₹70 lakhs.",
      "Up to ₹20 lakhs as a non-repayable grant for PoC, prototype development, and product validation.",
      "Up to ₹50 lakhs as a repayable seed support, repayable after a 1-year moratorium through EMIs over the next 5 years, at an annual interest rate of 6.5%.",
    ],
    eligibility: [
      "The applicant must be registered as a Private Limited Company, Limited Liability Partnership (LLP), or Foundation.",
      "The organization must be legally incorporated in India.",
      "Private Limited Companies and LLPs incorporated on or after 2023 are eligible to apply.",
      "Startups from all industries and sectors are eligible (Sector-Agnostic).",
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
    name: "Global Impact Support (Grant up to ₹5 Crores)",
    partner: "BHASKAR",
    funding: "Up to ₹5 crore grant",
    tagline: "Back innovative solutions creating social, environmental, and economic change.",
    shortDescription: "The Global Impact Support Program provides grant funding of up to ₹5 crores to organizations developing innovative solutions that address global social, environmental, economic, and sustainability challenges.",
    longDescription:
      "The Global Impact Support Program provides grant funding of up to ₹5 crores to organizations developing innovative solutions that address global social, environmental, economic, and sustainability challenges. The program supports high-impact projects with the potential to create measurable and scalable change at national and international levels.",
    benefits: [
      "Grant support of up to ₹5 crores.",
      "Funding for research, innovation, pilot projects, and large-scale implementation.",
      "Support for technology development, product validation, and commercialization.",
      "Access to international funding agencies, philanthropic foundations, and global development partners.",
      "Strategic mentoring, capacity building, and global networking opportunities.",
    ],
    eligibility: [
      "Registered Private Limited Companies, LLPs, Section 8 Companies, Trusts, Societies, Foundations, and NGOs.",
      "Projects with significant social, environmental, healthcare, education, climate, agriculture, or economic impact and Sector-Agnostic.",
      "Innovative solutions with demonstrated scalability and measurable outcomes.",
      "Organizations capable of implementing and managing large-scale impact projects.",
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
