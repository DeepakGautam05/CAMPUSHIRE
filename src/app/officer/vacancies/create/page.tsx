"use client";

// Phase 2 - Step 2: Create Vacancy (input page)
// Officer gives the JD as a PDF, pasted text, or an image. No real AI yet:
// "Extract" shows a mock processing state, then opens the review page.

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, ImageIcon, Type, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { InputMode } from "@/types/vacancy-extraction";

const REVIEW_ROUTE = "/officer/vacancies/create/review"; // change if your routes differ
const MAX_FILE_MB = 10;

export default function CreateVacancyPage() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("pdf");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const pdfRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const hasInput =
    (mode === "pdf" && !!pdfFile) ||
    (mode === "image" && !!imageFile) ||
    (mode === "text" && text.trim().length >= 30);

  function pickFile(file: File | undefined, kind: "pdf" | "image") {
    if (!file) return;
    setError("");
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_FILE_MB} MB.`);
      return;
    }
    if (kind === "pdf" && file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (kind === "image" && !file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG or JPG).");
      return;
    }
    if (kind === "pdf") {
      setPdfFile(file);
    } else {
      setImageFile(file);
    }
  }

  function handleExtract() {
    if (!hasInput) return;
    setError("");
    setProcessing(true);

    // Mock processing only. Phase 2 has no backend or AI.
    const sourceName =
      mode === "pdf" ? pdfFile?.name : mode === "image" ? imageFile?.name : "Pasted text";
    try {
      sessionStorage.setItem("vacancyDraftMeta", JSON.stringify({ inputMode: mode, sourceName }));
    } catch {
      // storage can fail in private mode; the review page still works with mock data
    }
    setTimeout(() => router.push(REVIEW_ROUTE), 1800);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create vacancy</h1>
        <p className="text-sm text-muted-foreground">
          Add the job description. AI will extract the details, and you will review everything
          before publishing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job description source</CardTitle>
          <CardDescription>Choose how you want to provide the JD.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={mode} onValueChange={(v) => { setMode(v as InputMode); setError(""); }}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pdf" disabled={processing}><FileText className="mr-2 h-4 w-4" />PDF</TabsTrigger>
              <TabsTrigger value="text" disabled={processing}><Type className="mr-2 h-4 w-4" />Paste text</TabsTrigger>
              <TabsTrigger value="image" disabled={processing}><ImageIcon className="mr-2 h-4 w-4" />Image</TabsTrigger>
            </TabsList>

            <TabsContent value="pdf" className="mt-4">
              <input ref={pdfRef} type="file" accept="application/pdf" hidden
                onChange={(e) => pickFile(e.target.files?.[0], "pdf")} />
              <DropArea
                file={pdfFile}
                label="Click to upload a JD PDF"
                hint={`PDF, up to ${MAX_FILE_MB} MB`}
                disabled={processing}
                onPick={() => pdfRef.current?.click()}
                onClear={() => { setPdfFile(null); if (pdfRef.current) pdfRef.current.value = ""; }}
              />
            </TabsContent>

            <TabsContent value="text" className="mt-4 space-y-2">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the full job description here..."
                className="min-h-[220px]"
                disabled={processing}
              />
              <p className="text-xs text-muted-foreground">
                {text.trim().length < 30 ? "Enter at least 30 characters." : `${text.trim().length} characters`}
              </p>
            </TabsContent>

            <TabsContent value="image" className="mt-4">
              <input ref={imageRef} type="file" accept="image/png,image/jpeg" hidden
                onChange={(e) => pickFile(e.target.files?.[0], "image")} />
              <DropArea
                file={imageFile}
                label="Click to upload a JD image"
                hint={`PNG or JPG, up to ${MAX_FILE_MB} MB`}
                disabled={processing}
                onPick={() => imageRef.current?.click()}
                onClear={() => { setImageFile(null); if (imageRef.current) imageRef.current.value = ""; }}
              />
            </TabsContent>
          </Tabs>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end">
            <Button onClick={handleExtract} disabled={!hasInput || processing}>
              {processing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Extracting details...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" />Extract with AI</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DropArea(props: {
  file: File | null;
  label: string;
  hint: string;
  disabled: boolean;
  onPick: () => void;
  onClear: () => void;
}) {
  const { file, label, hint, disabled, onPick, onClear } = props;

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClear} disabled={disabled} aria-label="Remove file">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onPick}
      disabled={disabled}
      className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center transition-colors hover:bg-muted/40 disabled:opacity-50"
    >
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </button>
  );
}
