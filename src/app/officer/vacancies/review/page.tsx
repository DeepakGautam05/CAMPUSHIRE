"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, CircleHelp, Send } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { extractedVacancy } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Confidence } from "@/types";

const meta: Record<
  Confidence,
  { label: string; variant: "success" | "warning" | "danger"; icon: React.ElementType; ring: string }
> = {
  high: { label: "High confidence", variant: "success", icon: CheckCircle2, ring: "" },
  verify: { label: "Needs verification", variant: "warning", icon: AlertTriangle, ring: "border-amber-300" },
  missing: { label: "Missing", variant: "danger", icon: CircleHelp, ring: "border-red-300" },
};

export default function ReviewVacancyPage() {
  const router = useRouter();
  const [values, setValues] = useState(() =>
    Object.fromEntries(extractedVacancy.map((f) => [f.key, f.value]))
  );
  // Fields the officer has explicitly confirmed or marked not applicable.
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [approved, setApproved] = useState(false);

  const flagged = extractedVacancy.filter((f) => f.confidence !== "high");
  const isResolved = (key: string, conf: Confidence) =>
    conf === "high" ||
    resolved.has(key) ||
    (conf === "missing" && values[key].trim() !== "");
  const pending = flagged.filter((f) => !isResolved(f.key, f.confidence));
  const canPublish = pending.length === 0 && approved;

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

              <Button
                className="w-full"
                disabled={!canPublish}
                onClick={() => router.push("/officer/vacancies")}
              >
                <Send className="h-4 w-4" />
                Publish vacancy
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
