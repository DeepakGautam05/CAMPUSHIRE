"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  ImageIcon,
  Loader2,
  Sparkles,
  Type,
  UploadCloud,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Mode = "pdf" | "text" | "image";

const modes: { id: Mode; label: string; icon: React.ElementType; hint: string }[] = [
  { id: "pdf", label: "Upload PDF", icon: FileText, hint: "PDF up to 10 MB" },
  { id: "text", label: "Paste text", icon: Type, hint: "Paste the JD from an email or website" },
  { id: "image", label: "Upload image", icon: ImageIcon, hint: "PNG or JPG, e.g. a screenshot or poster" },
];

const steps = ["Reading document", "Extracting fields", "Scoring confidence"];

export default function NewVacancyPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [step, setStep] = useState<number | null>(null);

  const ready = mode === "text" ? text.trim().length > 20 : file !== null;
  const processing = step !== null;

  function switchMode(m: Mode) {
    setMode(m);
    setFile(null);
  }

  function extract() {
    // Prototype only: fake the AI pipeline, then go to the review page.
    let i = 0;
    setStep(0);
    const timer = setInterval(() => {
      i += 1;
      if (i >= steps.length) {
        clearInterval(timer);
        router.push("/officer/vacancies/review");
      } else {
        setStep(i);
      }
    }, 900);
  }

  const current = modes.find((m) => m.id === mode)!;

  return (
    <>
      <PageHeader
        title="Create vacancy"
        description="Add a job description and AI will draft the vacancy. You review everything before it goes live."
      />

      <Card className="max-w-3xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
            {modes.map((m) => (
              <button
                key={m.id}
                type="button"
                disabled={processing}
                onClick={() => switchMode(m.id)}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-sm font-medium text-muted-foreground transition-colors",
                  mode === m.id && "bg-card text-foreground shadow-sm"
                )}
              >
                <m.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-5">
            {mode === "text" ? (
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={processing}
                placeholder="Paste the full job description here…"
                className="min-h-56"
              />
            ) : file ? (
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div className="flex items-center gap-3">
                  <current.icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                {!processing && (
                  <Button variant="ghost" size="icon" onClick={() => setFile(null)} aria-label="Remove file">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed py-14 text-center transition-colors hover:bg-muted/50"
              >
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">Click to choose a file</span>
                <span className="text-xs text-muted-foreground">{current.hint}</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              hidden
              accept={mode === "pdf" ? "application/pdf" : "image/png,image/jpeg"}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {processing && (
            <ol className="mt-5 space-y-2 rounded-lg border p-4 text-sm">
              {steps.map((s, i) => (
                <li
                  key={s}
                  className={cn(
                    "flex items-center gap-2",
                    i > step! && "text-muted-foreground"
                  )}
                >
                  {i === step ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <span
                      className={cn(
                        "h-4 w-4 rounded-full border",
                        i < step! && "border-success bg-success"
                      )}
                    />
                  )}
                  {s}
                </li>
              ))}
            </ol>
          )}

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              AI extracts · the system validates · you approve
            </p>
            <Button disabled={!ready || processing} onClick={extract}>
              <Sparkles className="h-4 w-4" />
              Extract with AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
