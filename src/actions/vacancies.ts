"use server";

import { prisma } from "@/lib/prisma";
import type { Vacancy, VacancyStatus } from "@/types/vacancy";
import { revalidatePath } from "next/cache";

function mapDbVacancyToVacancy(v: any): Vacancy {
  return {
    id: v.id,
    companyId: v.companyId,
    companyName: v.companyName,
    roleTitle: v.roleTitle,
    employmentType: (v.employmentType === "Internship" ? "Internship" : "Full-time"),
    location: v.location,
    packageLpa: v.packageLpa,
    minCgpa: v.minCgpa.toString(),
    eligibleBranches: v.eligibleBranches,
    requiredSkills: v.requiredSkills,
    batch: v.batch,
    applicationDeadline: v.deadline ? v.deadline.toISOString().split("T")[0] : "",
    description: v.description,
    status: (v.status.toLowerCase()) as VacancyStatus,
    applicantsCount: v.applicantsCount || (v._count?.applications ?? 0),
    createdAt: v.createdAt ? v.createdAt.toISOString().split("T")[0] : "",
    backlogsAllowed: v.backlogsAllowed ?? 0,
  };
}

export async function getVacancies(): Promise<Vacancy[]> {
  try {
    const list = await prisma.vacancy.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return list.map(mapDbVacancyToVacancy);
  } catch (error) {
    console.error("Failed to fetch vacancies from database:", error);
    return [];
  }
}

export async function getVacancyById(id: string): Promise<Vacancy | null> {
  try {
    const v = await prisma.vacancy.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!v) return null;
    return mapDbVacancyToVacancy(v);
  } catch (error) {
    console.error(`Failed to fetch vacancy ${id}:`, error);
    return null;
  }
}

export async function getVacanciesByCompanyId(companyId: string): Promise<Vacancy[]> {
  try {
    const list = await prisma.vacancy.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return list.map(mapDbVacancyToVacancy);
  } catch (error) {
    console.error(`Failed to fetch vacancies for company ${companyId}:`, error);
    return [];
  }
}

export async function updateVacancyStatus(id: string, status: VacancyStatus) {
  try {
    const dbStatus = status.toUpperCase() as "DRAFT" | "PUBLISHED" | "CLOSED";
    const updated = await prisma.vacancy.update({
      where: { id },
      data: { status: dbStatus },
    });
    revalidatePath("/officer/vacancies");
    revalidatePath(`/officer/vacancies/${id}`);
    return { success: true, vacancy: mapDbVacancyToVacancy(updated) };
  } catch (error: any) {
    console.error(`Failed to update vacancy status ${id}:`, error);
    return { success: false, error: error.message };
  }
}
