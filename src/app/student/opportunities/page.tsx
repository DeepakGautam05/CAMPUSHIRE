"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, MapPin, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { applications, companies, students, vacancies } from "@/data/mock";
import { checkEligibility, formatDate } from "@/lib/eligibility";
import { cn } from "@/lib/utils";

const me = students[0];
const types = ["All", "Full-time", "Internship"] as const;

export default function OpportunitiesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [eligibleOnly, setEligibleOnly] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vacancies
      .filter((v) => v.status === "published")
      .filter((v) => type === "All" || v.jobType === type)
      .filter((v) => !eligibleOnly || checkEligibility(me, v).eligible)
      .filter((v) => {
        if (!q) return true;
        const company = companies.find((c) => c.id === v.companyId)?.name ?? "";
        return [v.title, company, v.location, ...v.skills]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
  }, [query, type, eligibleOnly]);

  return (
    <>
      <PageHeader
        title="Opportunities"
        description="Open drives from companies visiting campus."
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search role, company, skill…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "cursor-pointer rounded-md px-3 py-1 text-sm font-medium text-muted-foreground",
                type === t && "bg-card text-foreground shadow-sm"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={eligibleOnly}
            onChange={(e) => setEligibleOnly(e.target.checked)}
          />
          Eligible for me only
        </label>
      </div>

      {list.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No opportunities match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((v) => {
            const company = companies.find((c) => c.id === v.companyId)!;
            const { eligible } = checkEligibility(me, v);
            const applied = applications.some(
              (a) => a.vacancyId === v.id && a.studentId === me.id
            );
            return (
              <Link key={v.id} href={`/student/opportunities/${v.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{v.title}</p>
                        <p className="text-sm text-muted-foreground">{company.name}</p>
                      </div>
                      {applied ? (
                        <Badge variant="primary">Applied</Badge>
                      ) : eligible ? (
                        <Badge variant="success">Eligible</Badge>
                      ) : (
                        <Badge variant="danger">Not eligible</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {v.location} · {v.workMode}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" />
                        Apply by {formatDate(v.deadline)}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{v.ctc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {v.skills.map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
