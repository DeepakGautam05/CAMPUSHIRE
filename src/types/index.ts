export type Confidence = "high" | "verify" | "missing";

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  openVacancies: number;
  totalHires: number;
}

export type VacancyStatus = "draft" | "published" | "closed";

export interface Vacancy {
  id: string;
  companyId: string;
  title: string;
  location: string;
  workMode: "On-site" | "Hybrid" | "Remote";
  jobType: "Full-time" | "Internship";
  ctc: string;
  minCgpa: number;
  branches: string[];
  skills: string[];
  deadline: string;
  status: VacancyStatus;
  applicants: number;
  description: string;
}

export type ApplicationStatus =
  | "Applied"
  | "Shortlisted"
  | "Interview"
  | "Offered"
  | "Rejected";

export interface Application {
  id: string;
  vacancyId: string;
  studentId: string;
  status: ApplicationStatus;
  appliedOn: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  branch: string;
  cgpa: number;
  skills: string[];
  placed: boolean;
}

export interface ExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: Confidence;
  multiline?: boolean;
  hint?: string;
}
