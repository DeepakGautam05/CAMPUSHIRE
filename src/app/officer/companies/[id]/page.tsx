"use client";

// Phase 3: Officer Company Details
// Shows company profile, contact details, hiring track record, and associated vacancies.

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  GraduationCap,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { CompanyAvatar } from "@/components/company-avatar";
import { NotFoundState } from "@/components/not-found-state";
import { getCompanyById } from "@/lib/mock-companies";
import { getVacanciesByCompanyId } from "@/lib/mock-vacancies";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function CompanyDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const company = id ? getCompanyById(id) : undefined;

  if (!company) {
    return (
      <div className="py-12">
        <NotFoundState
          title="Company not found"
          description="The company with this ID does not exist or was removed from the database."
          backHref="/officer/companies"
          backLabel="Back to companies"
        />
      </div>
    );
  }

  const vacancies = getVacanciesByCompanyId(company.id);
  const activeCount = vacancies.filter((v) => v.status === "published").length;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/officer/companies">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to companies
          </Link>
        </Button>
      </div>

      {/* Header Profile */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3.5">
          <CompanyAvatar name={company.name} size="lg" className="mt-0.5" />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight">{company.name}</h1>
              <Badge variant="secondary">{company.industry}</Badge>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {company.location}
              </span>
              <span>·</span>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <Globe className="h-3.5 w-3.5" />
                {company.website.replace(/^https?:\/\//, "")}
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>

        <Button asChild>
          <Link href="/officer/vacancies/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Create Vacancy
          </Link>
        </Button>
      </div>

      {/* Past Hiring Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Campus Hires"
          value={company.totalHires}
          icon={GraduationCap}
          note="Alumni successfully placed"
        />
        <StatCard
          label="Average Package"
          value={company.avgPackageLpa}
          icon={IndianRupee}
          note="Historical offer average"
        />
        <StatCard
          label="Highest Package Offered"
          value={company.highestPackageLpa}
          icon={Trophy}
          note="Peak CTC extended on campus"
        />
        <StatCard
          label="Campus Partner Since"
          value={company.hiringSince}
          icon={Calendar}
          note="Active recruitment partner"
        />
      </div>

      {/* Main Grid: Left Company Info & HR Contact, Right Vacancies */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: About & HR Contact */}
        <div className="space-y-6 lg:col-span-1">
          {/* About Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">About Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="leading-relaxed text-muted-foreground">
                {company.about}
              </p>

              <div className="border-t pt-3 space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Industry Sector</span>
                  <span className="font-medium text-foreground">{company.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span>Primary Location</span>
                  <span className="font-medium text-foreground">{company.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Drives</span>
                  <span className="font-medium text-foreground">{activeCount} Published</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HR Point of Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Recruiting POC</CardTitle>
              <CardDescription>Primary campus relation liaison</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{company.hrContact.name}</p>
                  <p className="text-xs text-muted-foreground">{company.hrContact.role}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <a
                  href={`mailto:${company.hrContact.email}`}
                  className="flex items-center gap-2 rounded-md border p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span className="truncate">{company.hrContact.email}</span>
                </a>

                <a
                  href={`tel:${company.hrContact.phone}`}
                  className="flex items-center gap-2 rounded-md border p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>{company.hrContact.phone}</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: List of Company Vacancies */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  Recruitment Drives ({vacancies.length})
                </CardTitle>
                <CardDescription>
                  Current and past vacancies posted by {company.name}
                </CardDescription>
              </div>

              <Badge variant="outline">
                {activeCount} Active
              </Badge>
            </CardHeader>

            <CardContent>
              {vacancies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">No vacancies posted yet</p>
                  <p className="text-xs text-muted-foreground">
                    Create the first vacancy drive for this company.
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/officer/vacancies/new">
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add Vacancy
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role Title</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Applicants</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vacancies.map((v) => (
                        <TableRow key={v.id} className="hover:bg-muted/40">
                          <TableCell>
                            <Link
                              href={`/officer/vacancies/${v.id}`}
                              className="font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {v.roleTitle}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {v.employmentType} · {v.location}
                            </p>
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-medium">
                            {v.packageLpa}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                            {formatDate(v.applicationDeadline)}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 text-xs">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              {v.applicantsCount}
                            </span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={v.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button asChild size="sm" variant="ghost" className="h-8 px-2 text-xs">
                              <Link href={`/officer/vacancies/${v.id}`}>
                                View
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
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
      </div>
    </div>
  );
}

