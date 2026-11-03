"use client";

// Phase 3 - Step 6: Officer Company Details
// Reads the id from the URL, finds the company, and shows profile, vacancies and hiring history.
// Mock data only. No backend yet.

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Globe,
  GraduationCap,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import { CompanyAvatar } from "@/components/company-avatar";
import { StatCard } from "@/components/stat-card";
import { VacancyStatusBadge } from "@/components/vacancy-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCompany } from "@/lib/company-store";
import { formatDate } from "@/lib/format";
import { useStoreReady } from "@/lib/vacancy-store";

const LIST_ROUTE = "/officer/companies";

export default function CompanyDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const company = useCompany(id);
  const ready = useStoreReady();

  // Wait until the browser data is read, so a new company never flashes "not found"
  if (!company && !ready) return null;

  if (!company) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Card>
          <CardContent className="space-y-3 p-10 text-center">
            <p className="text-lg font-semibold">Company not found</p>
            <p className="text-sm text-muted-foreground">
              This company does not exist or was removed.
            </p>
            <Button asChild variant="outline">
              <Link href={LIST_ROUTE}>Back to companies</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contact = [
    { icon: User, label: "HR contact", value: company.hrName },
    { icon: Mail, label: "Email", value: company.hrEmail, href: `mailto:${company.hrEmail}` },
    { icon: Phone, label: "Phone", value: company.hrPhone, href: `tel:${company.hrPhone.replace(/\s/g, "")}` },
    {
      icon: Globe,
      label: "Website",
      value: company.website,
      href: `https://${company.website}`,
      external: true,
    },
    { icon: MapPin, label: "Headquarters", value: company.headquarters },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={LIST_ROUTE}>
          <ArrowLeft className="mr-2 h-4 w-4" />All companies
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <CompanyAvatar name={company.name} className="h-14 w-14 text-base" />
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{company.name}</h1>
            <Badge variant="primary">{company.industry}</Badge>
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {company.headquarters}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active vacancies" value={company.activeVacancies} icon={Briefcase} />
        <StatCard label="Total vacancies" value={company.vacancies.length} icon={Briefcase} />
        <StatCard label="Applicants" value={company.totalApplicants} icon={Users} />
        <StatCard label="Students hired" value={company.hiring.studentsHired} icon={GraduationCap} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{company.about}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vacancies</CardTitle>
              <CardDescription>
                {company.vacancies.length === 0
                  ? "No vacancies from this company yet."
                  : `${company.vacancies.length} vacancy${company.vacancies.length === 1 ? "" : "ies"} posted`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {company.vacancies.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm font-medium">No vacancies yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Create one with the AI flow and it will appear here.
                  </p>
                  <Button asChild size="sm" variant="outline" className="mt-4">
                    <Link href="/officer/vacancies/new">Create vacancy</Link>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Applicants</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {company.vacancies.map((v) => (
                        <TableRow key={v.id}>
                          <TableCell>
                            <Link
                              href={`/officer/vacancies/${v.id}`}
                              className="font-medium hover:text-primary hover:underline"
                            >
                              {v.roleTitle}
                            </Link>
                            <p className="text-xs text-muted-foreground">{v.employmentType}</p>
                          </TableCell>
                          <TableCell>{v.packageLpa}</TableCell>
                          <TableCell>{formatDate(v.applicationDeadline)}</TableCell>
                          <TableCell>{v.applicantsCount}</TableCell>
                          <TableCell>
                            <VacancyStatusBadge status={v.status} />
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

        <div className="space-y-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contact.map(({ icon: Icon, label, value, href, external }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    {!value ? (
                      <p className="text-sm text-muted-foreground">Not added</p>
                    ) : href ? (
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="block break-words text-sm font-medium text-primary hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base">Past hiring</CardTitle>
              <CardDescription>Summary of earlier campus drives</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Students hired</span>
                  <span className="font-medium">{company.hiring.studentsHired}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Average package</span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    <IndianRupee className="h-3 w-3" />
                    {company.hiring.avgPackageLpa}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Highest package</span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    <IndianRupee className="h-3 w-3" />
                    {company.hiring.highestPackageLpa}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Last campus visit</span>
                  <span className="font-medium">{company.hiring.lastVisit}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
