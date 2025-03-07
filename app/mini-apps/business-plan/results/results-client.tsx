'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Edit, ArrowLeft, Plus, RefreshCw, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { determineBusinessCategory } from '@/lib/ai/businessPlanUtils';
import { useBusinessPlanService, saveBusinessPlan } from '@/lib/services/businessPlanService';
import { BusinessPlan, BusinessPlanSection } from '@/types/businessPlan';
import { toast } from '@/components/ui/use-toast';

// Client component that uses useSearchParams
export default function ResultsClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [isResearching, setIsResearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [businessPlan, setBusinessPlan] = useState<BusinessPlan | null>(null);
  const [researchResults, setResearchResults] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, loading } = useAuth();
  const businessPlanService = useBusinessPlanService();

  // Get form data from URL params - using useCallback to memoize
  const getFormDataFromParams = useCallback(() => {
    const formData: Record<string, string> = {};
    
    // Extract all search params
    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        formData[key] = value;
      }
    }
    
    return formData;
  }, [searchParams]);

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !isSignedIn) {
      router.push('/sign-in?redirectTo=/mini-apps/business-plan/results');
      return;
    }

    // Get form data from URL params
    const formData = getFormDataFromParams();
    
    // Check if we have the necessary data
    if (!formData.businessIdea || !formData.location) {
      setError('Missing required business information. Please go back and complete the form.');
      setIsLoading(false);
      return;
    }

    // Perform research and generate business plan
    const performResearchAndGenerate = async () => {
      try {
        setIsLoading(true);
        setIsResearching(true);
        setApiErrors({});
        
        console.log('Starting research with form data:', formData);
        
        // Step 1: Perform research using Perplexity
        const researchResponse = await fetch('/api/business-plan/research', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!researchResponse.ok) {
          const errorData = await researchResponse.json();
          throw new Error(errorData.error || 'Failed to perform research');
        }

        const researchData = await researchResponse.json();
        console.log('Research completed successfully');
        setResearchResults(researchData.research);
        setIsResearching(false);
        setIsGenerating(true);

        // Step 2: Generate business plan using the research results
        console.log('Starting business plan generation');
        const generateResponse = await fetch('/api/business-plan/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formData,
            researchResults: researchData.research,
          }),
        });

        if (!generateResponse.ok) {
          const errorData = await generateResponse.json();
          throw new Error(errorData.error || 'Failed to generate business plan');
        }

        const generateData = await generateResponse.json();
        console.log('Business plan generated successfully');
        
        // Check if any sections have errors
        const sectionsWithErrors: Record<string, string> = {};
        let hasErrors = false;
        
        if (generateData.businessPlan && generateData.businessPlan.sections) {
          generateData.businessPlan.sections.forEach((section: BusinessPlanSection) => {
            if (section.content.startsWith('Error generating')) {
              sectionsWithErrors[section.title] = section.content;
              hasErrors = true;
            }
          });
        }
        
        if (hasErrors) {
          setApiErrors(sectionsWithErrors);
          console.warn('Some sections had errors:', sectionsWithErrors);
        }
        
        setBusinessPlan(generateData.businessPlan);
      } catch (error) {
        console.error('Error generating business plan:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
        setIsResearching(false);
        setIsGenerating(false);
      }
    };

    if (!loading && isSignedIn && searchParams) {
      performResearchAndGenerate();
    }
  }, [loading, isSignedIn, router, searchParams, getFormDataFromParams]);

  const handleRetry = async () => {
    // Get form data from URL params
    const formData = getFormDataFromParams();
    
    try {
      setIsLoading(true);
      setIsGenerating(true);
      setApiErrors({});
      
      // Generate business plan using the existing research results
      console.log('Retrying business plan generation');
      const generateResponse = await fetch('/api/business-plan/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          researchResults,
        }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Failed to generate business plan');
      }

      const generateData = await generateResponse.json();
      console.log('Business plan generated successfully on retry');
      
      // Check if any sections have errors
      const sectionsWithErrors: Record<string, string> = {};
      let hasErrors = false;
      
      if (generateData.businessPlan && generateData.businessPlan.sections) {
        generateData.businessPlan.sections.forEach((section: BusinessPlanSection) => {
          if (section.content.startsWith('Error generating')) {
            sectionsWithErrors[section.title] = section.content;
            hasErrors = true;
          }
        });
      }
      
      if (hasErrors) {
        setApiErrors(sectionsWithErrors);
        console.warn('Some sections still had errors after retry:', sectionsWithErrors);
      } else {
        setApiErrors({});
      }
      
      setBusinessPlan(generateData.businessPlan);
    } catch (error) {
      console.error('Error retrying business plan generation:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred during retry');
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleSaveToDashboard = async () => {
    if (!businessPlan) return;
    
    try {
      setIsSaving(true);
      
      // Try to use the hook first, fall back to the standalone function
      try {
        // Save the business plan to the user's dashboard using Convex
        await businessPlanService.saveBusinessPlan(businessPlan);
      } catch (convexError) {
        console.warn('Failed to save with Convex, falling back to local storage:', convexError);
        // Fall back to local storage if Convex fails
        await saveBusinessPlan(businessPlan);
      }
      
      // Mark as saved
      setIsSaved(true);
      
      // Show success toast
      toast({
        title: "Business Plan Saved",
        description: "Your business plan has been saved to your dashboard.",
      });
    } catch (error) {
      console.error('Error saving business plan:', error);
      
      // Show error toast
      toast({
        title: "Error Saving Business Plan",
        description: "There was an error saving your business plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    alert('Downloading business plan...');
  };

  const handleEdit = () => {
    // Navigate back to the form with the current data
    router.push('/mini-apps/business-plan');
  };

  const handleCreateNew = () => {
    router.push('/mini-apps/business-plan');
  };

  const handleViewInDashboard = () => {
    router.push('/dashboard/plans');
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
          <h2 className="text-2xl font-bold text-center text-foreground">
            {isResearching ? 'Researching Your Business' : isGenerating ? 'Generating Your Business Plan' : 'Preparing Your Business Plan'}
          </h2>
          <p className="text-foreground/70 text-center mt-2">
            {isResearching 
              ? 'We\'re gathering market research and industry insights...' 
              : isGenerating 
                ? 'Creating your comprehensive business plan based on research...'
                : 'Please wait while we prepare your business plan...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="text-center mt-8">
          <Button
            onClick={() => router.push('/mini-apps/business-plan')}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Business Plan Form
          </Button>
        </div>
      </div>
    );
  }

  const hasApiErrors = Object.keys(apiErrors).length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/mini-apps')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mini-Apps
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Plan
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
      
      {hasApiErrors && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Some sections could not be generated</AlertTitle>
          <AlertDescription>
            <p>There were errors generating some sections of your business plan. You can try again or continue with the partial plan.</p>
            <ul className="mt-2 list-disc pl-5">
              {Object.entries(apiErrors).map(([section, error]) => (
                <li key={section}>{section}: {error}</li>
              ))}
            </ul>
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Generation
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-card rounded-lg shadow-md p-8 mb-8 border border-border">
        <div className="mb-8 text-center">
          <div className="inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Your Business Plan is Ready!</h1>
          <p className="text-foreground/70">
            Your comprehensive business plan has been generated based on market research and your inputs.
          </p>
          {businessPlan?.category && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-300">
                {businessPlan.category}
              </span>
            </div>
          )}
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">{businessPlan?.title}</h2>
          
          <div className="space-y-6">
            {businessPlan?.sections.map((section, index) => (
              <div key={index} className="border border-border rounded-lg p-6 bg-background">
                <h3 className="text-xl font-semibold mb-3 text-foreground">{section.title}</h3>
                <div className="prose dark:prose-invert max-w-none">
                  {section.content.startsWith('Error generating') ? (
                    <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        {section.content}
                      </p>
                    </div>
                  ) : (
                    section.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 text-foreground/90">{paragraph}</p>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          {!isSaved ? (
            <Button
              onClick={handleSaveToDashboard}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save to Dashboard
                </>
              )}
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Saved to Dashboard</span>
              </div>
              <Button
                onClick={handleViewInDashboard}
                variant="outline"
              >
                View in Dashboard
              </Button>
            </div>
          )}
          
          <Button
            onClick={handleCreateNew}
            variant="outline"
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Another Business Plan
          </Button>
        </div>
      </div>
    </div>
  );
} 