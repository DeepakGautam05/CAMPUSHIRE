import { Badge } from "@/components/ui/badge";
import type { VacancyStatus } from "@/types/vacancy";

const config: Record<VacancyStatus, { label: string; className: string }> = {
  published: { label: "Published", className: "border-green-200 bg-green-50 text-green-700" },
  draft: { label: "Draft", className: "border-amber-200 bg-amber-50 text-amber-700" },
  closed: { label: "Closed", className: "border-slate-200 bg-slate-100 text-slate-600" },
};

export function StatusBadge({ status }: { status: VacancyStatus }) {
  const { label, className } = config[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
