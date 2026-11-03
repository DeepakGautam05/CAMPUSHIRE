"use client";

// Phase 3 - Step 5: Officer Companies list
// Search + industry filter + grid of company cards. Mock data only. No backend yet.

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, GraduationCap, MapPin, Search } from "lucide-react";
import { CompanyAvatar } from "@/components/company-avatar";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCompanies } from "@/lib/company-store";

const DETAILS_ROUTE = (id: string) => `/officer/companies/${id}`;

export default function OfficerCompaniesPage() {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("all");
  const companies = useCompanies();

  const industries = useMemo(
    () => Array.from(new Set(companies.map((c) => c.industry))).sort(),
    [companies]
  );

  const totals = useMemo(
    () => ({
      active: companies.reduce((sum, c) => sum + c.activeVacancies, 0),
      hired: companies.reduce((sum, c) => sum + c.hiring.studentsHired, 0),
    }),
    [companies]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) => {
      if (industry !== "all" && c.industry !== industry) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.headquarters.toLowerCase().includes(q)
      );
    });
  }, [companies, query, industry]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
        <p className="text-sm text-muted-foreground">
          Companies that recruit from your campus, with their open vacancies.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Companies" value={companies.length} icon={Building2} />
        <StatCard label="Active vacancies" value={totals.active} icon={Briefcase} />
        <StatCard label="Students hired (all time)" value={totals.hired} icon={GraduationCap} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company, industry or city"
            aria-label="Search companies"
            className="pl-9"
          />
        </div>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          aria-label="Filter by industry"
          className="h-9 rounded-md border bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/30"
        >
          <option value="all">All industries</option>
          {industries.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm font-medium">No companies found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a different search or industry.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => (
            <Link
              key={c.id}
              href={DETAILS_ROUTE(c.id)}
              className="group rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30"
            >
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-4 p-5">
                  <div className="flex items-start gap-3">
                    <CompanyAvatar name={c.name} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{c.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {c.headquarters}
                      </p>
                    </div>
                  </div>

                  <Badge variant="primary" className="w-fit">
                    {c.industry}
                  </Badge>

                  <div className="mt-auto flex items-center justify-between border-t pt-4 text-sm">
                    <div>
                      <p className="font-semibold">{c.activeVacancies}</p>
                      <p className="text-xs text-muted-foreground">Active vacancies</p>
                    </div>
                    <div>
                      <p className="font-semibold">{c.hiring.studentsHired}</p>
                      <p className="text-xs text-muted-foreground">Students hired</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
