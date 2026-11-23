import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NotFoundState({
  title = "Not found",
  description = "The item you're looking for doesn't exist or was removed.",
  backHref,
  backLabel = "Go back",
}: {
  title?: string;
  description?: string;
  backHref: string;
  backLabel?: string;
}) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
