import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

// Logo placeholder: the company's initials on a soft indigo square
export function CompanyAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-semibold text-primary",
        className
      )}
    >
      {initials(name)}
    </div>
  );
}
