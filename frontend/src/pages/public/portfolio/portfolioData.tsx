import type React from "react";
import { Building2, FlaskConical, GraduationCap, Leaf, Microscope, Rocket, ShieldCheck, Sprout } from "lucide-react";

export type IncubatorPortfolioItem = {
  id: string;
  name: string;
  city: string;
  state: string;
  description: string;
  image: string;
  domains: string[];
  approvedStartups: number;
  fundOutlay: string;
  icon: React.ReactNode;
};

export const portfolioImages = {
  incubator: "/assets/about-us/incubation.png",
  startup: "/assets/about-us/startup.jpg",
};

export const incubatorPortfolio: IncubatorPortfolioItem[] = [
  {
    id: "inc-01",
    name: "Forum for Innovation Incubation Research and Entrepreneurship",
    city: "Margao",
    state: "Goa",
    description:
      "A coastal innovation hub supporting founders with structured mentorship, validation labs, and seed fund readiness.",
    image: portfolioImages.incubator,
    domains: ["Aeronautics", "CleanTech", "Manufacturing", "Tourism Tech"],
    approvedStartups: 42,
    fundOutlay: "10.5 Cr",
    icon: <Rocket className="h-5 w-5" />,
  },
  {
    id: "inc-02",
    name: "Indian Institute of Management Kozhikode, LIVE",
    city: "Kozhikode",
    state: "Kerala",
    description:
      "A management-led launchpad for founders building scalable ventures across agri-tech, SaaS, and consumer innovation.",
    image: portfolioImages.startup,
    domains: ["Agri-Tech", "SaaS", "Consumer", "Climate"],
    approvedStartups: 58,
    fundOutlay: "15 Cr",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: "inc-03",
    name: "Crescent Innovation & Incubation Council",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    description:
      "An engineering-focused incubator enabling prototyping, product trials, and venture building support for student innovators.",
    image: portfolioImages.incubator,
    domains: ["3D Printing", "IoT", "Robotics", "HealthTech"],
    approvedStartups: 36,
    fundOutlay: "8 Cr",
    icon: <Microscope className="h-5 w-5" />,
  },
  {
    id: "inc-04",
    name: "T-Hub Innovation Sandbox",
    city: "Hyderabad",
    state: "Telangana",
    description:
      "A high-growth ecosystem node connecting startups with enterprise pilots, investor discovery, and acceleration tracks.",
    image: portfolioImages.startup,
    domains: ["DeepTech", "Cybersecurity", "AI", "Enterprise"],
    approvedStartups: 64,
    fundOutlay: "18 Cr",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    id: "inc-05",
    name: "BIRAC BioNEST Venture Lab",
    city: "Pune",
    state: "Maharashtra",
    description:
      "A life-sciences venture lab offering wet-lab access, validation support, and technical review for biotech founders.",
    image: portfolioImages.incubator,
    domains: ["BioTech", "MedTech", "Diagnostics", "Research"],
    approvedStartups: 29,
    fundOutlay: "7.5 Cr",
    icon: <FlaskConical className="h-5 w-5" />,
  },
  {
    id: "inc-06",
    name: "Rural Innovation & Sustainability Centre",
    city: "Ahmedabad",
    state: "Gujarat",
    description:
      "A sustainability-first incubator helping rural and climate-oriented startups move from pilots to market adoption.",
    image: portfolioImages.startup,
    domains: ["AgriTech", "Water", "Waste", "Rural"],
    approvedStartups: 31,
    fundOutlay: "9 Cr",
    icon: <Sprout className="h-5 w-5" />,
  },
];

export const startupIndustries = ["Agriculture", "Healthcare", "Finance", "Education", "Clean Energy", "Mobility"];
export const startupSectors = ["AgriTech", "HealthTech", "FinTech", "CleanTech", "EdTech"];
export const incubatorDomains = ["Agri-Tech", "DeepTech", "IoT", "Robotics", "BioTech", "CleanTech"];

export const portfolioMetrics = [
  { label: "Approved incubators", value: "165+", icon: <ShieldCheck className="h-5 w-5" /> },
  { label: "Selected startups", value: "3291", icon: <Rocket className="h-5 w-5" /> },
  { label: "Priority domains", value: "40+", icon: <Leaf className="h-5 w-5" /> },
];
