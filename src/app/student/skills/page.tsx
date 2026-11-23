"use client";

import { useState } from "react";
import {
  Award,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Plus,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface StudentSkill {
  name: string;
  category: "Frontend" | "Backend" | "Cloud / DevOps" | "Fundamentals";
  level: "Beginner" | "Intermediate" | "Advanced";
  verified: boolean;
  score: number;
}

const INITIAL_SKILLS: StudentSkill[] = [
  { name: "React / Next.js", category: "Frontend", level: "Advanced", verified: true, score: 92 },
  { name: "TypeScript", category: "Frontend", level: "Advanced", verified: true, score: 88 },
  { name: "Tailwind CSS", category: "Frontend", level: "Advanced", verified: true, score: 95 },
  { name: "Node.js & Express", category: "Backend", level: "Intermediate", verified: true, score: 76 },
  { name: "PostgreSQL & Prisma", category: "Backend", level: "Intermediate", verified: true, score: 78 },
  { name: "Data Structures & Algorithms", category: "Fundamentals", level: "Advanced", verified: true, score: 85 },
  { name: "Git & GitHub CI", category: "Cloud / DevOps", level: "Intermediate", verified: true, score: 80 },
  { name: "Docker & Containers", category: "Cloud / DevOps", level: "Beginner", verified: false, score: 45 },
];

export default function StudentSkillsPage() {
  const [skills, setSkills] = useState<StudentSkill[]>(INITIAL_SKILLS);
  const [newSkillName, setNewSkillName] = useState("");
  const [newCategory, setNewCategory] = useState<StudentSkill["category"]>("Frontend");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setSkills([
      ...skills,
      {
        name: newSkillName.trim(),
        category: newCategory,
        level: "Intermediate",
        verified: false,
        score: 65,
      },
    ]);
    setNewSkillName("");
    setToastMessage(`Skill "${newSkillName.trim()}" added to your profile!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Skill Matrix & Competency Profile"
        description="Showcase your validated technical competencies and track readiness for campus recruitments."
      />

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {toastMessage}
        </div>
      )}

      {/* Top Readiness Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="interactive-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium">Verified Skills</span>
              <p className="text-2xl font-bold text-foreground">
                {skills.filter((s) => s.verified).length} / {skills.length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="interactive-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium">Top Match Sector</span>
              <p className="text-lg font-bold text-primary">Full-Stack Web Dev</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-primary flex items-center justify-center">
              <Code2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="interactive-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium">Eligible Drives</span>
              <p className="text-2xl font-bold text-foreground">9 Openings</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Skill Form */}
      <Card className="interactive-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            Add New Technical Skill
          </CardTitle>
          <CardDescription>Declare new frameworks, libraries, or concepts to match with vacancy filters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSkill} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. GraphQL, AWS Lambda, Kubernetes, Redis..."
              className="flex-1"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="h-9 rounded-lg border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Cloud / DevOps">Cloud / DevOps</option>
              <option value="Fundamentals">Fundamentals</option>
            </select>
            <Button type="submit">Add Skill</Button>
          </form>
        </CardContent>
      </Card>

      {/* Skills Grid */}
      <Card className="interactive-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Your Declared & Verified Skills
          </CardTitle>
          <CardDescription>Click assessment or practice links to earn verified recruiter badges.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-lg border bg-card p-3 shadow-2xs hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-sm text-foreground">{skill.name}</span>
                  {skill.verified ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]" variant="outline">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      Self-reported
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>{skill.category}</span>
                    <span className="font-medium text-foreground">{skill.score}% Proficiency</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        skill.score >= 80 ? "bg-primary" : skill.score >= 60 ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
