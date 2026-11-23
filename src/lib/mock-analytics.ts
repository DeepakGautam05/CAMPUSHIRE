// Phase 4: Mock Placement Analytics data for Placement Officer insights

export interface AnalyticsSummary {
  totalStudents: number;
  eligibleStudents: number;
  placedStudents: number;
  placementRate: number;
  avgPackageLpa: number;
  medianPackageLpa: number;
  highestPackageLpa: number;
  companiesVisited: number;
  totalOffers: number;
  dreamOffers: number;
}

export const mockAnalyticsSummary: AnalyticsSummary = {
  totalStudents: 295,
  eligibleStudents: 260,
  placedStudents: 178,
  placementRate: 68.5,
  avgPackageLpa: 8.4,
  medianPackageLpa: 7.5,
  highestPackageLpa: 18.0,
  companiesVisited: 34,
  totalOffers: 214,
  dreamOffers: 42,
};

export const mockBranchAnalytics = [
  { branch: "CSE", total: 110, eligible: 102, placed: 86, rate: 84.3, avgLpa: 9.8 },
  { branch: "IT", total: 70, eligible: 64, placed: 48, rate: 75.0, avgLpa: 8.5 },
  { branch: "ECE", total: 65, eligible: 56, placed: 30, rate: 53.6, avgLpa: 7.2 },
  { branch: "EE", total: 50, eligible: 38, placed: 14, rate: 36.8, avgLpa: 6.8 },
];

export const mockCtcDistribution = [
  { range: "< 5 LPA", offers: 32, label: "Entry Level" },
  { range: "5 - 8 LPA", offers: 86, label: "Core Placement" },
  { range: "8 - 12 LPA", offers: 64, label: "High CTC" },
  { range: "12 - 16 LPA", offers: 24, label: "Dream Offers" },
  { range: "> 16 LPA", offers: 8, label: "Super Dream" },
];

export const mockHiringVelocity = [
  { month: "Jul", offers: 14, cumulative: 14 },
  { month: "Aug", offers: 22, cumulative: 36 },
  { month: "Sep", offers: 39, cumulative: 75 },
  { month: "Oct", offers: 53, cumulative: 128 },
  { month: "Nov", offers: 50, cumulative: 178 },
];

export const mockTopRecruiters = [
  { name: "TechNova Solutions", hires: 24, avgCtc: "7.2 LPA", highestCtc: "12.0 LPA", industry: "IT Services" },
  { name: "CloudKart", hires: 18, avgCtc: "10.5 LPA", highestCtc: "16.0 LPA", industry: "E-Commerce" },
  { name: "SecureNet Systems", hires: 15, avgCtc: "9.0 LPA", highestCtc: "15.0 LPA", industry: "Cybersecurity" },
  { name: "DataBridge Analytics", hires: 12, avgCtc: "8.0 LPA", highestCtc: "14.0 LPA", industry: "Analytics" },
  { name: "FinEdge Technologies", hires: 10, avgCtc: "12.0 LPA", highestCtc: "18.0 LPA", industry: "Fintech" },
  { name: "Pixelwave Studio", hires: 6, avgCtc: "6.0 LPA", highestCtc: "8.5 LPA", industry: "Design & Media" },
];

export interface SkillGapMetric {
  skill: string;
  category: "Technical" | "Cloud & DevOps" | "Data & AI" | "Soft Skills";
  marketDemandPercentage: number; // What % of recruiting companies require this
  studentProficiencyPercentage: number; // What % of students have proven proficiency
  gapPercentage: number; // Demand - Proficiency
  severity: "High Deficit" | "Moderate Deficit" | "Balanced" | "Surplus";
  recommendation: string;
}

export const mockSkillsGapAnalysis: SkillGapMetric[] = [
  {
    skill: "Docker & Kubernetes",
    category: "Cloud & DevOps",
    marketDemandPercentage: 78,
    studentProficiencyPercentage: 24,
    gapPercentage: 54,
    severity: "High Deficit",
    recommendation: "Organize campus hands-on weekend workshop on container orchestration and CI/CD pipelines.",
  },
  {
    skill: "System Design & Architecture",
    category: "Technical",
    marketDemandPercentage: 82,
    studentProficiencyPercentage: 35,
    gapPercentage: 47,
    severity: "High Deficit",
    recommendation: "Introduce weekly mock technical round discussions for High-Level (HLD) & Low-Level Design (LLD).",
  },
  {
    skill: "AWS / Cloud Infrastructure",
    category: "Cloud & DevOps",
    marketDemandPercentage: 75,
    studentProficiencyPercentage: 32,
    gapPercentage: 43,
    severity: "High Deficit",
    recommendation: "Provide sponsored AWS Academy vouchers and student sandbox cloud credits.",
  },
  {
    skill: "FastAPI / Node.js Microservices",
    category: "Technical",
    marketDemandPercentage: 70,
    studentProficiencyPercentage: 42,
    gapPercentage: 28,
    severity: "Moderate Deficit",
    recommendation: "Encourage students to build production-ready backend capstone APIs rather than monolithic apps.",
  },
  {
    skill: "Data Structures & Algorithms",
    category: "Technical",
    marketDemandPercentage: 90,
    studentProficiencyPercentage: 68,
    gapPercentage: 22,
    severity: "Moderate Deficit",
    recommendation: "Continue ongoing LeetCode contest leaderboards and timed peer-coding rounds.",
  },
  {
    skill: "GenAI & Prompt Engineering",
    category: "Data & AI",
    marketDemandPercentage: 65,
    studentProficiencyPercentage: 48,
    gapPercentage: 17,
    severity: "Moderate Deficit",
    recommendation: "Host a campus LLM hackathon focusing on practical retrieval-augmented generation (RAG) tools.",
  },
  {
    skill: "React & Next.js",
    category: "Technical",
    marketDemandPercentage: 68,
    studentProficiencyPercentage: 72,
    gapPercentage: -4,
    severity: "Balanced",
    recommendation: "Strong foundational baseline across the batch. Focus on performance optimization and testing.",
  },
  {
    skill: "Java / Python Core",
    category: "Technical",
    marketDemandPercentage: 85,
    studentProficiencyPercentage: 88,
    gapPercentage: -3,
    severity: "Balanced",
    recommendation: "Solid competency across branches. Maintain current coursework benchmarks.",
  },
];


