// Phase 3 - Step 1: types for the officer vacancies list and details

export type VacancyStatus = "draft" | "published" | "closed";

export type Vacancy = {
  id: string;
  companyName: string;
  roleTitle: string;
  employmentType: "Full-time" | "Internship";
  location: string;
  packageLpa: string;
  minCgpa: string;
  eligibleBranches: string[];
  requiredSkills: string[];
  batch: string;
  applicationDeadline: string; // ISO date, e.g. "2026-11-05"
  description: string;
  status: VacancyStatus;
  applicantsCount: number;
  createdAt: string; // ISO date
};

export const STATUS_LABEL: Record<VacancyStatus, string> = {
  draft: "Draft",
  published: "Published",
  closed: "Closed",
};
