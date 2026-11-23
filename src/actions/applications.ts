"use server";

import { prisma } from "@/lib/prisma";
import type { PipelineApplication, ApplicationStage } from "@/lib/mock-pipeline-applications";
import { revalidatePath } from "next/cache";

const STAGE_MAP_FROM_DB: Record<string, ApplicationStage> = {
  APPLIED: "Applied",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  OFFERED: "Offered",
  REJECTED: "Rejected",
};

const STAGE_MAP_TO_DB: Record<ApplicationStage, "APPLIED" | "SHORTLISTED" | "INTERVIEW" | "OFFERED" | "REJECTED"> = {
  Applied: "APPLIED",
  Shortlisted: "SHORTLISTED",
  Interview: "INTERVIEW",
  Offered: "OFFERED",
  Rejected: "REJECTED",
};

export async function getApplications(): Promise<PipelineApplication[]> {
  try {
    const apps = await prisma.application.findMany({
      include: {
        student: true,
        vacancy: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { appliedOn: "desc" },
    });

    return apps.map((app: any) => ({
      id: app.id,
      studentId: app.studentId,
      studentName: app.student.name,
      rollNo: app.student.rollNo,
      branch: app.student.branch,
      cgpa: app.student.cgpa,
      backlogs: app.student.backlogs,
      email: app.student.email,
      phone: app.student.phone,
      vacancyId: app.vacancyId,
      vacancyTitle: app.vacancy.roleTitle,
      companyId: app.vacancy.companyId,
      companyName: app.vacancy.companyName,
      packageLpa: app.vacancy.packageLpa,
      status: STAGE_MAP_FROM_DB[app.status] || "Applied",
      appliedOn: app.appliedOn.toISOString().split("T")[0],
      skills: app.student.skills,
      notes: app.notes || undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch applications from database:", error);
    return [];
  }
}

export async function updateApplicationStatus(id: string, stage: ApplicationStage, notes?: string) {
  try {
    const dbStatus = STAGE_MAP_TO_DB[stage];
    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: dbStatus,
        ...(notes !== undefined ? { notes } : {}),
      },
    });
    revalidatePath("/officer/applications");
    return { success: true, updated };
  } catch (error: any) {
    console.error(`Failed to update application status ${id}:`, error);
    return { success: false, error: error.message };
  }
}
