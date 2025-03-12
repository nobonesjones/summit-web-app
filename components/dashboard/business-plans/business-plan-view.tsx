"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/Icons";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Printer, Download, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { InlineEditTitle } from "@/components/ui/inline-edit";

export default function BusinessPlanView({ id }: { id: string }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [businessPlan, setBusinessPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchBusinessPlan = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching business plan:", id);
        const { data, error } = await supabase
          .from("business_plans")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching business plan:", error);
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error("Business plan not found");
        }

        console.log("Business plan fetched:", data);
        setBusinessPlan(data);
      } catch (err) {
        console.error("Error in fetchBusinessPlan:", err);
        setError(err instanceof Error ? err : new Error("An error occurred"));
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to load business plan",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchBusinessPlan();
    }
  }, [id, user, authLoading, supabase]);

  // Function to update the business plan title
  const updateBusinessPlanTitle = async (newTitle: string) => {
    if (!user || !businessPlan) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from("business_plans")
        .update({ business_idea: newTitle })
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local state
      setBusinessPlan({
        ...businessPlan,
        business_idea: newTitle
      });
      
      toast({
        title: "Success",
        description: "Business plan title updated successfully",
      });
    } catch (err) {
      console.error("Error updating business plan title:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update business plan title",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    if (!confirm("Are you sure you want to delete this business plan? This action cannot be undone.")) {
      return;
    }
    
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("business_plans")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Dispatch a custom event to notify the navigation component to refresh
      const refreshEvent = new CustomEvent('business-plans-changed', {
        detail: { action: 'delete', planId: id }
      });
      window.dispatchEvent(refreshEvent);
      
      toast({
        title: "Business plan deleted",
        description: "Your business plan has been successfully deleted.",
      });
      
      router.push("/dashboard/business-plans");
    } catch (error) {
      console.error("Error deleting business plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete business plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading || authLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1" disabled>
            <ArrowLeft className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </Button>
        </div>
        <Skeleton className="h-10 w-[250px] mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[150px]" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Icons.warning className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error loading business plan</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || "There was an error loading your business plan. Please try again."}
        </p>
        <div className="flex gap-4">
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => router.refresh()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!businessPlan) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Icons.fileX className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Business Plan Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The business plan you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link href="/dashboard/business-plans">Back to Business Plans</Link>
        </Button>
      </div>
    );
  }

  // Render business plan details
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Business Plans
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isSaving}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div>
        <InlineEditTitle 
          value={businessPlan.business_idea} 
          onChange={updateBusinessPlanTitle}
          className="text-3xl font-bold mb-2"
          disabled={isSaving}
        />
        <p className="text-muted-foreground">
          Created {formatDate(businessPlan.created_at)}
        </p>
      </div>

      {businessPlan.sections && Object.keys(businessPlan.sections).length > 0 && (
        <>
          {Object.entries(businessPlan.sections).map(([key, section]: [string, any]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{section.title || key}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{section.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button asChild>
          <Link href={`/dashboard/business-plans/${id}/edit`}>
            Edit Business Plan
          </Link>
        </Button>
      </div>
    </div>
  );
} 