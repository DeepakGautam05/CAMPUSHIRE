// Phase 3 - Step 5: types for the officer Companies pages
import type { Vacancy } from "@/types/vacancy";

export type CompanyProfile = {
  id: string; // slug of the company name, e.g. "technova-solutions"
  name: string;
  industry: string;
  headquarters: string;
  website: string;
  about: string;
  hrName: string;
  hrEmail: string;
  hrPhone: string;
  hiring: {
    studentsHired: number; // total hires from this campus (past years)
    avgPackageLpa: string;
    highestPackageLpa: string;
    lastVisit: string; // e.g. "Nov 2025", or "First visit"
  };
  // true when the company was not in the directory and was created
  // automatically from a vacancy (for example one made with the AI flow)
  autoCreated?: boolean;
};

// A company profile plus numbers calculated from the vacancy store
export type CompanyView = CompanyProfile & {
  vacancies: Vacancy[];
  activeVacancies: number; // published vacancies
  totalApplicants: number;
};
