// Phase 3 - Step 4: a tiny shared store for vacancies (no backend yet).
//
// Why this exists: the review page, the list page and the details page are
// different pages. They all need to see the SAME vacancies, so a vacancy
// published on the review page shows up in the list. We keep the data in
// localStorage so it also survives a browser refresh.
//
// React reads it with useSyncExternalStore, which is the safe way to read
// browser-only data (no hydration errors). When the real backend arrives,
// only this file changes. The pages keep using the same hooks.

import { useSyncExternalStore } from "react";
import { mockVacancies } from "@/lib/mock-vacancies";
import type { Vacancy, VacancyStatus } from "@/types/vacancy";

const STORAGE_KEY = "campushire.vacancies.v1";

const listeners = new Set<() => void>();
let cache: Vacancy[] | null = null; // must keep the same reference between reads

function readFromStorage(): Vacancy[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Vacancy[];
    }
  } catch {
    // storage blocked or JSON broken: fall back to the seed data
  }
  return mockVacancies;
}

function getSnapshot(): Vacancy[] {
  if (cache === null) cache = readFromStorage();
  return cache;
}

// The server cannot see localStorage, so it always renders the seed data.
function getServerSnapshot(): Vacancy[] {
  return mockVacancies;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // another browser tab changed the data
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

function commit(next: Vacancy[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore: the data still works in memory for this session
  }
  listeners.forEach((l) => l());
}

/* ---------- hooks (use these inside components) ---------- */

export function useVacancies(): Vacancy[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useVacancy(id: string): Vacancy | undefined {
  return useVacancies().find((v) => v.id === id);
}

// false on the server and during hydration, true once the browser data is read
const noopSubscribe = () => () => {};
export function useStoreReady(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/* ---------- actions (call these from event handlers) ---------- */

export type NewVacancyInput = Omit<Vacancy, "id" | "createdAt" | "applicantsCount">;

export function addVacancy(input: NewVacancyInput): Vacancy {
  const vacancy: Vacancy = {
    ...input,
    id: `v-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString().slice(0, 10),
    applicantsCount: 0,
  };
  commit([vacancy, ...getSnapshot()]);
  return vacancy;
}

export function setVacancyStatus(id: string, status: VacancyStatus) {
  commit(getSnapshot().map((v) => (v.id === id ? { ...v, status } : v)));
}

// Handy while testing: go back to the original mock data
export function resetVacancies() {
  cache = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}
