"use client";

import { useState } from "react";
import {
  Bell,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "shortlist" | "deadline" | "drive" | "system";
  read: boolean;
  actionHref?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "Shortlisted for TechNova Interview Round 1",
    message: "Congratulations! You have been shortlisted for the Frontend Developer role. Technical interview scheduled for 26 Nov 2026, 10:30 AM via Google Meet.",
    time: "2 hours ago",
    type: "shortlist",
    read: false,
    actionHref: "/student/applications",
  },
  {
    id: "n-2",
    title: "Application Deadline Closing Tonight: CloudKart",
    message: "Drive for SDE-1 (Quick Commerce) closes at 11:59 PM. Ensure your resume and CGPA are updated before applying.",
    time: "5 hours ago",
    type: "deadline",
    read: false,
    actionHref: "/student/opportunities",
  },
  {
    id: "n-3",
    title: "New Recruiter Registered: FinEdge Technologies",
    message: "FinEdge Technologies has posted 4 openings for Graduate Software Engineer (CTC: 12 - 18 LPA). CSE/IT batch of 2027 eligible.",
    time: "1 day ago",
    type: "drive",
    read: true,
    actionHref: "/student/opportunities",
  },
  {
    id: "n-4",
    title: "Resume Verified by Placement Cell",
    message: "Your uploaded resume (Deepak_Gautam_SDE_Resume_2027.pdf) was reviewed and approved with 88 ATS compatibility points.",
    time: "2 days ago",
    type: "system",
    read: true,
    actionHref: "/student/resume",
  },
];

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markSingleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Placement Notifications & Alerts"
        description="Official interview schedules, deadline reminders, and recruiter announcements from the TPO."
        action={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Mark all as read
            </Button>
          )
        }
      />

      <Card className="interactive-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Inbox ({notifications.length})
            </CardTitle>
            <CardDescription>
              {unreadCount > 0 ? `You have ${unreadCount} unread message(s)` : "All notifications caught up!"}
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-white text-xs">
              {unreadCount} New
            </Badge>
          )}
        </CardHeader>
        <CardContent className="divide-y p-0">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markSingleRead(item.id)}
              className={`flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between transition-colors cursor-pointer ${
                item.read ? "bg-white hover:bg-slate-50/70" : "bg-indigo-50/40 hover:bg-indigo-50/70"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    item.type === "shortlist"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.type === "deadline"
                      ? "bg-amber-100 text-amber-700"
                      : item.type === "drive"
                      ? "bg-indigo-100 text-primary"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.type === "shortlist" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : item.type === "deadline" ? (
                    <Clock className="h-4 w-4" />
                  ) : item.type === "drive" ? (
                    <Briefcase className="h-4 w-4" />
                  ) : (
                    <Info className="h-4 w-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${item.read ? "font-medium text-foreground" : "font-bold text-foreground"}`}>
                      {item.title}
                    </p>
                    {!item.read && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.message}</p>
                  <span className="text-[11px] text-slate-400 font-medium block pt-1">
                    {item.time}
                  </span>
                </div>
              </div>

              {item.actionHref && (
                <div className="shrink-0 self-end sm:self-center">
                  <Button asChild size="sm" variant="ghost" className="h-8 text-xs text-primary">
                    <Link href={item.actionHref}>
                      View Details
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
