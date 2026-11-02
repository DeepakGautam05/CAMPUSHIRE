"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [role, setRole] = useState<"student" | "officer">("student");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">CampusHire</span>
        </div>
        <div>
          <h2 className="max-w-md text-3xl font-semibold leading-tight">
            Campus placements, without the spreadsheet chaos.
          </h2>
          <ul className="mt-8 space-y-4 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-indigo-400" />
              AI reads job descriptions and fills the vacancy form for you.
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-indigo-400" />
              Every field is validated and approved by a human before publishing.
            </li>
            <li className="flex items-start gap-3">
              <Users className="mt-0.5 h-4 w-4 text-indigo-400" />
              One place for students, companies and the placement cell.
            </li>
          </ul>
        </div>
        <p className="text-xs text-slate-500">UI prototype with mock data</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to continue to CampusHire.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
            {(["student", "officer"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "cursor-pointer rounded-md py-1.5 text-sm font-medium text-muted-foreground transition-colors",
                  role === r && "bg-card text-foreground shadow-sm"
                )}
              >
                {r === "student" ? "Student" : "Placement Officer"}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={role === "student" ? "deepak@saitm.edu" : "placement@saitm.edu"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="password" />
            </div>
            <Button asChild className="w-full" size="lg">
              <Link href={role === "student" ? "/student" : "/officer"}>
                Sign in
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
