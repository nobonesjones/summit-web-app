'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import BusinessPlanForm from '@/components/mini-apps/business-plan/BusinessPlanForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BusinessPlanPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { isSignedIn, loading } = useAuth();

  // Handle form submission
  const handleSubmit = (formData: Record<string, string>) => {
    setIsSubmitting(true);
    
    // Create URL search params from form data
    const searchParams = new URLSearchParams();
    
    // Add each form field to the search params
    Object.entries(formData).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
    
    // Navigate to the results page with the form data as URL parameters
    router.push(`/mini-apps/business-plan/results?${searchParams.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/mini-apps')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mini-Apps
        </Button>
      </div>
      
      <BusinessPlanForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
} 