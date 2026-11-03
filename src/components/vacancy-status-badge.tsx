import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, type VacancyStatus } from "@/types/vacancy";

const STATUS_STYLE: Record<VacancyStatus, string> = {
  published: "border-green-200 bg-green-50 text-green-700",
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  closed: "border-slate-200 bg-slate-100 text-slate-600",
};

export function VacancyStatusBadge({ status }: { status: VacancyStatus }) {
  return (
    <Badge variant="outline" className={STATUS_STYLE[status]}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
