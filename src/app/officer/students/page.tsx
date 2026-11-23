"use client";

// Phase 4: Officer Student Directory
// Cohort student roster with placement status, academic cutoffs, and student detail drawer.

import { useMemo, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Download,
  ExternalLink,
  GraduationCap,
  Mail,
  Phone,
  Search,
  Sparkles,
  User,
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
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import {
  mockCohortStudents,
  type CohortStudent,
} from "@/lib/mock-students";

export default function OfficerStudentsPage() {
  const [students, setStudents] = useState<CohortStudent[]>(mockCohortStudents);
  const [query, setQuery] = useState("");
  const [placementFilter, setPlacementFilter] = useState<"all" | "placed" | "unplaced">("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [cgpaFilter, setCgpaFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<CohortStudent | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Stats calculation
  const totalStudents = students.length;
  const placedCount = students.filter((s) => s.placed).length;
  const unplacedCount = totalStudents - placedCount;
  const placementRate = Math.round((placedCount / totalStudents) * 100);

  // Available branches
  const branches = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.branch))).sort();
  }, [students]);

  // Filtered roster
  const visibleStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((student) => {
      if (placementFilter === "placed" && !student.placed) return false;
      if (placementFilter === "unplaced" && student.placed) return false;
      if (branchFilter !== "all" && student.branch !== branchFilter) return false;
      if (cgpaFilter !== "all") {
        const min = parseFloat(cgpaFilter);
        if (student.cgpa < min) return false;
      }
      if (!q) return true;
      return (
        student.name.toLowerCase().includes(q) ||
        student.rollNo.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        (student.placedCompany && student.placedCompany.toLowerCase().includes(q))
      );
    });
  }, [students, query, placementFilter, branchFilter, cgpaFilter]);

  // Toggle placement status (prototype simulation)
  const handleTogglePlacement = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const nextPlaced = !s.placed;
          return {
            ...s,
            placed: nextPlaced,
            placedCompany: nextPlaced ? "TechNova Solutions" : undefined,
            placedPackageLpa: nextPlaced ? "8.0 LPA" : undefined,
            offerType: nextPlaced ? "Regular" : undefined,
          };
        }
        return s;
      })
    );
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent((prev) =>
        prev
          ? {
              ...prev,
              placed: !prev.placed,
              placedCompany: !prev.placed ? "TechNova Solutions" : undefined,
              placedPackageLpa: !prev.placed ? "8.0 LPA" : undefined,
              offerType: !prev.placed ? "Regular" : undefined,
            }
          : null
      );
    }
    setFeedbackNotice("Updated student placement record.");
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Master Directory"
        description="Monitor graduating batch placement eligibility, verify credentials, and track placed vs. seeking candidates."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFeedbackNotice("Batch student export generated.");
              setTimeout(() => setFeedbackNotice(null), 3000);
            }}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export Directory
          </Button>
        }
      />

      {feedbackNotice && (
        <div className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50/80 p-3 text-sm text-indigo-900">
          <span>{feedbackNotice}</span>
          <button onClick={() => setFeedbackNotice(null)} className="text-xs font-semibold text-indigo-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Cohort KPI Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Registered Batch"
          value={totalStudents}
          icon={Users}
          note="Graduating Class of 2027"
        />
        <StatCard
          label="Students Placed"
          value={placedCount}
          icon={CheckCircle2}
          note={`${placementRate}% current placement rate`}
        />
        <StatCard
          label="Seeking Opportunities"
          value={unplacedCount}
          icon={GraduationCap}
          note="Actively applying to campus drives"
        />
        <StatCard
          label="Dream Offers (10+ LPA)"
          value={students.filter((s) => s.offerType === "Dream").length}
          icon={Sparkles}
          note="Premium campus placements"
        />
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, roll no, or company…"
                aria-label="Search students"
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Placement status filter */}
              <select
                value={placementFilter}
                onChange={(e) => setPlacementFilter(e.target.value as "all" | "placed" | "unplaced")}
                className="h-9 rounded-lg border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <option value="all">All Statuses ({totalStudents})</option>
                <option value="placed">Placed ({placedCount})</option>
                <option value="unplaced">Seeking ({unplacedCount})</option>
              </select>

              {/* Branch filter */}
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="h-9 rounded-lg border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <option value="all">All Branches</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              {/* CGPA bracket filter */}
              <select
                value={cgpaFilter}
                onChange={(e) => setCgpaFilter(e.target.value)}
                className="h-9 rounded-lg border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <option value="all">Min CGPA: Any</option>
                <option value="7.0">CGPA ≥ 7.0</option>
                <option value="7.5">CGPA ≥ 7.5</option>
                <option value="8.0">CGPA ≥ 8.0</option>
                <option value="8.5">CGPA ≥ 8.5</option>
              </select>

              {(placementFilter !== "all" || branchFilter !== "all" || cgpaFilter !== "all" || query) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setPlacementFilter("all");
                    setBranchFilter("all");
                    setCgpaFilter("all");
                  }}
                  className="h-9 text-xs"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roster Table (Desktop) / Cards (Mobile) */}
      {visibleStudents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="Try adjusting your search criteria or clearing filters."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setPlacementFilter("all");
                setBranchFilter("all");
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
                  <TableHead>Student</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Backlogs</TableHead>
                  <TableHead>Placement Status</TableHead>
                  <TableHead>Primary Skills</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleStudents.map((s) => (
                  <TableRow
                    key={s.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => setSelectedStudent(s)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-semibold text-foreground hover:text-primary transition-colors">
                          {s.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{s.rollNo}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {s.branch}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-semibold text-sm">
                      {s.cgpa}
                    </TableCell>

                    <TableCell>
                      <span className={s.backlogs > 0 ? "text-rose-600 font-semibold text-xs" : "text-muted-foreground text-xs"}>
                        {s.backlogs === 0 ? "0 Clean" : `${s.backlogs} Active`}
                      </span>
                    </TableCell>

                    <TableCell>
                      {s.placed ? (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Placed ({s.placedPackageLpa})
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                            {s.placedCompany}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium">
                          Seeking
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {s.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-[11px] px-1.5 py-0">
                            {skill}
                          </Badge>
                        ))}
                        {s.skills.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{s.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs font-medium text-primary hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(s);
                        }}
                      >
                        Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-3 md:hidden">
            {visibleStudents.map((s) => (
              <Card
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className="cursor-pointer transition-colors hover:bg-muted/30"
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.rollNo} · {s.branch} · {s.cgpa} CGPA
                      </p>
                    </div>
                    {s.placed ? (
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs">
                        Placed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-xs">
                        Seeking
                      </Badge>
                    )}
                  </div>

                  {s.placed && (
                    <div className="rounded-md bg-emerald-50/60 p-2 text-xs text-emerald-900">
                      <strong>{s.placedCompany}</strong> ({s.placedPackageLpa})
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {s.skills.slice(0, 4).map((sk) => (
                      <Badge key={sk} variant="secondary" className="text-[11px]">
                        {sk}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Student Profile Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{selectedStudent.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    Roll No: {selectedStudent.rollNo} · {selectedStudent.branch} (Batch of {selectedStudent.batch})
                  </p>
                </div>
              </div>

              {/* Placement status summary */}
              <div className="rounded-lg border p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Placement Status</span>
                  {selectedStudent.placed ? (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      Placed ({selectedStudent.offerType || "Regular"})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                      Seeking Placement
                    </Badge>
                  )}
                </div>
                {selectedStudent.placed && (
                  <p className="text-sm font-semibold pt-1">
                    {selectedStudent.placedCompany} — {selectedStudent.placedPackageLpa} CTC
                  </p>
                )}
              </div>

              {/* Academic Parameters */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="rounded-lg border p-2.5">
                  <p className="text-muted-foreground">CGPA</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{selectedStudent.cgpa}</p>
                </div>
                <div className="rounded-lg border p-2.5">
                  <p className="text-muted-foreground">Active Backlogs</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{selectedStudent.backlogs}</p>
                </div>
                <div className="rounded-lg border p-2.5">
                  <p className="text-muted-foreground">Drives Applied</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{selectedStudent.appliedCount}</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                  Verified Technical Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.skills.map((sk) => (
                    <Badge key={sk} variant="secondary" className="text-xs">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>{selectedStudent.phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert(`Opening official verified resume for ${selectedStudent.name}.`)}
                  className="text-xs"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  View Resume
                </Button>

                <Button
                  size="sm"
                  variant={selectedStudent.placed ? "destructive" : "default"}
                  onClick={() => handleTogglePlacement(selectedStudent.id)}
                  className="text-xs"
                >
                  {selectedStudent.placed ? "Revoke / Mark Unplaced" : "Mark as Placed"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

