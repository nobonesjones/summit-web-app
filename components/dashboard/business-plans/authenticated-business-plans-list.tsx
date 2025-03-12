"use client";

import { BusinessPlansList } from "@/components/dashboard/business-plans";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthenticatedBusinessPlansList() {
  const { isSignedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h2 className="text-2xl font-bold mb-4">Sign in to view your business plans</h2>
        <p className="text-muted-foreground mb-6">
          You need to be signed in to access your business plans.
        </p>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  return <BusinessPlansList />;
} 