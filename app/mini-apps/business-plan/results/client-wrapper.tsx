'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

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

// Dynamically import the client component
const ResultsClient = dynamic(() => import('./results-client'), {
  ssr: false,
  loading: () => <BusinessPlanLoading />
});

// Client Component Wrapper
export default function ClientWrapper() {
  return <ResultsClient />;
} 