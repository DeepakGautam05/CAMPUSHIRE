import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/app-shell";

export function ComingSoon({ slug }: { slug: string[] }) {
  const title = slug
    .join(" / ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <>
      <PageHeader title={title} />
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <Construction className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            This page is planned for a later phase of the prototype.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
