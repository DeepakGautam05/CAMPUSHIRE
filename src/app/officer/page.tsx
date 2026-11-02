"use client";

import Link from "next/link";
import { Briefcase, Building2, GraduationCap, Sparkles } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/layout/app-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsByBranch, analyticsMonthly, companies, vacancies } from "@/data/mock";

export default function OfficerDashboard() {
  return (
    <>
      <PageHeader
        title="Placement dashboard"
        description="Overview of this season's drives and placements."
        action={
          <Button asChild>
            <Link href="/officer/vacancies/new">
              <Sparkles className="h-4 w-4" />
              Create vacancy with AI
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Companies" value={companies.length} icon={Building2} />
        <StatCard label="Active vacancies" value={vacancies.filter((v) => v.status === "published").length} icon={Briefcase} />
        <StatCard label="Students placed" value={178} icon={GraduationCap} note="of 295 eligible" />
        <StatCard label="Placement rate" value="60%" icon={GraduationCap} note="+8% vs last month" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Placements over time</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsMonthly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={28} />
                <Tooltip />
                <Line type="monotone" dataKey="placed" stroke="#4f46e5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Placed by branch</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsByBranch}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="branch" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={28} />
                <Tooltip />
                <Bar dataKey="placed" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
