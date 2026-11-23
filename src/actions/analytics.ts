"use server";

import { prisma } from "@/lib/prisma";

export async function getAnalyticsData() {
  try {
    const [totalStudents, placedStudents, totalVacancies, totalCompanies, applications] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { placed: true } }),
      prisma.vacancy.count(),
      prisma.company.count(),
      prisma.application.findMany({
        include: {
          student: true,
          vacancy: true,
        },
      }),
    ]);

    const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

    return {
      summary: {
        totalStudents,
        placedStudents,
        placementRate,
        totalVacancies,
        totalCompanies,
        totalApplications: applications.length,
      },
    };
  } catch (error) {
    console.error("Failed to calculate analytics:", error);
    return null;
  }
}
