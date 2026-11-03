"use client";

// Phase 3 - Step 7: Officer Students list
// Search + branch / placement filters + table. Mock data only. No backend yet.

import { useMemo, useState } from "react";
import { CheckCircle2, GraduationCap, Search, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
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
import { useApplications } from "@/lib/application-store";
import { mockStudents } from "@/lib/mock-students";

type PlacedFilter = "all" | "placed" | "unplaced";

const selectClass =
  "h-9 rounded-md border bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/30";

export default function OfficerStudentsPage() {
  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("all");
  const [placed, setPlaced] = useState<PlacedFilter>("all");
  const [minCgpa, setMinCgpa] = useState("0");
  const applications = useApplications();

  const branches = useMemo(
    () => Array.from(new Set(mockStudents.map((s) => s.branch))).sort(),
    []
  );

  const applicationCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of applications) map.set(a.studentId, (map.get(a.studentId) ?? 0) + 1);
    return map;
  }, [applications]);

  const placedTotal = mockStudents.filter((s) => s.placedAt).length;
  const avgCgpa = mockStudents.reduce((sum, s) => sum + s.cgpa, 0) / mockStudents.length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = Number(minCgpa);
    return mockStudents.filter((s) => {
      if (branch !== "all" && s.branch !== branch) return false;
      if (placed === "placed" && !s.placedAt) return false;
      if (placed === "unplaced" && s.placedAt) return false;
      if (s.cgpa < min) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.rollNo.includes(q) ||
        s.skills.some((skill) => skill.toLowerCase().includes(q))
      );
    });
  }, [query, branch, placed, minCgpa]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
        <p className="text-sm text-muted-foreground">
          Registered students of the final-year batch and their placement status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Students" value={mockStudents.length} icon={Users} />
        <StatCard label="Placed" value={placedTotal} icon={CheckCircle2} note={`${mockStudents.length - placedTotal} still looking`} />
        <StatCard label="Average CGPA" value={avgCgpa.toFixed(2)} icon={GraduationCap} />
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, roll no or skill"
                aria-label="Search students"
                className="pl-9"
              />
            </div>
            <select value={branch} onChange={(e) => setBranch(e.target.value)} aria-label="Filter by branch" className={selectClass}>
              <option value="all">All branches</option>
              {branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select value={placed} onChange={(e) => setPlaced(e.target.value as PlacedFilter)} aria-label="Filter by placement status" className={selectClass}>
              <option value="all">All students</option>
              <option value="placed">Placed</option>
              <option value="unplaced">Not placed</option>
            </select>
            <select value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} aria-label="Minimum CGPA" className={selectClass}>
              <option value="0">Any CGPA</option>
              <option value="6">6.0 and above</option>
              <option value="7">7.0 and above</option>
              <option value="8">8.0 and above</option>
            </select>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm font-medium">No students found</p>
              <p className="mt-1 text-xs text-muted-foreground">Try different filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>Backlogs</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.rollNo}</p>
                      </TableCell>
                      <TableCell>{s.branch}</TableCell>
                      <TableCell>{s.cgpa.toFixed(1)}</TableCell>
                      <TableCell>{s.backlogs}</TableCell>
                      <TableCell className="max-w-64 whitespace-normal">
                        <div className="flex flex-wrap gap-1">
                          {s.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                          {s.skills.length > 3 && (
                            <Badge variant="outline">+{s.skills.length - 3}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{applicationCount.get(s.id) ?? 0}</TableCell>
                      <TableCell>
                        {s.placedAt ? (
                          <div>
                            <Badge variant="success">Placed</Badge>
                            <p className="mt-1 text-xs text-muted-foreground">{s.placedAt}</p>
                          </div>
                        ) : (
                          <Badge variant="warning">Not placed</Badge>
                        )}
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
