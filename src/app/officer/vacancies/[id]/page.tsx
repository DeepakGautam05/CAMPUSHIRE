"use client";

// Phase 3 - Step 3: Officer Vacancy Details
// Reads the id from the URL, finds the vacancy in the shared store, and shows everything.
// Status buttons (publish / close / reopen) are saved in the store (localStorage). No backend yet.

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  GraduationCap,
  IndianRupee,
  MapPin,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { setVacancyStatus, useStoreReady, useVacancy } from "@/lib/vacancy-store";
import { STATUS_LABEL, type VacancyStatus } from "@/types/vacancy";

const LIST_ROUTE = "/officer/vacancies";

const STATUS_STYLE: Record<VacancyStatus, string> = {
  published: "border-green-200 bg-green-50 text-green-700",
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  closed: "border-slate-200 bg-slate-100 text-slate-600",
};

function formatDate(iso: string) {
  if (!iso || Number.isNaN(new Date(iso).getTime())) return "Not set";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC", // same output on server and browser
  });
}

export default function VacancyDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const vacancy = useVacancy(id);
  const ready = useStoreReady();

  // Wait until the browser data is read, so a new vacancy never flashes "not found"
  if (!vacancy && !ready) return null;

  if (!vacancy) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Card>
          <CardContent className="space-y-3 p-10 text-center">
            <p className="text-lg font-semibold">Vacancy not found</p>
            <p className="text-sm text-muted-foreground">
              This vacancy does not exist or was removed.
            </p>
            <Button asChild variant="outline">
              <Link href={LIST_ROUTE}>Back to vacancies</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStatus = vacancy.status;

  // Mock applicant breakdown, calculated from the total
  const total = vacancy.applicantsCount;
  const shortlisted = Math.round(total * 0.25);
  const rejected = Math.round(total * 0.35);
  const pending = total - shortlisted - rejected;

  const facts = [
    { icon: MapPin, label: "Location", value: vacancy.location },
    { icon: IndianRupee, label: "Package", value: vacancy.packageLpa },
    { icon: GraduationCap, label: "Minimum CGPA", value: vacancy.minCgpa },
    { icon: Briefcase, label: "Type", value: vacancy.employmentType },
    { icon: CalendarDays, label: "Deadline", value: formatDate(vacancy.applicationDeadline) },
    { icon: Users, label: "Batch", value: vacancy.batch },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={LIST_ROUTE}>
          <ArrowLeft className="mr-2 h-4 w-4" />All vacancies
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{vacancy.roleTitle}</h1>
            <Badge variant="outline" className={STATUS_STYLE[currentStatus]}>
              {STATUS_LABEL[currentStatus]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {vacancy.companyName} &middot; Created {formatDate(vacancy.createdAt)}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" disabled title="Editing comes in a later phase">
            Edit
          </Button>
          {currentStatus === "draft" && (
            <Button onClick={() => setVacancyStatus(vacancy.id, "published")}>Publish</Button>
          )}
          {currentStatus === "published" && (
            <Button variant="destructive" onClick={() => setVacancyStatus(vacancy.id, "closed")}>
              Close vacancy
            </Button>
          )}
          {currentStatus === "closed" && (
            <Button onClick={() => setVacancyStatus(vacancy.id, "published")}>Reopen</Button>
          )}
        </div>
      </div>

      {/* Key facts */}
      <Card>
        <CardContent className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About the role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{vacancy.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Required skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {vacancy.requiredSkills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Eligible branches</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {vacancy.eligibleBranches.map((branch) => (
                <Badge key={branch} variant="outline">{branch}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Applicants summary */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Applicants</CardTitle>
            <CardDescription>Summary of applications received</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold leading-none">{total}</p>
            {total === 0 ? (
              <p className="text-sm text-muted-foreground">No applications yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-muted-foreground">Pending review</span><span className="font-medium">{pending}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Shortlisted</span><span className="font-medium">{shortlisted}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Rejected</span><span className="font-medium">{rejected}</span></li>
              </ul>
            )}
            <Button variant="outline" className="w-full" disabled title="Applications page comes later">
              View applications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
