// Phase 2 - Step 1: realistic mock "AI extraction" result
import type { ExtractedVacancy } from "@/types/vacancy-extraction";

export const mockExtractedVacancy: ExtractedVacancy = {
  companyName: {
    value: "TechNova Solutions",
    confidence: "high",
    note: "Found in the JD header",
  },
  roleTitle: {
    value: "Frontend Developer",
    confidence: "high",
    note: "Found in the JD title",
  },
  employmentType: {
    value: "Full-time",
    confidence: "high",
  },
  location: {
    value: "Noida (Hybrid)",
    confidence: "needs_verification",
    note: "JD mentions both Noida and WFH. Please confirm.",
  },
  packageLpa: {
    value: "6 - 8 LPA",
    confidence: "needs_verification",
    note: "Range looks unclear in the source text",
  },
  minCgpa: {
    value: "7.0",
    confidence: "high",
  },
  eligibleBranches: {
    value: ["CSE", "IT", "ECE"],
    confidence: "needs_verification",
    note: "Branches were inferred from the 'technical degree' line",
  },
  requiredSkills: {
    value: ["React", "TypeScript", "Tailwind CSS", "REST APIs", "Git"],
    confidence: "high",
  },
  batch: {
    value: "2027",
    confidence: "high",
  },
  applicationDeadline: {
    value: "",
    confidence: "missing",
    note: "No deadline found in the JD. Officer must add one.",
  },
  description: {
    value:
      "Build and maintain responsive user interfaces for our SaaS products, working closely with designers and backend engineers.",
    confidence: "high",
  },
};
