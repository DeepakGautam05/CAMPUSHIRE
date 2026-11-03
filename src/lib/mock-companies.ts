// Phase 3 - Step 5: realistic mock company profiles (no backend yet).
// The names match the companies used in mock-vacancies.ts.
import type { CompanyProfile } from "@/types/company";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const mockCompanies: CompanyProfile[] = [
  {
    id: "technova-solutions",
    name: "TechNova Solutions",
    industry: "SaaS",
    headquarters: "Noida",
    website: "technova.example.com",
    about:
      "TechNova builds cloud-based workflow tools for mid-size businesses. Teams are small and product-focused, and freshers work on real features from the first month.",
    hrName: "Meera Kapoor",
    hrEmail: "campus@technova.example.com",
    hrPhone: "+91 98100 00001",
    hiring: { studentsHired: 14, avgPackageLpa: "6.5 LPA", highestPackageLpa: "8 LPA", lastVisit: "Nov 2025" },
  },
  {
    id: "cloudkart",
    name: "CloudKart",
    industry: "E-commerce",
    headquarters: "Gurugram",
    website: "cloudkart.example.com",
    about:
      "CloudKart runs a large online marketplace and invests heavily in backend performance. Engineers own services end to end, from design to on-call.",
    hrName: "Rohit Malhotra",
    hrEmail: "talent@cloudkart.example.com",
    hrPhone: "+91 98100 00002",
    hiring: { studentsHired: 9, avgPackageLpa: "10 LPA", highestPackageLpa: "12 LPA", lastVisit: "Oct 2025" },
  },
  {
    id: "databridge-analytics",
    name: "DataBridge Analytics",
    industry: "Data & Analytics",
    headquarters: "Hyderabad",
    website: "databridge.example.com",
    about:
      "DataBridge helps retail and logistics companies turn raw data into dashboards and forecasts. It runs a popular remote internship programme every year.",
    hrName: "Sneha Iyer",
    hrEmail: "interns@databridge.example.com",
    hrPhone: "+91 98100 00003",
    hiring: { studentsHired: 6, avgPackageLpa: "5 LPA", highestPackageLpa: "6 LPA", lastVisit: "Sep 2025" },
  },
  {
    id: "pixelwave-studio",
    name: "Pixelwave Studio",
    industry: "Design & Media",
    headquarters: "Delhi",
    website: "pixelwave.example.com",
    about:
      "Pixelwave is a product design studio working with startups on web and mobile apps. Strong portfolios matter more than marks for its hiring.",
    hrName: "Ankit Bansal",
    hrEmail: "hello@pixelwave.example.com",
    hrPhone: "+91 98100 00004",
    hiring: { studentsHired: 4, avgPackageLpa: "5.5 LPA", highestPackageLpa: "7 LPA", lastVisit: "Oct 2025" },
  },
  {
    id: "securenet-systems",
    name: "SecureNet Systems",
    industry: "Cybersecurity",
    headquarters: "Pune",
    website: "securenet.example.com",
    about:
      "SecureNet provides network security and monitoring services to banks and enterprises. New joiners go through a three-month security bootcamp.",
    hrName: "Farhan Qureshi",
    hrEmail: "careers@securenet.example.com",
    hrPhone: "+91 98100 00005",
    hiring: { studentsHired: 11, avgPackageLpa: "8.5 LPA", highestPackageLpa: "10 LPA", lastVisit: "Aug 2025" },
  },
  {
    id: "finedge-technologies",
    name: "FinEdge Technologies",
    industry: "Fintech",
    headquarters: "Bengaluru",
    website: "finedge.example.com",
    about:
      "FinEdge builds payment and lending platforms used by banks across India. The engineering team follows strict code review and testing practices.",
    hrName: "Divya Menon",
    hrEmail: "campus@finedge.example.com",
    hrPhone: "+91 98100 00006",
    hiring: { studentsHired: 7, avgPackageLpa: "11.5 LPA", highestPackageLpa: "14 LPA", lastVisit: "Nov 2025" },
  },
  {
    id: "learnloop",
    name: "LearnLoop",
    industry: "EdTech",
    headquarters: "Noida",
    website: "learnloop.example.com",
    about:
      "LearnLoop is an online learning platform for school and college students. Interns work directly with the core product team on live features.",
    hrName: "Pooja Arora",
    hrEmail: "interns@learnloop.example.com",
    hrPhone: "+91 98100 00007",
    hiring: { studentsHired: 3, avgPackageLpa: "4.5 LPA", highestPackageLpa: "5 LPA", lastVisit: "First visit" },
  },
];
