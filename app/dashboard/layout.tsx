"use client";

import { dashboardConfig } from "@/config/dashboard";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { UserAccountDropdown } from "@/components/dashboard/user-account-dropdown";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="hidden items-center space-x-2 md:flex">
                <span className="hidden font-bold sm:inline-block text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Summit
                </span>
              </Link>
              <MobileNav
                mainNavItems={dashboardConfig.mainNav}
                sidebarNavItems={dashboardConfig.sidebarNav}
                actionButtons={dashboardConfig.actionButtons}
              />
            </div>
            <div className="flex items-center gap-4">
              <UserAccountDropdown />
            </div>
          </div>
        </header>
        <div className="flex-1 md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[288px_minmax(0,1fr)]">
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-[220px] lg:w-[288px] md:sticky md:block bg-[#f5f5f5] border-r border-[#e0e0e0] left-0">
            <div className="h-full py-6 pl-4 pr-0 lg:py-8">
              <DashboardNav items={dashboardConfig.sidebarNav} />
            </div>
          </aside>
          <main className="flex flex-col overflow-hidden p-4 md:py-8 md:pl-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 