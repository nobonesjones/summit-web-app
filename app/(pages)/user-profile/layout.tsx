"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import ModeToggle from "@/components/mode-toggle";
import UserProfile from "@/components/user-profile";

interface UserProfileLayoutProps {
  children: React.ReactNode;
}

// Client component for auth check
function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // If not loading and not signed in, redirect to sign-in
  if (!loading && !user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}

export default function UserProfileLayout({ children }: UserProfileLayoutProps) {
  return (
    <AuthCheck>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="transition-transform hover:scale-105"
                aria-label="Go to home page"
              >
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Summit
                </h1>
              </Link>
            </div>
            {/* User Profile and Mode Toggle */}
            <div className="flex items-center gap-2">
              <UserProfile />
              <ModeToggle />
            </div>
          </div>
        </header>
        
        <main className="flex-1 container py-6">
          <div className="flex w-full flex-col overflow-hidden bg-white dark:bg-slate-950">
            {children}
          </div>
        </main>
      </div>
    </AuthCheck>
  );
} 