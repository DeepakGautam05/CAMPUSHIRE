import { PrismaClient, VacancyStatus, ApplicationStatus, OfferType, Role } from "@prisma/client";
import { mockCompanies } from "../src/lib/mock-companies";
import { mockVacancies } from "../src/lib/mock-vacancies";
import { mockCohortStudents } from "../src/lib/mock-students";
import { mockPipelineApplications } from "../src/lib/mock-pipeline-applications";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding for CampusHire...");

  // Clear existing records in reverse dependency order
  await prisma.application.deleteMany();
  await prisma.vacancy.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log("🧹 Cleaned existing database tables.");

  // 1. Seed Companies
  console.log("🏢 Seeding companies...");
  const companyMap = new Map<string, string>(); // oldId -> newDbId

  for (const c of mockCompanies) {
    const created = await prisma.company.create({
      data: {
        name: c.name,
        industry: c.industry,
        location: c.location,
        website: c.website,
        about: c.about,
        hrName: c.hrContact.name,
        hrRole: c.hrContact.role,
        hrEmail: c.hrContact.email,
        hrPhone: c.hrContact.phone,
        totalHires: c.totalHires,
        avgPackageLpa: c.avgPackageLpa,
        highestPackage: c.highestPackageLpa,
        hiringSince: c.hiringSince,
      },
    });
    companyMap.set(c.id, created.id);
  }

  // 2. Seed Vacancies
  console.log("💼 Seeding vacancies...");
  const vacancyMap = new Map<string, string>(); // oldId -> newDbId

  for (const v of mockVacancies) {
    const companyDbId = companyMap.get(v.companyId);
    if (!companyDbId) continue;

    const statusEnum: VacancyStatus =
      v.status === "published"
        ? VacancyStatus.PUBLISHED
        : v.status === "closed"
        ? VacancyStatus.CLOSED
        : VacancyStatus.DRAFT;

    const created = await prisma.vacancy.create({
      data: {
        companyId: companyDbId,
        companyName: v.companyName,
        roleTitle: v.roleTitle,
        employmentType: v.employmentType,
        location: v.location,
        packageLpa: v.packageLpa,
        minCgpa: parseFloat(v.minCgpa),
        eligibleBranches: v.eligibleBranches,
        requiredSkills: v.requiredSkills,
        batch: v.batch,
        deadline: new Date(v.applicationDeadline),
        description: v.description,
        status: statusEnum,
        backlogsAllowed: v.backlogsAllowed ?? 0,
        applicantsCount: v.applicantsCount,
      },
    });
    vacancyMap.set(v.id, created.id);
  }

  // 3. Seed Students
  console.log("🎓 Seeding students...");
  const studentMap = new Map<string, string>(); // rollNo -> newDbId

  for (const s of mockCohortStudents) {
    // Create base user
    const user = await prisma.user.create({
      data: {
        email: s.email,
        name: s.name,
        role: Role.STUDENT,
      },
    });

    const offerEnum: OfferType | undefined =
      s.offerType === "Dream"
        ? OfferType.DREAM
        : s.offerType === "Regular"
        ? OfferType.REGULAR
        : s.offerType === "Internship"
        ? OfferType.INTERNSHIP
        : undefined;

    const created = await prisma.student.create({
      data: {
        userId: user.id,
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
        placedCompany: s.placedCompany,
        placedPackageLpa: s.placedPackageLpa,
        offerType: offerEnum,
      },
    });
    studentMap.set(s.rollNo, created.id);
  }

  // 4. Seed Applications
  console.log("📝 Seeding pipeline applications...");
  for (const app of mockPipelineApplications) {
    const vacancyDbId = vacancyMap.get(app.vacancyId);
    const studentDbId = studentMap.get(app.rollNo);

    if (!vacancyDbId || !studentDbId) continue;

    const stageEnum: ApplicationStatus =
      app.status === "Shortlisted"
        ? ApplicationStatus.SHORTLISTED
        : app.status === "Interview"
        ? ApplicationStatus.INTERVIEW
        : app.status === "Offered"
        ? ApplicationStatus.OFFERED
        : app.status === "Rejected"
        ? ApplicationStatus.REJECTED
        : ApplicationStatus.APPLIED;

    await prisma.application.create({
      data: {
        vacancyId: vacancyDbId,
        studentId: studentDbId,
        status: stageEnum,
        notes: app.notes,
        appliedOn: new Date(app.appliedOn),
      },
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
