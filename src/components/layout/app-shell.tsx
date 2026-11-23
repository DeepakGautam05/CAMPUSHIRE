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

  const isActive = (href: string) => {
    if (href === `/${role}`) return pathname === href;
    if (href === "/officer/vacancies") {
      return (
        pathname === "/officer/vacancies" ||
        (pathname.startsWith("/officer/vacancies/") &&
          !pathname.startsWith("/officer/vacancies/new") &&
          !pathname.startsWith("/officer/vacancies/create") &&
          !pathname.startsWith("/officer/vacancies/review"))
      );
    }
    if (href === "/officer/vacancies/new") {
      return (
        pathname.startsWith("/officer/vacancies/new") ||
        pathname.startsWith("/officer/vacancies/create") ||
        pathname.startsWith("/officer/vacancies/review")
      );
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen lg:flex">
      {/* Modern Frosted Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-white/80 backdrop-blur-md lg:flex">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-primary to-indigo-500 text-primary-foreground shadow-sm shadow-primary/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-foreground">CampusHire</span>
            <span className="block text-[10px] font-semibold text-primary/80 uppercase tracking-wider">Placement Suite</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1.5 p-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-slate-100 hover:text-foreground",
                isActive(item.href) &&
                  "bg-linear-to-r from-indigo-500/10 via-primary/10 to-transparent font-semibold text-primary shadow-2xs border-l-3 border-primary"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive(item.href) && "text-primary")} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-4 bg-slate-50/50">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Modern Glass Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-4 lg:px-8">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-bold text-foreground">CampusHire</span>
          </div>
          <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground lg:flex">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
            {role === "student" ? "Student Placement Portal" : "Campus Placement Cell Management Suite"}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={role === "student" ? "/student/notifications" : "#"}
              className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
            </Link>

            {/* Profile badge with Quick Logout */}
            <div className="flex items-center gap-3 pl-3 border-l">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-tr from-indigo-100 to-sky-100 text-xs font-bold text-primary ring-2 ring-primary/20">
                {role === "student" ? "DG" : "PO"}
              </div>
              <div className="hidden flex-col text-left sm:flex">
                <span className="text-xs font-semibold leading-none text-foreground">
                  {role === "student" ? "Deepak Gautam" : "Officer Admin"}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {role === "student" ? "233114 · CSE" : "Training & Placement Cell"}
                </span>
              </div>
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg border border-red-200/60 bg-red-50/50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100/60 transition-colors ml-1"
                title="Logout from session"
              >
                <LogOut className="h-3 w-3" />
                <span className="hidden md:inline">Logout</span>
              </Link>
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
