'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import BusinessPlanForm from '@/components/mini-apps/business-plan/BusinessPlanForm';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function BusinessPlanPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Set mounted to true when component mounts
  useEffect(() => {
    console.log('BusinessPlanPage: Component mounted');
    setMounted(true);
  }, []);

  // Log authentication state when it changes
  useEffect(() => {
    console.log('BusinessPlanPage: Auth state -', authLoading ? 'loading' : (user ? 'authenticated' : 'not authenticated'));
    if (user) {
      console.log('BusinessPlanPage: User -', user.email);
    }
  }, [user, authLoading]);

  // Handle form submission
  const handleSubmit = (formData: Record<string, string>) => {
    console.log('BusinessPlanPage: Form submitted with data:', formData);
    setIsSubmitting(true);
    
    try {
      // Check if user is authenticated before proceeding
      if (!user) {
        console.log('BusinessPlanPage: User not authenticated, redirecting to sign-in');
        router.push('/sign-in?redirect=/mini-apps/business-plan');
        return;
      }
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        
        toast({
          title: "Business plan created",
          description: "Your business plan has been created successfully.",
        });
        
        // Redirect to results page with form data as query params
        const queryParams = new URLSearchParams(formData);
        router.push(`/mini-apps/business-plan/results?${queryParams.toString()}`);
      }, 1500);
    } catch (err) {
      console.error('BusinessPlanPage: Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating your business plan');
      setIsSubmitting(false);
      
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An error occurred while creating your business plan',
        variant: "destructive"
      });
    }
  };

  // Don't render anything on the server to prevent hydration mismatch
  if (!mounted) {
    console.log('BusinessPlanPage: Not mounted yet, returning null');
    return null;
  }

  // Show a brief loading state, but don't wait for auth to complete
  if (!mounted && authLoading) {
    console.log('BusinessPlanPage: Showing initial loading skeleton');
    return (
      <div className="container py-10">
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    );
  }

  console.log('BusinessPlanPage: Rendering form');
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create Your Business Plan</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Always render the form, regardless of authentication state */}
      <BusinessPlanForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
} 