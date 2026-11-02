"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Sparkles,
  Users,
  UserCircle,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ElementType };

const studentNav: NavItem[] = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/profile", label: "Profile", icon: UserCircle },
  { href: "/student/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/student/applications", label: "My Applications", icon: ClipboardList },
  { href: "/student/resume", label: "Resume", icon: FileText },
  { href: "/student/skills", label: "Skill Profile", icon: Wrench },
  { href: "/student/notifications", label: "Notifications", icon: Bell },
];

const officerNav: NavItem[] = [
  { href: "/officer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/officer/companies", label: "Companies", icon: Building2 },
  { href: "/officer/vacancies", label: "Vacancies", icon: Briefcase },
  { href: "/officer/vacancies/new", label: "Create Vacancy", icon: PlusCircle },
  { href: "/officer/applications", label: "Applications", icon: ClipboardList },
  { href: "/officer/students", label: "Students", icon: Users },
  { href: "/officer/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppShell({
  role,
  children,
}: {
  role: "student" | "officer";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const nav = role === "student" ? studentNav : officerNav;

  const isActive = (href: string) =>
    href === `/${role}` ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-card lg:flex">
        <div className="flex h-14 items-center gap-2 border-b px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-semibold">CampusHire</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActive(item.href) && "bg-indigo-50 text-primary hover:bg-indigo-50 hover:text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold">CampusHire</span>
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
            <Sparkles className="h-4 w-4 text-primary" />
            {role === "student" ? "Student workspace" : "Placement Cell workspace"}
          </div>
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-primary">
              {role === "student" ? "D" : "PO"}
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b bg-card px-3 py-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground",
                isActive(item.href) && "bg-indigo-50 text-primary"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
