import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, MapPin, Wallet } from "lucide-react";
import { ApplyPanel } from "@/components/apply-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { applications, companies, students, vacancies } from "@/data/mock";
import { checkEligibility, formatDate, skillMatch } from "@/lib/eligibility";

export function generateStaticParams() {
  return vacancies.map((v) => ({ id: v.id }));
}

async function Details({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vacancy = vacancies.find((v) => v.id === id);
  if (!vacancy) notFound();

  const me = students[0];
  const company = companies.find((c) => c.id === vacancy.companyId)!;
  const { eligible, reasons } = checkEligibility(me, vacancy);
  const { matched, missing } = skillMatch(me, vacancy);
  const applied = applications.some(
    (a) => a.vacancyId === vacancy.id && a.studentId === me.id
  );

  return (
    <>
      <Link
        href="/student/opportunities"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to opportunities
      </Link>

      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">{vacancy.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {company.name} · {company.industry}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="primary">{vacancy.jobType}</Badge>
          <Badge>
            <MapPin className="h-3 w-3" />
            {vacancy.location} · {vacancy.workMode}
          </Badge>
          <Badge>
            <Wallet className="h-3 w-3" />
            {vacancy.ctc}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About the role</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {vacancy.description}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills match</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {matched.map((s) => (
                  <Badge key={s} variant="success">
                    <Check className="h-3 w-3" />
                    {s}
                  </Badge>
                ))}
                {missing.map((s) => (
                  <Badge key={s} variant="warning">
                    {s}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Green skills are already on your profile. Amber ones are worth
                adding or learning before you apply.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eligibility criteria</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Minimum CGPA</p>
                <p className="font-medium">{vacancy.minCgpa.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Branches</p>
                <p className="font-medium">{vacancy.branches.join(", ")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="font-medium">{formatDate(vacancy.deadline)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <ApplyPanel
            eligible={eligible}
            reasons={reasons}
            alreadyApplied={applied}
            deadline={formatDate(vacancy.deadline)}
          />
        </div>
      </div>
    </>
  );
}

export default function VacancyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <Details params={params} />
    </Suspense>
  );
}
