"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { useBusinessPlans } from "@/lib/hooks/useBusinessPlans";

export default function BusinessPlansContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { businessPlans, isLoading: plansLoading, error: plansError, fetchBusinessPlans } = useBusinessPlans();
  const [mounted, setMounted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Fetch business plans when component mounts or user changes
  useEffect(() => {
    if (mounted && !authLoading) {
      try {
        console.log('Fetching business plans for user:', user?.id);
        fetchBusinessPlans().catch(err => {
          console.error('Error fetching business plans:', err);
          setLocalError('Failed to fetch business plans');
        });
      } catch (error) {
        console.error('Error in fetchBusinessPlans effect:', error);
        setLocalError('Error in business plans fetch');
      }
    }
  }, [mounted, authLoading, user, fetchBusinessPlans]);

  // Helper function to safely format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Helper function to get plan title
  const getPlanTitle = (plan: any) => {
    return plan.title || plan.name || "Untitled Plan";
  };

  // Helper function to get business idea/type
  const getPlanType = (plan: any) => {
    return plan.category || plan.type || plan.businessIdea || plan.business_idea || "Business Plan";
  };

  // Helper function to get created date
  const getPlanDate = (plan: any) => {
    return plan.created_at || plan.createdAt;
  };

  if (!mounted || authLoading || plansLoading) {
    return (
      <div>
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-[190px] bg-gray-200 rounded animate-pulse"></div>
          <div className="h-[190px] bg-gray-200 rounded animate-pulse"></div>
          <div className="h-[190px] bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // If there was an error, show it
  if (plansError || localError) {
    const errorMessage = plansError ? plansError.message : localError;
    
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Business Plans</h1>
          <Button asChild>
            <Link href="/mini-apps/business-plan">
              <Plus className="mr-2 h-4 w-4" /> Create Business Plan
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-red-500 mb-4">Error: {errorMessage}</div>
          <p className="text-muted-foreground mb-6">
            There was a problem fetching your business plans. Please try again later.
          </p>
          <Button asChild>
            <Link href="/mini-apps/business-plan">
              <Plus className="mr-2 h-4 w-4" /> Create Business Plan
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // If there are no business plans, show a message
  if (!businessPlans || businessPlans.length === 0) {
    console.log('Rendering empty state - no business plans');
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Business Plans</h1>
          <Button asChild>
            <Link href="/mini-apps/business-plan">
              <Plus className="mr-2 h-4 w-4" /> Create Business Plan
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No business plans yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first business plan to get started
          </p>
          <Button asChild>
            <Link href="/mini-apps/business-plan">
              <Plus className="mr-2 h-4 w-4" /> Create Business Plan
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // If there are business plans, show them
  console.log('Rendering business plans list with', businessPlans.length, 'plans');
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Business Plans</h1>
        <Button asChild>
          <Link href="/mini-apps/business-plan">
            <Plus className="mr-2 h-4 w-4" /> Create Business Plan
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {businessPlans.map((plan: any) => (
              <Card key={plan.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{getPlanTitle(plan)}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(getPlanDate(plan))}
                      </p>
                      <p className="text-sm font-medium mt-2">{getPlanType(plan)}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/business-plans/${plan.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {businessPlans
              .sort((a: any, b: any) => {
                const dateA = new Date(getPlanDate(a) || 0).getTime();
                const dateB = new Date(getPlanDate(b) || 0).getTime();
                return dateB - dateA;
              })
              .slice(0, 3)
              .map((plan: any) => (
                <Card key={plan.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{getPlanTitle(plan)}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(getPlanDate(plan))}
                        </p>
                        <p className="text-sm font-medium mt-2">{getPlanType(plan)}</p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/business-plans/${plan.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 