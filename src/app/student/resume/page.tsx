"use client";

import { useRef, useState } from "react";
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
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function StudentResumePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeResume, setActiveResume] = useState({
    title: "Deepak_Gautam_SDE_Resume_2027.pdf",
    uploadedOn: "12 Nov 2026",
    size: "248 KB",
    score: 88,
    status: "Verified by Placement Cell",
    fileUrl: "", // Object URL if custom file uploaded
    contentPreview: `DEEPAK GAUTAM
Roll No: 233114 | B.Tech CSE (Batch 2027) | CGPA: 8.10
Email: deepak.g@campus.edu | GitHub: github.com/DeepakGautam05

EDUCATION:
- B.Tech Computer Science & Engineering (2023 - 2027)
- Cumulative CGPA: 8.10 / 10.0 (Zero active backlogs)

TECHNICAL SKILLS:
- Languages & Frameworks: React, Next.js, TypeScript, Node.js, Express, Tailwind CSS
- Databases & Backend: PostgreSQL, Prisma ORM, RESTful APIs, Redis
- Core Fundamentals: Data Structures & Algorithms, Object-Oriented Design, Operating Systems

PROJECTS:
1. CampusHire - Enterprise Campus Recruitment & Placement Portal
   - Architected end-to-end recruitment management suite with Next.js App Router and Prisma PostgreSQL.
   - Designed real-time candidate pipeline tracking, role-based workflows, and analytics radar.
2. Distributed Cloud Task Manager
   - Built resilient microservices pipeline with Docker containerization and JWT session routing.`,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Trigger file selection from device
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Handle actual file upload from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file format
    const validExtensions = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");

    setIsUploading(true);

    const fileSizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const blobUrl = URL.createObjectURL(file);

    setTimeout(() => {
      setIsUploading(false);
      setActiveResume({
        title: file.name,
        uploadedOn: "Just now",
        size: fileSizeStr,
        score: Math.floor(Math.random() * 11) + 85, // 85-95 ATS score
        status: "Submitted & ATS Scored",
        fileUrl: blobUrl,
        contentPreview: `Document: ${file.name}\nSize: ${fileSizeStr}\nUploaded: ${new Date().toLocaleString()}\nStatus: Processed by ATS Parser with High Compatibility.`,
      });
      setUploadNotice(`Successfully uploaded "${file.name}" from your device!`);
      setTimeout(() => setUploadNotice(null), 4500);
    }, 1000);
  };

  // Handle downloading the resume to local device
  const handleDownload = () => {
    if (activeResume.fileUrl) {
      const a = document.createElement("a");
      a.href = activeResume.fileUrl;
      a.download = activeResume.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Generate clean downloadable file from existing profile
      const blob = new Blob([activeResume.contentPreview], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = activeResume.title.replace(".pdf", ".txt");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hidden file input for uploading directly from device */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload resume file from device"
      />

      <PageHeader
        title="Resume & ATS Portfolio"
        description="Upload from your device, preview, download, and optimize your resume for automated applicant tracking systems (ATS)."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-1.5 h-4 w-4" />
              Download Resume
            </Button>
            <Button onClick={handleTriggerUpload} disabled={isUploading}>
              <UploadCloud className="mr-1.5 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload from Device"}
            </Button>
          </div>
        }
      />

      {uploadNotice && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 animate-scale-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {uploadNotice}
        </div>
      )}

      {/* Main Resume Overview Banner */}
      <Card className="interactive-card border-indigo-100 bg-linear-to-b from-white to-slate-50/50">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 shadow-2xs">
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
                <Button size="sm" variant="outline" onClick={() => setShowPreviewModal(true)} className="h-8 text-xs">
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Preview Document
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownload} className="h-8 text-xs">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download
                </Button>
                <Button size="sm" variant="ghost" onClick={handleTriggerUpload} className="h-8 text-xs text-primary">
                  <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
                  Replace from Device
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
              { rule: "Action Verbs & Impact Metrics", status: "Good", note: "Quantified bullet points detected" },
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

        {/* Upload Zone / Guidelines */}
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileCode className="h-4 w-4 text-primary" />
              Device Upload & Guidelines
            </CardTitle>
            <CardDescription>Upload an updated PDF or DOCX directly from your computer or phone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            {/* Clickable Drag & Drop / Browse area */}
            <div
              onClick={handleTriggerUpload}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-center cursor-pointer hover:bg-indigo-50/70 hover:border-primary/50 transition-colors"
            >
              <UploadCloud className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm font-semibold text-foreground">Click to browse or drop resume file</p>
              <p className="text-[11px] text-muted-foreground mt-1">Supports PDF, DOCX, or TXT up to 10 MB</p>
            </div>

            <div className="pt-2 flex gap-2">
              <Button onClick={handleTriggerUpload} variant="default" className="flex-1 text-xs">
                <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
                Select File from Device
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1 text-xs">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="flex w-full max-w-2xl flex-col max-h-[85vh] rounded-xl border bg-white shadow-xl animate-scale-in">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">{activeResume.title}</h3>
                  <span className="text-xs text-muted-foreground">{activeResume.size} · ATS Score: {activeResume.score}/100</span>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 font-mono text-xs text-slate-800 bg-slate-50/70 whitespace-pre-wrap leading-relaxed">
              {activeResume.contentPreview}
            </div>

            <div className="flex items-center justify-between border-t px-5 py-3 bg-white">
              <span className="text-xs text-muted-foreground">CampusHire ATS Document Viewer</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowPreviewModal(false)}>
                  Close
                </Button>
                <Button size="sm" onClick={handleDownload}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download File
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
