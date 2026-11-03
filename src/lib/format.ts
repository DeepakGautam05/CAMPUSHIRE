// Shared formatting helpers for the officer pages.

// timeZone is fixed so the server and the browser always show the same date
export function formatDate(iso: string): string {
  if (!iso || Number.isNaN(new Date(iso).getTime())) return "Not set";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// "TechNova Solutions" -> "TS", "LearnLoop" -> "L"
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
