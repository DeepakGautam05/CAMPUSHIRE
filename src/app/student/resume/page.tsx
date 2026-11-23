"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  FileCheck,
  FileCode,
  FileText,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function StudentResumePage() {
  const [activeResume, setActiveResume] = useState({
    title: "Deepak_Gautam_SDE_Resume_2027.pdf",
    uploadedOn: "12 Nov 2026",
    size: "248 KB",
    score: 88,
    status: "Verified by Placement Cell",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const handleUploadMock = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadNotice("New version uploaded and submitted for automated ATS resume scoring!");
      setTimeout(() => setUploadNotice(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Resume & ATS Portfolio"
        description="Upload, preview, and optimize your resume for automated applicant tracking systems (ATS)."
        action={
          <Button onClick={handleUploadMock} disabled={isUploading}>
            <UploadCloud className="mr-1.5 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload New Resume"}
          </Button>
        }
      />

      {uploadNotice && (
        <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          {uploadNotice}
        </div>
      )}

      {/* Main Resume Overview Banner */}
      <Card className="interactive-card border-indigo-100 bg-linear-to-b from-white to-slate-50/50">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{activeResume.title}</h3>
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs">
                  Primary ATS Default
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Uploaded: {activeResume.uploadedOn} · Size: {activeResume.size}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Preview Document
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* ATS Match Gauge */}
          <div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-2xs">
            <div className="text-right">
              <span className="text-[11px] font-semibold text-muted-foreground">AI ATS Score</span>
              <p className="text-2xl font-black text-primary">{activeResume.score}/100</p>
              <span className="text-[10px] text-emerald-600 font-medium">High Match for Full-stack Roles</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ATS Optimization Breakdown */}
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-600" />
              ATS Parser Feedback & Verification
            </CardTitle>
            <CardDescription>Automated scanner audit checks required by campus recruiters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { rule: "Keyword Density for SDE / Web Dev", status: "Passed (94%)", note: "Matches React, TypeScript, Next.js, SQL" },
              { rule: "Format & Single-column Layout", status: "Compliant", note: "Clean machine-readable hierarchy" },
              { rule: "Action Verbs & Impact Metrics", status: "Good", note: "9 quantified bullet points detected" },
              { rule: "Contact & Portfolio Accessibility", status: "Verified", note: "GitHub & LinkedIn URLs clickable" },
            ].map((check, idx) => (
              <div key={idx} className="flex items-start justify-between rounded-lg border p-3 text-xs">
                <div>
                  <p className="font-semibold text-foreground">{check.rule}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{check.note}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] text-emerald-700 bg-emerald-50">
                  {check.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upload Zone / Tips */}
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileCode className="h-4 w-4 text-primary" />
              Guidelines for Campus Placement Resumes
            </CardTitle>
            <CardDescription>Best practices recommended by the Training and Placement Cell.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            <div className="rounded-lg bg-indigo-50/60 border border-indigo-100 p-3 text-indigo-950">
              <p className="font-semibold mb-1">💡 1-Page Format strictly enforced</p>
              Recruiters spend an average of 6 seconds per resume. Keep your academic credentials, internships, and 2-3 prominent projects concise on a single page.
            </div>

            <ul className="space-y-2 list-disc pl-4 text-slate-700">
              <li>Always include live project URLs (Vercel, Render, or GitHub links).</li>
              <li>Specify your verified CGPA ({`8.10`}) without rounding up.</li>
              <li>Avoid graphics, multi-column tables, or non-standard fonts that break ATS parsers.</li>
            </ul>

            <div className="pt-2">
              <Button onClick={handleUploadMock} variant="outline" className="w-full text-xs">
                Replace with Updated PDF File
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
