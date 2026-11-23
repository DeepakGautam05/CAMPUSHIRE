"use server";

import { prisma } from "@/lib/prisma";
import type { CohortStudent } from "@/lib/mock-students";
import { revalidatePath } from "next/cache";

export async function getStudents(): Promise<CohortStudent[]> {
  try {
    const students = await prisma.student.findMany({
      include: {
        applications: true,
      },
      orderBy: { rollNo: "asc" },
    });

    return students.map((s: any) => ({
      id: s.id,
      name: s.name,
      rollNo: s.rollNo,
      branch: s.branch,
      batch: s.batch,
      cgpa: s.cgpa,
      backlogs: s.backlogs,
      email: s.email,
      phone: s.phone,
      skills: s.skills,
      placed: s.placed,
      placedCompany: s.placedCompany || undefined,
      placedPackageLpa: s.placedPackageLpa || undefined,
      offerType: (s.offerType ? (s.offerType.charAt(0) + s.offerType.slice(1).toLowerCase()) : undefined) as any,
      appliedCount: s.applications.length,
      interviewsCount: s.applications.filter((a: any) => a.status === "INTERVIEW" || a.status === "OFFERED").length,
    }));
  } catch (error) {
    console.error("Failed to fetch students from database:", error);
    return [];
  }
}

export async function toggleStudentPlacement(
  id: string,
  placed: boolean,
  details?: { company?: string; packageLpa?: string }
) {
  try {
    const updated = await prisma.student.update({
      where: { id },
      data: {
        placed,
        placedCompany: placed ? details?.company : null,
        placedPackageLpa: placed ? details?.packageLpa : null,
      },
    });
    revalidatePath("/officer/students");
    return { success: true, student: updated };
  } catch (error: any) {
    console.error(`Failed to toggle placement for student ${id}:`, error);
    return { success: false, error: error.message };
  }
}
