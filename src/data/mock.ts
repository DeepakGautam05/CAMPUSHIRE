import type {
  Application,
  Company,
  ExtractedField,
  Student,
  Vacancy,
} from "@/types";

export const companies: Company[] = [
  { id: "c1", name: "Infosys", industry: "IT Services", location: "Bengaluru", website: "infosys.com", openVacancies: 3, totalHires: 42 },
  { id: "c2", name: "Razorpay", industry: "Fintech", location: "Bengaluru", website: "razorpay.com", openVacancies: 2, totalHires: 11 },
  { id: "c3", name: "Zomato", industry: "Consumer Tech", location: "Gurugram", website: "zomato.com", openVacancies: 1, totalHires: 8 },
  { id: "c4", name: "Paytm", industry: "Fintech", location: "Noida", website: "paytm.com", openVacancies: 2, totalHires: 15 },
  { id: "c5", name: "Capgemini", industry: "IT Services", location: "Noida", website: "capgemini.com", openVacancies: 4, totalHires: 37 },
];

export const vacancies: Vacancy[] = [
  {
    id: "v1", companyId: "c2", title: "Frontend Developer", location: "Bengaluru", workMode: "Hybrid", jobType: "Full-time",
    ctc: "₹8–10 LPA", minCgpa: 7.0, branches: ["CSE", "IT"], skills: ["React", "TypeScript", "Tailwind CSS"],
    deadline: "2026-10-28", status: "published", applicants: 64,
    description: "Build and maintain merchant-facing dashboards used by thousands of businesses.",
  },
  {
    id: "v2", companyId: "c1", title: "Systems Engineer", location: "Pune", workMode: "On-site", jobType: "Full-time",
    ctc: "₹4.5 LPA", minCgpa: 6.0, branches: ["CSE", "IT", "ECE"], skills: ["Java", "SQL", "DSA"],
    deadline: "2026-10-22", status: "published", applicants: 188,
    description: "Join the Infosys training program and work on enterprise client projects.",
  },
  {
    id: "v3", companyId: "c3", title: "SDE Intern", location: "Gurugram", workMode: "On-site", jobType: "Internship",
    ctc: "₹40k / month", minCgpa: 7.5, branches: ["CSE", "IT"], skills: ["Python", "DSA", "REST APIs"],
    deadline: "2026-11-05", status: "published", applicants: 97,
    description: "Six-month internship with a chance of a pre-placement offer.",
  },
  {
    id: "v4", companyId: "c4", title: "Full Stack Developer", location: "Noida", workMode: "Hybrid", jobType: "Full-time",
    ctc: "₹6–8 LPA", minCgpa: 6.5, branches: ["CSE", "IT"], skills: ["Node.js", "React", "MongoDB"],
    deadline: "2026-11-10", status: "draft", applicants: 0,
    description: "Work across the stack on payments and wallet features.",
  },
  {
    id: "v5", companyId: "c5", title: "Analyst", location: "Noida", workMode: "On-site", jobType: "Full-time",
    ctc: "₹4 LPA", minCgpa: 6.0, branches: ["CSE", "IT", "ECE", "ME"], skills: ["Aptitude", "Communication", "SQL"],
    deadline: "2026-10-15", status: "closed", applicants: 240,
    description: "Entry-level analyst role across delivery teams.",
  },
];

export const students: Student[] = [
  { id: "s1", name: "Deepak", rollNo: "233114", branch: "CSE", cgpa: 8.1, skills: ["React", "Next.js", "DSA", "Python"], placed: false },
  { id: "s2", name: "Aarav Sharma", rollNo: "233101", branch: "CSE", cgpa: 8.6, skills: ["Java", "SQL", "Spring"], placed: true },
  { id: "s3", name: "Riya Verma", rollNo: "233122", branch: "IT", cgpa: 7.4, skills: ["Python", "ML", "SQL"], placed: false },
  { id: "s4", name: "Karan Singh", rollNo: "233140", branch: "ECE", cgpa: 6.8, skills: ["C++", "Embedded"], placed: false },
  { id: "s5", name: "Neha Gupta", rollNo: "233156", branch: "CSE", cgpa: 9.0, skills: ["React", "Node.js", "AWS"], placed: true },
];

export const applications: Application[] = [
  { id: "a1", vacancyId: "v1", studentId: "s1", status: "Shortlisted", appliedOn: "2026-10-03" },
  { id: "a2", vacancyId: "v2", studentId: "s1", status: "Applied", appliedOn: "2026-10-05" },
  { id: "a3", vacancyId: "v3", studentId: "s1", status: "Interview", appliedOn: "2026-09-29" },
  { id: "a4", vacancyId: "v5", studentId: "s1", status: "Rejected", appliedOn: "2026-09-20" },
];

export const analyticsMonthly = [
  { month: "May", placed: 4 },
  { month: "Jun", placed: 9 },
  { month: "Jul", placed: 14 },
  { month: "Aug", placed: 22 },
  { month: "Sep", placed: 31 },
  { month: "Oct", placed: 38 },
];

export const analyticsByBranch = [
  { branch: "CSE", placed: 86, total: 110 },
  { branch: "IT", placed: 48, total: 70 },
  { branch: "ECE", placed: 30, total: 65 },
  { branch: "ME", placed: 14, total: 50 },
];

/** Mock result of the AI JD extraction, used by the review page. */
export const extractedVacancy: ExtractedField[] = [
  { key: "company", label: "Company", value: "Razorpay", confidence: "high" },
  { key: "title", label: "Job title", value: "Frontend Developer", confidence: "high" },
  { key: "location", label: "Location", value: "Bengaluru", confidence: "high" },
  { key: "workMode", label: "Work mode", value: "Hybrid", confidence: "verify", hint: "JD says \"flexible work setup\", which may mean hybrid or remote." },
  { key: "jobType", label: "Job type", value: "Full-time", confidence: "high" },
  { key: "ctc", label: "CTC / Stipend", value: "8–10 LPA", confidence: "verify", hint: "Range found in the JD footer; confirm with the company." },
  { key: "minCgpa", label: "Minimum CGPA", value: "7.0", confidence: "high" },
  { key: "branches", label: "Eligible branches", value: "CSE, IT", confidence: "verify", hint: "JD says \"computer-related branches\"." },
  { key: "skills", label: "Required skills", value: "React, TypeScript, Tailwind CSS, REST APIs", confidence: "high" },
  { key: "deadline", label: "Application deadline", value: "", confidence: "missing", hint: "No deadline found in the JD." },
  { key: "bond", label: "Service agreement", value: "", confidence: "missing", hint: "Not mentioned." },
  { key: "description", label: "Role description", value: "Build and maintain merchant-facing dashboards, work closely with design and backend teams, and ship accessible, performant UI.", confidence: "high", multiline: true },
];
