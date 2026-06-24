/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export const STATE_CITIES: Record<string, string[]> = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Dharwad"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Ghaziabad", "Agra", "Varanasi", "Prayagraj"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol", "Durgapur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Rohtak"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"]
};

// Fallback cities for other states
export const DEFAULT_CITIES = ["Capital City", "Hub City", "Metro 1", "District Headquarter"];

export const SECTORS = [
  "FinTech",
  "EdTech",
  "HealthTech",
  "AgriTech",
  "AI & ML",
  "SaaS",
  "Cybersecurity",
  "Logistics",
  "CleanTech",
  "E-Commerce",
  "BioTech",
  "DeepTech",
  "Robotics",
  "SpaceTech",
  "Other"
];

export const STARTUP_TYPES = [
  "Product (Hardware)",
  "Product (Software/SaaS)",
  "Service-based",
  "Marketplace",
  "Platform",
  "Hybrid"
];

export const ENTITY_TYPES = [
  "Startup",
  "MSME",
  "Incubator/Accelerator",
  "Student/Aspiring Entrepreneur",
  "Government Body / Official",
  "Corporate Partner",
  "Investor (Angel/VC)",
  "Other"
];

export const QUERY_TYPES = [
  "General Inquiry",
  "Program Support",
  "Application Support",
  "Technical Support & Portal Errors",
  "Partnership & Collaboration",
  "Funding & Seed Fund Related",
  "Other"
];

export const SUPPORT_REQUIRED_LIST = [
  "Funding & Grants",
  "Mentorship & Technical Advice",
  "Incubation Space & Co-working",
  "Networking & Peer Access",
  "Government Schemes & DPIIT Benefits",
  "Market Access & Enterprise Sales",
  "Legal & Regulatory Compliance",
  "Technology Infrastructure & Cloud Credits"
];
