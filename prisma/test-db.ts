import { prisma } from "../src/lib/prisma";

async function test() {
  console.log("🔍 Proving end-to-end connection to Neon PostgreSQL...");

  const companiesCount = await prisma.company.count();
  const vacanciesCount = await prisma.vacancy.count();
  const studentsCount = await prisma.student.count();
  const applicationsCount = await prisma.application.count();

  console.log(`🏢 Companies in Neon: ${companiesCount}`);
  console.log(`💼 Vacancies in Neon: ${vacanciesCount}`);
  console.log(`🎓 Students in Neon: ${studentsCount}`);
  console.log(`📝 Applications in Neon: ${applicationsCount}`);

  // Fetch sample company with vacancies
  const sampleCompany = await prisma.company.findFirst({
    where: { name: "TechNova Solutions" },
    include: { vacancies: true },
  });

  if (sampleCompany) {
    console.log(`\n✅ Verified sample company: "${sampleCompany.name}" (${sampleCompany.industry})`);
    console.log(`   - Associated Vacancies: ${sampleCompany.vacancies.length}`);
    for (const v of sampleCompany.vacancies) {
      console.log(`     • ${v.roleTitle} (${v.packageLpa}) - ${v.status}`);
    }
  }

  console.log("\n🎉 Database connection and queries verified end-to-end!");
}

test()
  .catch((e) => {
    console.error("Query failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
