'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ResultsClient from './results-client';

// Loading component
function BusinessPlanLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <h2 className="text-2xl font-bold text-center text-foreground">
          Loading Business Plan
        </h2>
        <p className="text-foreground/70 text-center mt-2">
          Please wait while we prepare your business plan...
        </p>
      </div>
    </div>
  );
}

export default function BusinessPlanClient() {
  return (
    <Suspense fallback={<BusinessPlanLoading />}>
      <ResultsClient />
    </Suspense>
  );
} 