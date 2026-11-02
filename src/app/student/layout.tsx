import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AppShell role="student">{children}</AppShell>
    </Suspense>
  );
}
