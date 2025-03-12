"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function HomeContent() {
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="flex flex-col items-start gap-6">
        <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</h1>
        
        <p className="text-lg text-muted-foreground">
          Choose a mini app to take your first step toward measurable success.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild>
            <Link href="/mini-apps/business-plan">
              <Plus className="mr-2 h-4 w-4" /> Create Business Plan
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/dashboard/business-plans">
              View Business Plans
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 