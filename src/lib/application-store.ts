// Phase 3 - Step 7: a tiny shared store for applications (no backend yet).
// Same idea as vacancy-store.ts: data lives in localStorage, so a status the
// officer changes survives a refresh. When the backend arrives, only this file changes.

import { useSyncExternalStore } from "react";
import type { Application, ApplicationStatus } from "@/types";

const STORAGE_KEY = "campushire.applications.v1";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offered",
  "Rejected",
];

// Seed data: vacancyId matches mock-vacancies.ts, studentId matches mock-students.ts
const seed: Application[] = [
  { id: "ap-01", vacancyId: "v-101", studentId: "st-01", status: "Shortlisted", appliedOn: "2026-10-12" },
  { id: "ap-02", vacancyId: "v-101", studentId: "st-07", status: "Interview", appliedOn: "2026-10-12" },
  { id: "ap-03", vacancyId: "v-101", studentId: "st-11", status: "Offered", appliedOn: "2026-10-11" },
  { id: "ap-04", vacancyId: "v-101", studentId: "st-12", status: "Applied", appliedOn: "2026-10-15" },
  { id: "ap-05", vacancyId: "v-101", studentId: "st-04", status: "Rejected", appliedOn: "2026-10-13" },
  { id: "ap-06", vacancyId: "v-102", studentId: "st-05", status: "Offered", appliedOn: "2026-10-09" },
  { id: "ap-07", vacancyId: "v-102", studentId: "st-06", status: "Shortlisted", appliedOn: "2026-10-10" },
  { id: "ap-08", vacancyId: "v-102", studentId: "st-02", status: "Interview", appliedOn: "2026-10-09" },
  { id: "ap-09", vacancyId: "v-102", studentId: "st-01", status: "Applied", appliedOn: "2026-10-14" },
  { id: "ap-10", vacancyId: "v-103", studentId: "st-09", status: "Shortlisted", appliedOn: "2026-10-06" },
  { id: "ap-11", vacancyId: "v-103", studentId: "st-03", status: "Interview", appliedOn: "2026-10-06" },
  { id: "ap-12", vacancyId: "v-103", studentId: "st-10", status: "Applied", appliedOn: "2026-10-08" },
  { id: "ap-13", vacancyId: "v-103", studentId: "st-01", status: "Applied", appliedOn: "2026-10-07" },
  { id: "ap-14", vacancyId: "v-103", studentId: "st-08", status: "Rejected", appliedOn: "2026-10-07" },
  { id: "ap-15", vacancyId: "v-105", studentId: "st-10", status: "Shortlisted", appliedOn: "2026-09-05" },
  { id: "ap-16", vacancyId: "v-105", studentId: "st-04", status: "Rejected", appliedOn: "2026-09-04" },
  { id: "ap-17", vacancyId: "v-105", studentId: "st-12", status: "Interview", appliedOn: "2026-09-06" },
  { id: "ap-18", vacancyId: "v-106", studentId: "st-02", status: "Offered", appliedOn: "2026-10-13" },
  { id: "ap-19", vacancyId: "v-106", studentId: "st-12", status: "Shortlisted", appliedOn: "2026-10-14" },
  { id: "ap-20", vacancyId: "v-106", studentId: "st-11", status: "Applied", appliedOn: "2026-10-15" },
];

const listeners = new Set<() => void>();
let cache: Application[] | null = null; // must keep the same reference between reads

function readFromStorage(): Application[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Application[];
    }
  } catch {
    // storage blocked or JSON broken: fall back to the seed data
  }
  return seed;
}

function getSnapshot(): Application[] {
  if (cache === null) cache = readFromStorage();
  return cache;
}

// The server cannot see localStorage, so it always renders the seed data.
function getServerSnapshot(): Application[] {
  return seed;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function commit(next: Application[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore: the data still works in memory for this session
  }
  listeners.forEach((l) => l());
}

/* ---------- hook + actions ---------- */

export function useApplications(): Application[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setApplicationStatus(id: string, status: ApplicationStatus) {
  commit(getSnapshot().map((a) => (a.id === id ? { ...a, status } : a)));
}

// Handy while testing: go back to the original mock data
export function resetApplications() {
  cache = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}
