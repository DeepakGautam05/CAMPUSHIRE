import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon: Icon,
  note,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  note?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
          {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
        </div>
        <div className="rounded-lg bg-indigo-50 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}
