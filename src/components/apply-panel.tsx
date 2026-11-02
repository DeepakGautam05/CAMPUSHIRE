"use client";

import { useState } from "react";
import { CheckCircle2, Send, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ApplyPanel({
  eligible,
  reasons,
  alreadyApplied,
  deadline,
}: {
  eligible: boolean;
  reasons: string[];
  alreadyApplied: boolean;
  deadline: string;
}) {
  const [applied, setApplied] = useState(alreadyApplied);

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            {eligible ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <XCircle className="h-4 w-4 text-danger" />
            )}
            <span className="font-medium">
              {eligible ? "You meet the criteria" : "You don't meet the criteria"}
            </span>
          </p>
          {reasons.map((r) => (
            <p key={r} className="pl-6 text-xs text-muted-foreground">
              {r}
            </p>
          ))}
        </div>

        <Button
          className="w-full"
          disabled={!eligible || applied}
          onClick={() => setApplied(true)}
        >
          <Send className="h-4 w-4" />
          {applied ? "Application submitted" : "Apply now"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Closes on {deadline}
        </p>
      </CardContent>
    </Card>
  );
}
