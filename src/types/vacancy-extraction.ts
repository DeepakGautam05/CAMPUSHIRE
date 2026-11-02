// Phase 2 - Step 1: types for the AI vacancy creation flow

export type InputMode = "pdf" | "text" | "image";

// How sure the "AI" is about an extracted field
export type Confidence = "high" | "needs_verification" | "missing";

export type ExtractedField<T = string> = {
  value: T;
  confidence: Confidence;
  // Short hint shown to the officer, e.g. "Found in line 4 of the JD"
  note?: string;
};

export type ExtractedVacancy = {
  companyName: ExtractedField;
  roleTitle: ExtractedField;
  employmentType: ExtractedField; // Full-time / Internship
  location: ExtractedField;
  packageLpa: ExtractedField; // e.g. "8 - 10 LPA"
  minCgpa: ExtractedField;
  eligibleBranches: ExtractedField<string[]>;
  requiredSkills: ExtractedField<string[]>;
  batch: ExtractedField; // passing-out year
  applicationDeadline: ExtractedField; // ISO date or ""
  description: ExtractedField;
};

export type ExtractionStatus = "idle" | "processing" | "done" | "error";

export type VacancyDraft = {
  inputMode: InputMode;
  sourceName?: string; // file name when PDF / image
  extracted: ExtractedVacancy;
};

// Used to colour the badges on the review page
export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "High confidence",
  needs_verification: "Needs verification",
  missing: "Missing",
};
