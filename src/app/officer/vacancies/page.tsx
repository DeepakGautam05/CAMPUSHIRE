"use client";

// Phase 3 - Step 2: Officer Vacancies list
// Search + status filter + table. Mock data only. No backend yet.

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Users } from "lucide-react";
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
import { mockVacancies } from "@/lib/mock-vacancies";
import { STATUS_LABEL, type VacancyStatus } from "@/types/vacancy";

const CREATE_ROUTE = "/officer/vacancies/create";
const DETAILS_ROUTE = (id: string) => `/officer/vacancies/${id}`; // built in the next step

type Filter = "all" | VacancyStatus;

const STATUS_STYLE: Record<VacancyStatus, string> = {
  published: "border-green-200 bg-green-50 text-green-700",
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  closed: "border-slate-200 bg-slate-100 text-slate-600",
};

// timeZone is fixed so the server and browser always show the same date
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function OfficerVacanciesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: mockVacancies.length, draft: 0, published: 0, closed: 0 };
    for (const v of mockVacancies) c[v.status]++;
    return c;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockVacancies.filter((v) => {
      if (filter !== "all" && v.status !== filter) return false;
      if (!q) return true;
      return (
        v.companyName.toLowerCase().includes(q) ||
        v.roleTitle.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vacancies</h1>
          <p className="text-sm text-muted-foreground">
            Manage job openings and internships for your campus.
          </p>
        </div>
        <Button asChild>
          <Link href={CREATE_ROUTE}>
            <Plus className="mr-2 h-4 w-4" />Create vacancy
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <TabsList>
                <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                <TabsTrigger value="published">Published ({counts.published})</TabsTrigger>
                <TabsTrigger value="draft">Drafts ({counts.draft})</TabsTrigger>
                <TabsTrigger value="closed">Closed ({counts.closed})</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search company, role or location"
                aria-label="Search vacancies"
                className="pl-9"
              />
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm font-medium">No vacancies found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try a different search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((v) => (
                    <TableRow key={v.id} className="hover:bg-muted/40">
                      <TableCell>
                        <Link href={DETAILS_ROUTE(v.id)} className="block">
                          <p className="font-medium">{v.roleTitle}</p>
                          <p className="text-xs text-muted-foreground">{v.companyName}</p>
                        </Link>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{v.location}</TableCell>
                      <TableCell className="whitespace-nowrap">{v.packageLpa}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(v.applicationDeadline)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          {v.applicantsCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={STATUS_STYLE[v.status]}>
                          {STATUS_LABEL[v.status]}
                        </Badge>
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
