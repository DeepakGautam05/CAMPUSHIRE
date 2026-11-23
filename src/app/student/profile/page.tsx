"use client";

import { useState } from "react";
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Edit3,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function StudentProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: "Deepak Gautam",
    rollNo: "233114",
    branch: "Computer Science & Engineering",
    batch: "2027",
    cgpa: "8.10",
    backlogs: "0",
    email: "deepak.g@campus.edu",
    phone: "+91 98112 00114",
    linkedIn: "https://linkedin.com/in/deepak-gautam",
    github: "https://github.com/DeepakGautam05",
    portfolio: "https://deepakgautam.dev",
    address: "New Delhi, India",
    placementStatus: "Actively Seeking Opportunities",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveMessage("Profile details updated successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Student Profile"
        description="Manage your academic credentials, contact info, and placement verification details."
        action={
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? (
              <>
                <Save className="mr-1.5 h-4 w-4" />
                Done Editing
              </>
            ) : (
              <>
                <Edit3 className="mr-1.5 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        }
      />

      {saveMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {saveMessage}
        </div>
      )}

      {/* Top Banner Card */}
      <Card className="border-indigo-100 bg-linear-to-r from-indigo-50/70 via-white to-sky-50/50 interactive-card">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-md">
              DG
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                <Badge variant="outline" className="border-indigo-200 bg-white text-primary text-xs">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5 text-indigo-600" />
                  Verified TPO Record
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Roll No: <span className="font-semibold text-foreground">{profile.rollNo}</span> · {profile.branch}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  Batch {profile.batch}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                  CGPA: <strong className="text-foreground">{profile.cgpa}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  {profile.address}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-3 shadow-2xs sm:text-right">
            <span className="text-[11px] font-medium text-muted-foreground">Placement Status</span>
            <p className="text-sm font-semibold text-primary">{profile.placementStatus}</p>
            <span className="text-[10px] text-emerald-600 font-medium">Eligible for Day-1 & Super Dream Drives</span>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-2">
        {/* Academic Details */}
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Academic Credentials
            </CardTitle>
            <CardDescription>Verified institutional records synced with university registry.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Batch</label>
                <Input value={profile.batch} disabled className="mt-1 bg-muted/40" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Cumulative CGPA</label>
                <Input
                  value={profile.cgpa}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Active Backlogs</label>
                <Input value={profile.backlogs} disabled className="mt-1 bg-muted/40 font-semibold text-emerald-600" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Degree Program</label>
                <Input value="B.Tech (CSE - 4 Years)" disabled className="mt-1 bg-muted/40" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Department / Branch</label>
              <Input value={profile.branch} disabled className="mt-1 bg-muted/40" />
            </div>
          </CardContent>
        </Card>

        {/* Contact & Social Links */}
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Contact & Professional Links
            </CardTitle>
            <CardDescription>Direct channels used by HR recruiters to send interview invites.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">College Email ID</label>
              <Input value={profile.email} disabled className="mt-1 bg-muted/40" />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
              <Input
                value={profile.phone}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">GitHub Profile URL</label>
              <Input
                value={profile.github}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">LinkedIn URL</label>
              <Input
                value={profile.linkedIn}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, linkedIn: e.target.value })}
                className="mt-1"
              />
            </div>

            {isEditing && (
              <Button type="submit" className="w-full mt-2">
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
