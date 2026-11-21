"use client";

// Phase 3: Officer Vacancies list
// Search + status/branch filters + responsive table/cards. Mock data only.

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Users } from "lucide-react";
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
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { CompanyAvatar } from "@/components/company-avatar";
import { mockVacancies } from "@/lib/mock-vacancies";
import type { VacancyStatus } from "@/types/vacancy";

const CREATE_ROUTE = "/officer/vacancies/new";
const DETAILS_ROUTE = (id: string) => `/officer/vacancies/${id}`;

type StatusFilter = "all" | VacancyStatus;

// Collect every unique branch from the data
const ALL_BRANCHES = Array.from(
  new Set(mockVacancies.flatMap((v) => v.eligibleBranches))
).sort();

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function OfficerVacanciesPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = {
      all: mockVacancies.length,
      draft: 0,
      published: 0,
      closed: 0,
    };
    for (const v of mockVacancies) c[v.status]++;
    return c;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockVacancies.filter((v) => {
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (
        branchFilter !== "all" &&
        !v.eligibleBranches.includes(branchFilter)
      )
        return false;
      if (!q) return true;
      return (
        v.companyName.toLowerCase().includes(q) ||
        v.roleTitle.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q)
      );
    });
  }, [query, statusFilter, branchFilter]);

  return (
    <>
      <PageHeader
        title="Vacancies"
        description="Manage job openings and internships for your campus."
        action={
          <Button asChild>
            <Link href={CREATE_ROUTE}>
              <Plus className="h-4 w-4" />
              Create Vacancy
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          {/* Filters row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              <TabsList>
                <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                <TabsTrigger value="published">
                  Published ({counts.published})
                </TabsTrigger>
                <TabsTrigger value="draft">
                  Drafts ({counts.draft})
                </TabsTrigger>
                <TabsTrigger value="closed">
                  Closed ({counts.closed})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="h-9 rounded-lg border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Filter by branch"
              >
                <option value="all">All branches</option>
                {ALL_BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search role or company…"
                  aria-label="Search vacancies"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          {visible.length === 0 ? (
            <EmptyState
              title="No vacancies found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company / Role</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visible.map((v) => (
                      <TableRow
                        key={v.id}
                        onClick={() => router.push(DETAILS_ROUTE(v.id))}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <CompanyAvatar name={v.companyName} size="sm" />
                            <div>
                              <p className="font-medium text-foreground hover:text-primary transition-colors">
                                {v.roleTitle}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {v.companyName} · {v.location}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium text-foreground">
                          {v.packageLpa}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatDate(v.applicationDeadline)}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 text-foreground">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            {v.applicantsCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={v.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 md:hidden">
                {visible.map((v) => (
                  <Link key={v.id} href={DETAILS_ROUTE(v.id)}>
                    <Card className="transition-colors hover:bg-muted/30">
                      <CardContent className="flex items-start gap-3 p-4">
                        <CompanyAvatar name={v.companyName} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium">{v.roleTitle}</p>
                              <p className="text-xs text-muted-foreground">
                                {v.companyName}
                              </p>
                            </div>
                            <StatusBadge status={v.status} />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>{v.packageLpa}</span>
                            <span>{v.location}</span>
                            <span>
                              {formatDate(v.applicationDeadline)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {v.applicantsCount}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
