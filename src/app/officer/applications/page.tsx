"use client";

// Phase 3 - Step 8: Officer Applications
// Tabs by status + search + a status dropdown per row (saved in localStorage). Mock data only.
// Opening /officer/applications?vacancy=<id> shows only the applications of that vacancy.

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  APPLICATION_STATUSES,
  setApplicationStatus,
  useApplications,
} from "@/lib/application-store";
import { formatDate } from "@/lib/format";
import { getStudent } from "@/lib/mock-students";
import { useVacancies } from "@/lib/vacancy-store";
import type { ApplicationStatus } from "@/types";

type Filter = "all" | ApplicationStatus;

const STATUS_VARIANT: Record<ApplicationStatus, "primary" | "warning" | "success" | "danger" | "default"> = {
  Applied: "default",
  Shortlisted: "primary",
  Interview: "warning",
  Offered: "success",
  Rejected: "danger",
};

export default function OfficerApplicationsPage() {
  const searchParams = useSearchParams();
  const vacancyFilter = searchParams.get("vacancy");

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const applications = useApplications();
  const vacancies = useVacancies();

  // Join each application with its student and vacancy
  const rows = useMemo(() => {
    return applications
      .map((a) => ({
        application: a,
        student: getStudent(a.studentId),
        vacancy: vacancies.find((v) => v.id === a.vacancyId),
      }))
      .filter((r) => r.student && r.vacancy)
      .filter((r) => !vacancyFilter || r.application.vacancyId === vacancyFilter);
  }, [applications, vacancies, vacancyFilter]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: rows.length, Applied: 0, Shortlisted: 0, Interview: 0, Offered: 0, Rejected: 0,
    };
    for (const r of rows) c[r.application.status]++;
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.application.status !== filter) return false;
      if (!q) return true;
      return (
        r.student!.name.toLowerCase().includes(q) ||
        r.student!.rollNo.includes(q) ||
        r.vacancy!.roleTitle.toLowerCase().includes(q) ||
        r.vacancy!.companyName.toLowerCase().includes(q)
      );
    });
  }, [rows, query, filter]);

  const filteredVacancy = vacancyFilter ? vacancies.find((v) => v.id === vacancyFilter) : undefined;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <p className="text-sm text-muted-foreground">
          Review applicants and move them through the hiring stages.
        </p>
      </div>

      {vacancyFilter && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-indigo-50 px-4 py-2 text-sm">
          <span>
            Showing applications for{" "}
            <span className="font-medium">
              {filteredVacancy ? `${filteredVacancy.roleTitle} at ${filteredVacancy.companyName}` : "this vacancy"}
            </span>
          </span>
          <Button asChild variant="ghost" size="xs">
            <Link href="/officer/applications">
              <X />Clear
            </Link>
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <TabsList className="flex-wrap">
                <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                {APPLICATION_STATUSES.map((s) => (
                  <TabsTrigger key={s} value={s}>
                    {s} ({counts[s]})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search student, role or company"
                aria-label="Search applications"
                className="pl-9"
              />
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm font-medium">No applications found</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a different search or status.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Branch / CGPA</TableHead>
                    <TableHead>Vacancy</TableHead>
                    <TableHead>Applied on</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map(({ application: a, student, vacancy }) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <p className="font-medium">{student!.name}</p>
                        <p className="text-xs text-muted-foreground">{student!.rollNo}</p>
                      </TableCell>
                      <TableCell>
                        {student!.branch} &middot; {student!.cgpa.toFixed(1)}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/officer/vacancies/${vacancy!.id}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {vacancy!.roleTitle}
                        </Link>
                        <p className="text-xs text-muted-foreground">{vacancy!.companyName}</p>
                      </TableCell>
                      <TableCell>{formatDate(a.appliedOn)}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[a.status]}>{a.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <select
                          value={a.status}
                          onChange={(e) => setApplicationStatus(a.id, e.target.value as ApplicationStatus)}
                          aria-label={`Change status for ${student!.name}`}
                          className="h-8 rounded-md border bg-background px-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/30"
                        >
                          {APPLICATION_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
