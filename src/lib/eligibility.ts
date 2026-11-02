import type { Student, Vacancy } from "@/types";

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export function checkEligibility(student: Student, vacancy: Vacancy): EligibilityResult {
  const reasons: string[] = [];
  if (student.cgpa < vacancy.minCgpa) {
    reasons.push(`Needs CGPA ${vacancy.minCgpa.toFixed(1)}+ (yours is ${student.cgpa.toFixed(1)})`);
  }
  if (!vacancy.branches.includes(student.branch)) {
    reasons.push(`Open to ${vacancy.branches.join(", ")} only`);
  }
  return { eligible: reasons.length === 0, reasons };
}

export function skillMatch(student: Student, vacancy: Vacancy) {
  const mine = student.skills.map((s) => s.toLowerCase());
  const matched = vacancy.skills.filter((s) => mine.includes(s.toLowerCase()));
  const missing = vacancy.skills.filter((s) => !mine.includes(s.toLowerCase()));
  return { matched, missing };
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
