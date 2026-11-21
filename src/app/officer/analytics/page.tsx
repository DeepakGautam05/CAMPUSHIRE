"use client";

// Phase 4: Officer Placement Analytics
// Comprehensive season reporting, branch conversion rates, CTC distribution, and hiring velocity.

import { useState } from "react";
import {
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/stat-card";
import {
  mockAnalyticsSummary,
  mockBranchAnalytics,
  mockCtcDistribution,
  mockHiringVelocity,
  mockTopRecruiters,
} from "@/lib/mock-analytics";

const BAR_COLORS = ["#4f46e5", "#059669", "#0284c7", "#d97706", "#7c3aed"];

export default function OfficerAnalyticsPage() {
  const [batchYear, setBatchYear] = useState("2027");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportReport = () => {
    setExportNotice("Exporting official placement cell annual NIRF/NAAC report...");
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placement Season Analytics"
        description="Performance indicators, package distributions, branch placement rates, and recruiter rankings."
        action={
          <div className="flex items-center gap-2">
            <select
              value={batchYear}
              onChange={(e) => setBatchYear(e.target.value)}
              className="h-9 rounded-lg border bg-card px-3 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Filter batch year"
            >
              <option value="2027">Batch of 2027 (Active)</option>
              <option value="2026">Batch of 2026 (Historical)</option>
              <option value="2025">Batch of 2025 (Historical)</option>
            </select>

            <Button size="sm" onClick={handleExportReport}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download Report
            </Button>
          </div>
        }
      />

      {exportNotice && (
        <div className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50/80 p-3 text-sm text-indigo-900">
          <span>{exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="text-xs font-semibold text-indigo-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI High-Level Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Overall Placement Rate"
          value={`${mockAnalyticsSummary.placementRate}%`}
          icon={GraduationCap}
          note={`${mockAnalyticsSummary.placedStudents} of ${mockAnalyticsSummary.eligibleStudents} eligible placed`}
        />
        <StatCard
          label="Average Package"
          value={`₹${mockAnalyticsSummary.avgPackageLpa} LPA`}
          icon={IndianRupee}
          note={`Median: ₹${mockAnalyticsSummary.medianPackageLpa} LPA`}
        />
        <StatCard
          label="Highest CTC Offered"
          value={`₹${mockAnalyticsSummary.highestPackageLpa} LPA`}
          icon={Award}
          note="Extended by FinEdge Tech"
        />
        <StatCard
          label="Total Offers Extended"
          value={mockAnalyticsSummary.totalOffers}
          icon={TrendingUp}
          note={`${mockAnalyticsSummary.dreamOffers} Dream Offers (≥10 LPA)`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Branch-wise placement comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Department Placement Comparison
            </CardTitle>
            <CardDescription>
              Eligible vs Placed students with branch-wise conversion %
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockBranchAnalytics}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="branch" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  formatter={(val: unknown) => {
                    const num = typeof val === "number" ? val : Number(val);
                    return [`${num} students`, ""];
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="eligible" name="Eligible Students" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placed" name="Placed Students" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cumulative Hiring Velocity Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Cumulative Hiring Velocity (Season Progress)
            </CardTitle>
            <CardDescription>
              Growth in confirmed placement offers across months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockHiringVelocity}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  formatter={(val: unknown) => {
                    const num = typeof val === "number" ? val : Number(val);
                    return [`${num} total offers`, "Progress"];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#4f46e5" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CTC Bracket Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Package Distribution (CTC Tiers)
            </CardTitle>
            <CardDescription>
              Volume of offers across salary brackets in LPA
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockCtcDistribution}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  formatter={(val: unknown) => {
                    const num = typeof val === "number" ? val : Number(val);
                    return [`${num} offers`, "Bracket"];
                  }}
                />
                <Bar dataKey="offers" name="Offers Extended" radius={[4, 4, 0, 0]}>
                  {mockCtcDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Branch Detailed Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Department Performance Summary
            </CardTitle>
            <CardDescription>
              Detailed breakdown of cohorts by engineering discipline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch</TableHead>
                    <TableHead>Placed / Eligible</TableHead>
                    <TableHead>Placement %</TableHead>
                    <TableHead className="text-right">Avg CTC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBranchAnalytics.map((b) => (
                    <TableRow key={b.branch}>
                      <TableCell className="font-semibold">{b.branch}</TableCell>
                      <TableCell>
                        {b.placed} / {b.eligible}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-emerald-700">
                          {b.rate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{b.avgLpa} LPA
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recruiter Leaderboard Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">
              Top Recruiting Partners (Leaderboard)
            </CardTitle>
            <CardDescription>
              Companies extending the highest volume of campus offers this season
            </CardDescription>
          </div>
          <Badge variant="outline">
            {mockAnalyticsSummary.companiesVisited} Recruiter Drives
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recruiter</TableHead>
                  <TableHead>Industry Sector</TableHead>
                  <TableHead>Offers Extended</TableHead>
                  <TableHead>Average CTC</TableHead>
                  <TableHead className="text-right">Peak CTC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTopRecruiters.map((recruiter, idx) => (
                  <TableRow key={recruiter.name} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-foreground">
                          {recruiter.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-normal">
                        {recruiter.industry}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-semibold text-foreground">
                      {recruiter.hires} hires
                    </TableCell>

                    <TableCell className="font-medium">
                      {recruiter.avgCtc}
                    </TableCell>

                    <TableCell className="text-right font-bold text-emerald-700">
                      {recruiter.highestCtc}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

