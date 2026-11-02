import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/app-shell";
import { applications, companies, vacancies } from "@/data/mock";
import { formatDate } from "@/lib/eligibility";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";

const stages: ApplicationStatus[] = ["Applied", "Shortlisted", "Interview", "Offered"];

const statusVariant: Record<ApplicationStatus, "default" | "primary" | "success" | "warning" | "danger"> = {
  Applied: "default",
  Shortlisted: "primary",
  Interview: "warning",
  Offered: "success",
  Rejected: "danger",
};

export default function MyApplicationsPage() {
  return (
    <>
      <PageHeader
        title="My applications"
        description="Track every application from applied to offer."
      />

      <div className="space-y-4">
        {applications.map((a) => {
          const v = vacancies.find((x) => x.id === a.vacancyId)!;
          const c = companies.find((x) => x.id === v.companyId)!;
          const rejected = a.status === "Rejected";
          const reached = stages.indexOf(a.status);

          return (
            <Card key={a.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/student/opportunities/${v.id}`}
                      className="font-semibold hover:underline"
                    >
                      {v.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {c.name} · Applied on {formatDate(a.appliedOn)}
                    </p>
                  </div>
                  <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
                </div>

                {!rejected && (
                  <ol className="grid grid-cols-4 gap-2">
                    {stages.map((s, i) => (
                      <li key={s} className="space-y-1.5">
                        <div
                          className={cn(
                            "h-1.5 rounded-full bg-muted",
                            i <= reached && "bg-primary"
                          )}
                        />
                        <p
                          className={cn(
                            "text-xs text-muted-foreground",
                            i <= reached && "font-medium text-foreground"
                          )}
                        >
                          {s}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
