// Phase 3 - Step 5: company data for the officer pages.
//
// There is no separate company database yet. We combine two sources:
//   1. mockCompanies: profile details (about, HR contact, hiring history)
//   2. the vacancy store: every vacancy has a companyName
//
// Vacancy counts are calculated live from the store, so a vacancy created with
// the AI flow shows up on its company page. If a vacancy belongs to a company
// that is not in the directory, a basic profile is created for it automatically.
// When the real backend arrives, only this file needs to change.

import { useMemo } from "react";
import { mockCompanies, slugify } from "@/lib/mock-companies";
import { useVacancies } from "@/lib/vacancy-store";
import type { CompanyProfile, CompanyView } from "@/types/company";
import type { Vacancy } from "@/types/vacancy";

function autoProfile(name: string, location: string): CompanyProfile {
  return {
    id: slugify(name),
    name,
    industry: "Not specified",
    headquarters: location || "Not specified",
    website: "",
    about:
      "This company was added automatically from a vacancy. Its full profile has not been filled in yet.",
    hrName: "",
    hrEmail: "",
    hrPhone: "",
    hiring: {
      studentsHired: 0,
      avgPackageLpa: "-",
      highestPackageLpa: "-",
      lastVisit: "First visit",
    },
    autoCreated: true,
  };
}

function buildCompanies(vacancies: Vacancy[]): CompanyView[] {
  const profiles = new Map<string, CompanyProfile>();
  for (const c of mockCompanies) profiles.set(c.id, c);

  // add a basic profile for any company that only exists in a vacancy
  for (const v of vacancies) {
    const id = slugify(v.companyName);
    if (id && !profiles.has(id)) profiles.set(id, autoProfile(v.companyName.trim(), v.location));
  }

  return Array.from(profiles.values())
    .map((profile) => {
      const own = vacancies.filter((v) => slugify(v.companyName) === profile.id);
      return {
        ...profile,
        vacancies: own,
        activeVacancies: own.filter((v) => v.status === "published").length,
        totalApplicants: own.reduce((sum, v) => sum + v.applicantsCount, 0),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function useCompanies(): CompanyView[] {
  const vacancies = useVacancies();
  return useMemo(() => buildCompanies(vacancies), [vacancies]);
}

export function useCompany(id: string): CompanyView | undefined {
  return useCompanies().find((c) => c.id === id);
}
