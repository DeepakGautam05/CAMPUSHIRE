"use client";

// Phase 4: Officer Applications Pipeline
// Full recruitment candidate screening and shortlisting pipeline.

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Download,
  Filter,
  GraduationCap,
  Mail,
  Phone,
  Search,
  SlidersHorizontal,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
import {
  mockPipelineApplications,
  type ApplicationStage,
  type PipelineApplication,
} from "@/lib/mock-pipeline-applications";

const STAGE_CONFIG: Record<
  ApplicationStage,
  { label: string; style: string; icon: React.ElementType }
> = {
  Applied: {
    label: "Applied",
    style: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
  },
  Shortlisted: {
    label: "Shortlisted",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: UserCheck,
  },
  Interview: {
    label: "Interview",
    style: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Users,
  },
  Offered: {
    label: "Offered",
    style: "bg-purple-50 text-purple-700 border-purple-200",
    icon: CheckCircle2,
  },
  Rejected: {
    label: "Rejected",
    style: "bg-rose-50 text-rose-700 border-rose-200",
    icon: XCircle,
  },
};

export default function OfficerApplicationsPage() {
  const [applications, setApplications] = useState<PipelineApplication[]>(
    mockPipelineApplications
  );
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<"all" | ApplicationStage>(
    "all"
  );
  const [branchFilter, setBranchFilter] = useState("all");
  const [vacancyFilter, setVacancyFilter] = useState("all");
  const [cgpaFilter, setCgpaFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<PipelineApplication | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Extract unique vacancies and branches for filter dropdowns
  const uniqueVacancies = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of applications) {
      if (!map.has(a.vacancyId)) {
        map.set(a.vacancyId, `${a.vacancyTitle} (${a.companyName})`);
      }
    }
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [applications]);

  const uniqueBranches = useMemo(() => {
    return Array.from(new Set(applications.map((a) => a.branch))).sort();
  }, [applications]);

  // Stage summary counts
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: applications.length,
      Applied: 0,
      Shortlisted: 0,
      Interview: 0,
      Offered: 0,
      Rejected: 0,
    };
    for (const a of applications) {
      counts[a.status] = (counts[a.status] || 0) + 1;
    }
    return counts;
  }, [applications]);

  // Filtered applications
  const visibleApplications = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((app) => {
      if (stageFilter !== "all" && app.status !== stageFilter) return false;
      if (branchFilter !== "all" && app.branch !== branchFilter) return false;
      if (vacancyFilter !== "all" && app.vacancyId !== vacancyFilter) return false;
      if (cgpaFilter !== "all") {
        const min = parseFloat(cgpaFilter);
        if (app.cgpa < min) return false;
      }
      if (!q) return true;
      return (
        app.studentName.toLowerCase().includes(q) ||
        app.rollNo.toLowerCase().includes(q) ||
        app.companyName.toLowerCase().includes(q) ||
        app.vacancyTitle.toLowerCase().includes(q)
      );
    });
  }, [applications, query, stageFilter, branchFilter, vacancyFilter, cgpaFilter]);

  // Quick in-place status transition
  const handleUpdateStatus = (
    id: string,
    newStatus: ApplicationStage,
    studentName: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    if (selectedApp?.id === id) {
      setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setToastMessage(`Updated ${studentName}'s status to "${newStatus}".`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Export CSV simulation
  const handleExportCsv = () => {
    const headers =
      "Roll No,Name,Branch,CGPA,Company,Role,Package,Status,Applied On\n";
    const rows = visibleApplications
      .map(
        (a) =>
          `"${a.rollNo}","${a.studentName}","${a.branch}",${a.cgpa},"${a.companyName}","${a.vacancyTitle}","${a.packageLpa}","${a.status}","${a.appliedOn}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `placement-applications-${stageFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage(`Exported ${visibleApplications.length} candidates as CSV.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications & Shortlisting"
        description="Review candidate submissions, evaluate eligibility against cutoffs, and advance recruitment stages."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export CSV ({visibleApplications.length})
            </Button>
          </div>
        }
      />

      {toastMessage && (
        <div className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50/80 p-3 text-sm font-medium text-indigo-900 transition-all">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs text-indigo-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stage KPI Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {(
          ["Applied", "Shortlisted", "Interview", "Offered", "Rejected"] as ApplicationStage[]
        ).map((stage) => {
          const conf = STAGE_CONFIG[stage];
          const count = stageCounts[stage] || 0;
          const isSelected = stageFilter === stage;

          return (
            <button
              key={stage}
              onClick={() => setStageFilter(isSelected ? "all" : stage)}
              className={`rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                  : "bg-card hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {stage}
                </span>
                <conf.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight">{count}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {stage === "Offered" ? "Offers extended" : "Active in pipeline"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search candidate or roll no…"
                aria-label="Search candidates"
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Vacancy selector */}
              <select
                value={vacancyFilter}
                onChange={(e) => setVacancyFilter(e.target.value)}
                className="h-9 rounded-lg border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Filter by drive"
              >
                <option value="all">All Drives ({uniqueVacancies.length})</option>
                {uniqueVacancies.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>

              {/* Branch selector */}
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="h-9 rounded-lg border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Filter by branch"
              >
                <option value="all">All Branches</option>
                {uniqueBranches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              {/* CGPA cutoff selector */}
              <select
                value={cgpaFilter}
                onChange={(e) => setCgpaFilter(e.target.value)}
                className="h-9 rounded-lg border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Filter by CGPA"
              >
                <option value="all">Min CGPA: Any</option>
                <option value="7.0">CGPA ≥ 7.0</option>
                <option value="7.5">CGPA ≥ 7.5</option>
                <option value="8.0">CGPA ≥ 8.0</option>
                <option value="8.5">CGPA ≥ 8.5</option>
              </select>

              {(stageFilter !== "all" ||
                branchFilter !== "all" ||
                vacancyFilter !== "all" ||
                cgpaFilter !== "all" ||
                query) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setStageFilter("all");
                    setBranchFilter("all");
                    setVacancyFilter("all");
                    setCgpaFilter("all");
                  }}
                  className="h-9 text-xs text-muted-foreground"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table on Desktop, Cards on Mobile */}
      {visibleApplications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates match your criteria"
          description="Try broadening your filters or resetting search parameters."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setStageFilter("all");
                setBranchFilter("all");
                setVacancyFilter("all");
                setCgpaFilter("all");
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden overflow-x-auto rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Drive / Company</TableHead>
                  <TableHead>Academic</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleApplications.map((app) => (
                  <TableRow
                    key={app.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => setSelectedApp(app)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-semibold text-foreground hover:text-primary transition-colors">
                          {app.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.rollNo} · {app.email}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {app.vacancyTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.companyName} · {app.packageLpa}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-medium">
                          {app.branch}
                        </Badge>
                        <span className="font-semibold text-sm">
                          {app.cgpa} CGPA
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {app.appliedOn}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          STAGE_CONFIG[app.status].style
                        }`}
                      >
                        {app.status}
                      </span>
                    </TableCell>

                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end gap-1">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              app.id,
                              e.target.value as ApplicationStage,
                              app.studentName
                            )
                          }
                          className="h-8 rounded-md border bg-card px-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Offered">Offered</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards View */}
          <div className="grid gap-3 md:hidden">
            {visibleApplications.map((app) => (
              <Card
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="cursor-pointer transition-colors hover:bg-muted/30"
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{app.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {app.rollNo} · {app.branch} · {app.cgpa} CGPA
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                        STAGE_CONFIG[app.status].style
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="rounded-lg border bg-muted/20 p-2.5 text-xs">
                    <p className="font-medium text-foreground">{app.vacancyTitle}</p>
                    <p className="text-muted-foreground">{app.companyName} · {app.packageLpa}</p>
                  </div>

                  <div
                    className="flex items-center justify-between border-t pt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[11px] text-muted-foreground">
                      Applied: {app.appliedOn}
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          app.id,
                          e.target.value as ApplicationStage,
                          app.studentName
                        )
                      }
                      className="h-7 rounded border bg-card px-1.5 text-xs font-medium"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Offered">Offered</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Candidate Evaluation Modal / Slide-over */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-xl border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    STAGE_CONFIG[selectedApp.status].style
                  }`}
                >
                  {selectedApp.status}
                </span>
                <h2 className="mt-1.5 text-xl font-bold tracking-tight">
                  {selectedApp.studentName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Roll No: {selectedApp.rollNo} · {selectedApp.branch} Engineering
                </p>
              </div>

              {/* Drive Details */}
              <div className="rounded-lg border bg-muted/30 p-3.5 space-y-1 text-sm">
                <p className="text-xs text-muted-foreground">Application Target</p>
                <p className="font-semibold">{selectedApp.vacancyTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedApp.companyName} · {selectedApp.packageLpa}
                </p>
              </div>

              {/* Academic & Cutoff Verification */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">CGPA</p>
                  <p className="mt-1 text-lg font-bold">{selectedApp.cgpa}</p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Backlogs</p>
                  <p className="mt-1 text-lg font-bold">{selectedApp.backlogs}</p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Applied Date</p>
                  <p className="mt-1 text-xs font-semibold pt-1">
                    {selectedApp.appliedOn}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
                  Verified Candidate Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedApp.notes && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900">
                  <strong>Evaluator Note:</strong> {selectedApp.notes}
                </div>
              )}

              {/* Contact info */}
              <div className="flex flex-wrap items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {selectedApp.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  {selectedApp.phone}
                </span>
              </div>

              {/* Quick stage transition button bar */}
              <div className="space-y-2 border-t pt-4">
                <p className="text-xs font-semibold">Change Candidate Stage</p>
                <div className="flex flex-wrap gap-2">
                  {(
                    ["Shortlisted", "Interview", "Offered", "Rejected"] as ApplicationStage[]
                  ).map((st) => (
                    <Button
                      key={st}
                      size="sm"
                      variant={selectedApp.status === st ? "default" : "outline"}
                      onClick={() =>
                        handleUpdateStatus(
                          selectedApp.id,
                          st,
                          selectedApp.studentName
                        )
                      }
                      className="text-xs h-8"
                    >
                      Mark as {st}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

