"use client";

// Add console log at the top of the file
console.log("BusinessPlansList file loaded");

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/Icons";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useBusinessPlans } from "@/lib/hooks/useBusinessPlans";
import { BusinessPlan } from "@/types/business-plan";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname } from "next/navigation";

export default function BusinessPlansList() {
  // Add console log when component renders
  console.log("BusinessPlansList component rendering");

  // Client-side only state
  const [mounted, setMounted] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<BusinessPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();
  const { user } = useAuth();
  const pathname = usePathname();

  // Check if we're in the business plans folder
  const isBusinessPlansPage = pathname.includes('/dashboard/business-plans');

  // Ensure component is mounted before rendering dynamic content
  useEffect(() => {
    setMounted(true);
    console.log("BusinessPlansList mounted, user:", user?.id);
  }, [user]);

  // Get business plans with specific options when in business plans folder
  const { 
    businessPlans, 
    isLoading, 
    error, 
    refreshBusinessPlans 
  } = useBusinessPlans({
    // Only auto-fetch when in the business plans folder
    autoFetch: isBusinessPlansPage,
    // Order by creation date, newest first
    orderBy: 'created_at',
    orderDirection: 'desc',
    // Limit to 50 plans
    limit: 50
  });

  // Force refresh when entering the business plans page
  useEffect(() => {
    if (isBusinessPlansPage && user) {
      console.log("In business plans page, refreshing plans for user:", user.id);
      refreshBusinessPlans();
    }
  }, [isBusinessPlansPage, user, refreshBusinessPlans]);

  // Handle delete
  const handleDelete = async (plan: BusinessPlan) => {
    if (!plan || isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log("Deleting business plan:", plan.id);
      
      const { error } = await supabase
        .from('business_plans')
        .delete()
        .eq('id', plan.id)
        .eq('user_id', user?.id);
        
      if (error) {
        console.error("Error deleting business plan:", error);
        throw error;
      }
      
      // Refresh the list after deletion
      refreshBusinessPlans();
      
      toast({
        title: "Success",
        description: "Business plan deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting business plan:", err);
      toast({
        title: "Error",
        description: "Failed to delete business plan",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setPlanToDelete(null);
    }
  };

  // Show loading skeleton during server-side rendering and initial client render
  if (!mounted || isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-0">
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </CardHeader>
            <CardContent className="pb-0">
              <Skeleton className="h-20 w-full mt-4" />
            </CardContent>
            <CardFooter className="flex justify-between mt-4">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-9" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Icons.warning className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error loading business plans</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || "There was an error loading your business plans. Please try again."}
        </p>
        <div className="flex flex-col gap-4 items-center">
          <Button onClick={() => refreshBusinessPlans()}>
            Try Again
          </Button>
          <details className="text-sm text-muted-foreground mt-4 max-w-md">
            <summary className="cursor-pointer">Technical Details</summary>
            <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto text-xs">
              {error.stack || error.message}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  if (!businessPlans || businessPlans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Icons.fileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No business plans yet</h2>
        <p className="text-muted-foreground mb-6">
          Create your first business plan to get started.
        </p>
        <Button asChild>
          <Link href="/mini-apps/business-plan">Create Business Plan</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Business Plans</h1>
        <Button asChild>
          <Link href="/mini-apps/business-plan">Create New Plan</Link>
        </Button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {businessPlans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="truncate">{plan.title}</CardTitle>
              <CardDescription>
                Created {plan.created_at ? formatDate(plan.created_at) : 'Unknown date'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {plan.business_idea}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild variant="outline">
                <Link href={`/dashboard/business-plans/${plan.id}`}>
                  View Details
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Icons.moreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/business-plans/${plan.id}`}>
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setPlanToDelete(plan)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!planToDelete} onOpenChange={(open) => !open && setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              business plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => planToDelete && handleDelete(planToDelete)}
              className={`bg-destructive text-destructive-foreground hover:bg-destructive/90 ${isDeleting ? 'opacity-50' : ''}`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 