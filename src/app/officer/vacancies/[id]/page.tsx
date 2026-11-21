"use client";

// Phase 3: Officer Vacancy Details
// Displays complete vacancy specifications, stats, eligibility, and top 5 applicant preview.

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  IndianRupee,
  MapPin,
  Pencil,
  ShieldAlert,
  Users,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
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
import { getVacancyById } from "@/lib/mock-vacancies";
import { getApplicantsForVacancy } from "@/lib/mock-applicants";
import type { VacancyStatus } from "@/types/vacancy";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

const APPLICANT_STATUS_STYLE: Record<string, string> = {
  Shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Interview: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Offered: "bg-purple-50 text-purple-700 border-purple-200",
  Applied: "bg-slate-100 text-slate-700 border-slate-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function VacancyDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const vacancy = id ? getVacancyById(id) : undefined;

  // Local state for interactive status toggles (UI prototype)
  const [currentStatus, setCurrentStatus] = useState<VacancyStatus | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!vacancy) {
    return (
      <div className="py-12">
        <NotFoundState
          title="Vacancy not found"
          description="The vacancy with this ID does not exist or may have been unlisted."
          backHref="/officer/vacancies"
          backLabel="Back to vacancies"
        />
      </div>
    );
  }

  const activeStatus = currentStatus ?? vacancy.status;
  const applicants = getApplicantsForVacancy(vacancy.id);
  const topApplicants = applicants.slice(0, 5);

  const total = vacancy.applicantsCount;
  const shortlisted =
    applicants.filter((a) => a.status === "Shortlisted" || a.status === "Offered" || a.status === "Interview").length ||
    Math.round(total * 0.3);
  const rejected =
    applicants.filter((a) => a.status === "Rejected").length ||
    Math.round(total * 0.25);

  const handleClose = () => {
    setCurrentStatus("closed");
    setNotice("Vacancy marked as closed. Students can no longer submit applications.");
  };

  const handlePublish = () => {
    setCurrentStatus("published");
    setNotice("Vacancy published and visible to eligible students.");
  };

  return (
    <div className="space-y-6">
      {/* Back link & breadcrumb */}
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/officer/vacancies">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to vacancies
          </Link>
        </Button>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50/70 p-3 text-sm text-indigo-900">
          <span>{notice}</span>
          <button
            onClick={() => setNotice(null)}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <CompanyAvatar name={vacancy.companyName} size="md" className="mt-1" />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight">{vacancy.roleTitle}</h1>
              <StatusBadge status={activeStatus} />
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Link
                href={`/officer/companies/${vacancy.companyId}`}
                className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                {vacancy.companyName}
                <ExternalLink className="h-3 w-3" />
              </Link>
              <span>·</span>
              <span>{vacancy.location}</span>
              <span>·</span>
              <span>Created {formatDate(vacancy.createdAt)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => alert("Edit modal/workflow planned for subsequent release.")}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>

          {activeStatus === "published" && (
            <Button variant="destructive" onClick={handleClose}>
              Close Vacancy
            </Button>
          )}

          {activeStatus === "draft" && (
            <Button onClick={handlePublish}>
              Publish Vacancy
            </Button>
          )}

          {activeStatus === "closed" && (
            <Button variant="outline" onClick={handlePublish}>
              Reopen
            </Button>
          )}
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Applicants"
          value={total}
          icon={Users}
          note="Total applications submitted"
        />
        <StatCard
          label="Shortlisted"
          value={shortlisted}
          icon={CheckCircle2}
          note="Eligible candidates in review/interview"
        />
        <StatCard
          label="Rejected"
          value={rejected}
          icon={XCircle}
          note="Did not clear criteria or rounds"
        />
      </div>

      {/* Primary specs row */}
      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-muted p-2 text-muted-foreground">
              <IndianRupee className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Compensation</p>
              <p className="text-sm font-semibold">{vacancy.packageLpa}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-md bg-muted p-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Employment Type</p>
              <p className="text-sm font-semibold">{vacancy.employmentType}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-md bg-muted p-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Work Location</p>
              <p className="text-sm font-semibold">{vacancy.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-md bg-muted p-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Application Deadline</p>
              <p className="text-sm font-semibold">{formatDate(vacancy.applicationDeadline)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed sections: Left Description & Eligibility, Right Quick Info */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Job description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {vacancy.description}
              </p>
            </CardContent>
          </Card>

          {/* Required skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Required Skills</CardTitle>
              <CardDescription>
                Key technical and operational competencies evaluated for this drive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {vacancy.requiredSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-2.5 py-1 text-xs font-medium"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Eligibility Criteria</CardTitle>
              <CardDescription>
                Campus placement cutoff parameters defined by recruiter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
                  Eligible Engineering Branches
                </p>
                <div className="flex flex-wrap gap-2">
                  {vacancy.eligibleBranches.map((branch) => (
                    <Badge
                      key={branch}
                      variant="outline"
                      className="border-primary/20 bg-primary/5 text-primary text-xs font-medium"
                    >
                      {branch}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-xs">Minimum Cutoff</span>
                  </div>
                  <p className="mt-1 text-base font-semibold">{vacancy.minCgpa} CGPA</p>
                </div>

                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="text-xs">Active Backlogs</span>
                  </div>
                  <p className="mt-1 text-base font-semibold">
                    {vacancy.backlogsAllowed === 0 || !vacancy.backlogsAllowed
                      ? "None (0 Allowed)"
                      : `Max ${vacancy.backlogsAllowed} allowed`}
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-xs">Target Batch</span>
                  </div>
                  <p className="mt-1 text-base font-semibold">{vacancy.batch} Passing Out</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Company Summary & Applicants Preview */}
        <div className="space-y-6">
          {/* Company Quick Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">About Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <CompanyAvatar name={vacancy.companyName} size="md" />
                <div>
                  <p className="font-semibold">{vacancy.companyName}</p>
                  <p className="text-xs text-muted-foreground">{vacancy.location}</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/officer/companies/${vacancy.companyId}`}>
                  <Building2 className="mr-2 h-3.5 w-3.5" />
                  View Company Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Applicants Preview (Top 5) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Recent Applicants</CardTitle>
                <CardDescription>Top candidates submitted</CardDescription>
              </div>
              <Badge variant="outline">{topApplicants.length} of {total}</Badge>
            </CardHeader>
            <CardContent>
              {topApplicants.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No applicants registered yet.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="divide-y rounded-md border">
                    {topApplicants.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 text-sm transition-colors hover:bg-muted/40"
                      >
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {app.rollNo} · {app.branch} · {app.cgpa} CGPA
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                            APPLICANT_STATUS_STYLE[app.status] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button asChild variant="outline" className="w-full text-xs">
                    <Link href="/officer/applications">
                      View all {total} applications
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
