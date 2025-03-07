'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Loading component
function BusinessPlanLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <h2 className="text-2xl font-bold text-center text-foreground">
          Preparing Your Business Plan
        </h2>
        <p className="text-foreground/70 text-center mt-2">
          Please wait while we prepare your business plan...
        </p>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function BusinessPlanResults() {
  return (
    <Suspense fallback={<BusinessPlanLoading />}>
      <BusinessPlanResultsContent />
    </Suspense>
  );
}

// Import the content component from a separate file to ensure proper code splitting
import BusinessPlanResultsContent from './results-content'; 