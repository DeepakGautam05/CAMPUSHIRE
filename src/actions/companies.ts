"use server";

import { prisma } from "@/lib/prisma";
import type { MockCompany } from "@/lib/mock-companies";

export async function getCompanies(): Promise<MockCompany[]> {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: "asc" },
      include: {
        vacancies: true,
      },
    });

    return companies.map((c: any) => ({
      id: c.id,
      name: c.name,
      industry: c.industry,
      location: c.location,
      website: c.website,
      about: c.about,
      hrContact: {
        name: c.hrName,
        role: c.hrRole,
        email: c.hrEmail,
        phone: c.hrPhone,
      },
      totalHires: c.totalHires,
      avgPackageLpa: c.avgPackageLpa || "6 LPA",
      highestPackageLpa: c.highestPackage || "12 LPA",
      hiringSince: c.hiringSince || "2023",
    }));
  } catch (error) {
    console.error("Failed to fetch companies from database:", error);
    return [];
  }
}

export async function getCompanyById(id: string): Promise<MockCompany | null> {
  try {
    const c = await prisma.company.findUnique({
      where: { id },
    });

    if (!c) return null;

    return {
      id: c.id,
      name: c.name,
      industry: c.industry,
      location: c.location,
      website: c.website,
      about: c.about,
      hrContact: {
        name: c.hrName,
        role: c.hrRole,
        email: c.hrEmail,
        phone: c.hrPhone,
      },
      totalHires: c.totalHires,
      avgPackageLpa: c.avgPackageLpa || "6 LPA",
      highestPackageLpa: c.highestPackage || "12 LPA",
      hiringSince: c.hiringSince || "2023",
    };
  } catch (error) {
    console.error(`Failed to fetch company ${id}:`, error);
    return null;
  }
}
