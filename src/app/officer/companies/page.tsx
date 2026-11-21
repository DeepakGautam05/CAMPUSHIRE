"use client";

// Phase 3: Officer Companies List
// Displays company directory with search, industry filter, and active vacancies count.

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, MapPin, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CompanyAvatar } from "@/components/company-avatar";
import { EmptyState } from "@/components/empty-state";
import { mockCompanies } from "@/lib/mock-companies";
import { mockVacancies } from "@/lib/mock-vacancies";

export default function OfficerCompaniesPage() {
  const [query, setQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");

  const industries = useMemo(() => {
    return Array.from(new Set(mockCompanies.map((c) => c.industry))).sort();
  }, []);

  // Compute active vacancies map for instant lookup
  const activeVacanciesByCompany = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of mockVacancies) {
      if (v.status === "published") {
        map[v.companyId] = (map[v.companyId] || 0) + 1;
      }
    }
    return map;
  }, []);

  const visibleCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockCompanies.filter((company) => {
      if (industryFilter !== "all" && company.industry !== industryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        company.name.toLowerCase().includes(q) ||
        company.location.toLowerCase().includes(q) ||
        company.industry.toLowerCase().includes(q)
      );
    });
  }, [query, industryFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruiting Companies"
        description="Browse registered partner organizations and track active campus recruitment drives."
      />

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search company or location…"
                aria-label="Search companies"
                className="pl-9"
              />
            </div>

            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="h-9 rounded-lg border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Filter by industry"
            >
              <option value="all">All Industries ({mockCompanies.length})</option>
              {industries.map((ind) => {
                const count = mockCompanies.filter((c) => c.industry === ind).length;
                return (
                  <option key={ind} value={ind}>
                    {ind} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{visibleCompanies.length}</span> of{" "}
            {mockCompanies.length} companies
          </p>
        </CardContent>
      </Card>

      {/* Grid of Company Cards */}
      {visibleCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies match your search"
          description="Try modifying your keyword or clearing the industry filter."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setIndustryFilter("all");
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCompanies.map((company) => {
            const activeCount = activeVacanciesByCompany[company.id] || 0;

            return (
              <Card
                key={company.id}
                className="group flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <CardContent className="space-y-4 p-5">
                  {/* Top: Avatar, Name & Industry */}
                  <div className="flex items-start gap-3">
                    <CompanyAvatar name={company.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-semibold tracking-tight group-hover:text-primary transition-colors">
                        {company.name}
                      </h2>
                      <Badge variant="secondary" className="mt-1 text-[11px] font-normal">
                        {company.industry}
                      </Badge>
                    </div>
                  </div>

                  {/* Location & Metadata */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{company.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      {activeCount > 0 ? (
                        <span className="font-medium text-emerald-700">
                          {activeCount} active {activeCount === 1 ? "opening" : "openings"}
                        </span>
                      ) : (
                        <span>No active openings</span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Total past hires summary & View button */}
                  <div className="flex items-center justify-between border-t pt-3.5">
                    <span className="text-xs text-muted-foreground">
                      <strong className="text-foreground">{company.totalHires}</strong> campus hires to date
                    </span>

                    <Button asChild size="sm" variant="outline" className="h-8 gap-1 text-xs">
                      <Link href={`/officer/companies/${company.id}`}>
                        View
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

