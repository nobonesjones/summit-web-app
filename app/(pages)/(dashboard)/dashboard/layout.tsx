"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { dashboardConfig } from "@/config/dashboard";
import { useAuth } from "@/lib/hooks/useAuth";
import { redirect } from "next/navigation";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Client component for auth check
function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isSignedIn, loading } = useAuth();

  // If not loading and not signed in, redirect to sign-in
  if (!loading && !isSignedIn) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthCheck>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <MobileNav
                mainNavItems={dashboardConfig.mainNav}
                sidebarNavItems={dashboardConfig.sidebarNav}
              />
              <Link 
                href="/" 
                className="hidden md:block transition-transform hover:scale-105"
                aria-label="Go to home page"
              >
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Summit
                </h1>
              </Link>
            </div>
            <div className="hidden gap-6 md:flex">
              <DashboardNav items={dashboardConfig.mainNav} />
            </div>
          </div>
        </header>
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
            <Sidebar className="py-6">
              <DashboardNav items={dashboardConfig.sidebarNav} />
            </Sidebar>
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </AuthCheck>
  );
} 