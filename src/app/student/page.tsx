import Link from "next/link";
import { Briefcase, CalendarClock, CheckCircle2, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { applications, companies, vacancies } from "@/data/mock";
import type { ApplicationStatus } from "@/types";

const statusVariant: Record<ApplicationStatus, "default" | "primary" | "success" | "warning" | "danger"> = {
  Applied: "default",
  Shortlisted: "primary",
  Interview: "warning",
  Offered: "success",
  Rejected: "danger",
};

export default function StudentDashboard() {
  const open = vacancies.filter((v) => v.status === "published");

  return (
    <>
      <PageHeader
        title="Hi Deepak 👋"
        description="Here's where your placement journey stands today."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open opportunities" value={open.length} icon={Briefcase} />
        <StatCard label="Applications" value={applications.length} icon={ClipboardList} />
        <StatCard label="Shortlisted" value={1} icon={CheckCircle2} />
        <StatCard label="Next deadline" value="22 Oct" icon={CalendarClock} note="Infosys · Systems Engineer" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent applications</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {applications.map((a) => {
              const v = vacancies.find((x) => x.id === a.vacancyId)!;
              const c = companies.find((x) => x.id === v.companyId)!;
              return (
                <div key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{c.name}</p>
                  </div>
                  <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended for you</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {open.slice(0, 3).map((v) => {
              const c = companies.find((x) => x.id === v.companyId)!;
              return (
                <div key={v.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{v.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.name} · {v.location} · {v.ctc}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/student/opportunities">View</Link>
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
