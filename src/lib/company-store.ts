// Phase 3 - Step 5: company data for the officer pages.

import { useMemo } from "react";
import { mockCompanies } from "@/lib/mock-companies";
import { useVacancies } from "@/lib/vacancy-store";
import type { CompanyProfile, CompanyView } from "@/types/company";
import type { Vacancy } from "@/types/vacancy";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  for (const c of mockCompanies) {
    profiles.set(c.id, {
      id: c.id,
      name: c.name,
      industry: c.industry,
      headquarters: c.location,
      website: c.website,
      about: c.about,
      hrName: c.hrContact.name,
      hrEmail: c.hrContact.email,
      hrPhone: c.hrContact.phone,
      hiring: {
        studentsHired: c.totalHires,
        avgPackageLpa: c.avgPackageLpa,
        highestPackageLpa: c.highestPackageLpa,
        lastVisit: c.hiringSince,
      },
    });
  }

  // add a basic profile for any company that only exists in a vacancy
  for (const v of vacancies) {
    const id = slugify(v.companyName);
    if (id && !profiles.has(id)) profiles.set(id, autoProfile(v.companyName.trim(), v.location));
  }

  return Array.from(profiles.values()).map((p) => {
    const companyVacancies = vacancies.filter(
      (v) => slugify(v.companyName) === p.id || v.companyName.toLowerCase() === p.name.toLowerCase()
    );
    const activeVacancies = companyVacancies.filter((v) => v.status === "published").length;
    const totalApplicants = companyVacancies.reduce((sum, v) => sum + v.applicantsCount, 0);

    return {
      ...p,
      vacancies: companyVacancies,
      activeVacancies,
      totalApplicants,
    };
  });
}

export function useCompanies(): CompanyView[] {
  const vacancies = useVacancies();
  return useMemo(() => buildCompanies(vacancies), [vacancies]);
}

export function useCompany(id: string): CompanyView | undefined {
  const companies = useCompanies();
  return companies.find((c) => c.id === id);
}
