"use client";

import BusinessPlansList from "./business-plans-list";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ClientWrapper() {
  const { isSignedIn, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Only show the component after it has mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[190px] rounded-xl" />
          <Skeleton className="h-[190px] rounded-xl" />
          <Skeleton className="h-[190px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[190px] rounded-xl" />
          <Skeleton className="h-[190px] rounded-xl" />
          <Skeleton className="h-[190px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <h2 className="text-2xl font-bold">Sign in to view your business plans</h2>
        <p className="text-muted-foreground">You need to be signed in to view and manage your business plans.</p>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  return <BusinessPlansList />;
} 