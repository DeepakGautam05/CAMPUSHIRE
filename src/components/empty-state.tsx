import { SearchX } from "lucide-react";
import type React from "react";

export function EmptyState({
  icon: Icon = SearchX,
  title = "Nothing found",
  description = "Try adjusting your search or filters.",
  action,
}: {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
