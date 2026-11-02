"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, CircleHelp, Save, Send } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { extractedVacancy } from "@/data/mock";
import { addVacancy, type NewVacancyInput } from "@/lib/vacancy-store";
import { cn } from "@/lib/utils";
import type { Confidence } from "@/types";
import type { VacancyStatus } from "@/types/vacancy";

// "CSE, IT, ECE" -> ["CSE", "IT", "ECE"]
function splitList(text: string) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const meta: Record<
  Confidence,
  { label: string; variant: "success" | "warning" | "danger"; icon: React.ElementType; ring: string }
> = {
  high: { label: "High confidence", variant: "success", icon: CheckCircle2, ring: "" },
  verify: { label: "Needs verification", variant: "warning", icon: AlertTriangle, ring: "border-amber-300" },
  missing: { label: "Missing", variant: "danger", icon: CircleHelp, ring: "border-red-300" },
};

const initialValues = () =>
  Object.fromEntries(extractedVacancy.map((f) => [f.key, f.value]));

export default function ReviewVacancyPage() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  // Fields the officer has explicitly confirmed or marked not applicable.
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [approved, setApproved] = useState(false);

  // Next.js keeps hidden pages alive (Activity) and remembers their state.
  // Reset the review when this page is hidden, so the next vacancy always
  // starts unchecked. The officer must review and approve every time.
  useLayoutEffect(() => {
    return () => {
      setValues(initialValues());
      setResolved(new Set());
      setApproved(false);
    };
  }, []);

  const flagged = extractedVacancy.filter((f) => f.confidence !== "high");
  const isResolved = (key: string, conf: Confidence) =>
    conf === "high" ||
    resolved.has(key) ||
    (conf === "missing" && values[key].trim() !== "");
  const pending = flagged.filter((f) => !isResolved(f.key, f.confidence));
  // A vacancy without a company or a role title would look broken in the list
  const hasBasics = values.company.trim() !== "" && values.title.trim() !== "";
  const canPublish = pending.length === 0 && approved && hasBasics;

  // Turn the review form values into a real vacancy and save it in the store
  function save(status: VacancyStatus) {
    const location = values.location.trim();
    const workMode = values.workMode.trim();
    const input: NewVacancyInput = {
      companyName: values.company.trim(),
      roleTitle: values.title.trim(),
      employmentType: values.jobType.trim().toLowerCase().startsWith("intern")
        ? "Internship"
        : "Full-time",
      location: workMode ? `${location} (${workMode})` : location,
      packageLpa: values.ctc.trim(),
      minCgpa: values.minCgpa.trim(),
      eligibleBranches: splitList(values.branches),
      requiredSkills: splitList(values.skills),
      batch: "2027", // the review form has no batch field yet
      applicationDeadline: values.deadline.trim(),
      description: values.description.trim(),
      status,
    };
    const vacancy = addVacancy(input);
    router.push(`/officer/vacancies/${vacancy.id}`);
  }

  const counts = useMemo(
    () => ({
      high: extractedVacancy.filter((f) => f.confidence === "high").length,
      verify: extractedVacancy.filter((f) => f.confidence === "verify").length,
      missing: extractedVacancy.filter((f) => f.confidence === "missing").length,
    }),
    []
  );

  function toggleResolved(key: string) {
    setResolved((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <>
      <PageHeader
        title="Review extracted vacancy"
        description="AI drafted these fields from the job description. Check anything flagged, edit what's wrong, then publish."
        action={
          <Button asChild variant="outline">
            <Link href="/officer/vacancies/new">
              <ArrowLeft className="h-4 w-4" />
              Start over
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {extractedVacancy.map((f) => {
            const m = meta[f.confidence];
            const done = isResolved(f.key, f.confidence);
            return (
              <Card key={f.key} className={cn(!done && m.ring)}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <Badge variant={done && f.confidence !== "high" ? "success" : m.variant}>
                      <m.icon className="h-3 w-3" />
                      {done && f.confidence !== "high" ? "Confirmed" : m.label}
                    </Badge>
                  </div>

                  {f.multiline ? (
                    <Textarea
                      id={f.key}
                      value={values[f.key]}
                      onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                    />
                  ) : (
                    <Input
                      id={f.key}
                      type={f.key === "deadline" ? "date" : "text"}
                      value={values[f.key]}
                      placeholder={f.confidence === "missing" ? "Not found. Enter manually" : ""}
                      onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                    />
                  )}

                  {f.hint && !done && (
                    <p className="text-xs text-muted-foreground">{f.hint}</p>
                  )}

                  {f.confidence !== "high" && (
                    <button
                      type="button"
                      onClick={() => toggleResolved(f.key)}
                      className="cursor-pointer text-xs font-medium text-primary hover:underline"
                    >
                      {resolved.has(f.key)
                        ? "Undo"
                        : f.confidence === "verify"
                        ? "Mark as verified"
                        : "Mark as not applicable"}
                    </button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardContent className="space-y-4 p-5">
              <h2 className="text-sm font-semibold">Review summary</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">High confidence</dt>
                  <dd className="font-medium text-success">{counts.high}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Needs verification</dt>
                  <dd className="font-medium text-warning">{counts.verify}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Missing</dt>
                  <dd className="font-medium text-danger">{counts.missing}</dd>
                </div>
              </dl>

              <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                {pending.length === 0
                  ? "All flagged fields are resolved."
                  : `${pending.length} flagged field${pending.length > 1 ? "s" : ""} still need your attention.`}
              </p>

              <label className="flex cursor-pointer items-start gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={approved}
                  onChange={(e) => setApproved(e.target.checked)}
                  className="mt-0.5"
                />
                I have reviewed every field and approve this vacancy for publishing.
              </label>

              {!hasBasics && (
                <p className="text-xs text-danger">
                  Company and job title are required before you can save this vacancy.
                </p>
              )}

              <Button
                className="w-full"
                disabled={!canPublish}
                onClick={() => save("published")}
              >
                <Send className="h-4 w-4" />
                Publish vacancy
              </Button>
              <Button
                className="w-full"
                variant="outline"
                disabled={!hasBasics}
                onClick={() => save("draft")}
              >
                <Save className="h-4 w-4" />
                Save as draft
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
