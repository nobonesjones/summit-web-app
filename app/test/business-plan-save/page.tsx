'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { createBusinessPlan } from '@/lib/supabase/services/businessPlans';
import { toast } from '@/components/ui/use-toast';
import { BusinessPlanStatus } from '@/types/business-plan';

export default function TestBusinessPlanSavePage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleTestSave = async () => {
    if (!user) {
      toast({
        title: 'Not Authenticated',
        description: 'You must be logged in to test this functionality.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Create a test business plan with just the required fields
      const testPlan = {
        title: 'Test Business Plan',
        business_idea: 'This is a test business idea',
        location: 'Test Location',
        category: 'New Company'
      };
      
      console.log('Saving business plan with data:', JSON.stringify(testPlan, null, 2));
      
      // Try to save the business plan to Supabase
      try {
        const savedPlan = await createBusinessPlan(testPlan);
        console.log('Business plan saved successfully:', savedPlan);
        
        setResult({
          success: true,
          plan: savedPlan
        });
        
        toast({
          title: 'Success',
          description: 'Business plan saved successfully!',
        });
      } catch (saveError) {
        console.error('Error details:', saveError);
        
        // Try to extract more information from the error
        if (saveError instanceof Error) {
          console.error('Error name:', saveError.name);
          console.error('Error message:', saveError.message);
          console.error('Error stack:', saveError.stack);
          
          // Check if it's a BusinessPlanError with additional properties
          if ((saveError as any).code) {
            console.error('Error code:', (saveError as any).code);
          }
          
          if ((saveError as any).originalError) {
            console.error('Original error:', (saveError as any).originalError);
          }
        }
        
        throw saveError; // Re-throw to be caught by the outer catch block
      }
    } catch (error) {
      console.error('Error saving business plan:', error);
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Check if it's a BusinessPlanError with additional properties
        if (error.name === 'BusinessPlanError' && 'code' in error && 'originalError' in error) {
          console.error('Error code:', (error as any).code);
          console.error('Original error:', (error as any).originalError);
        }
      }
      
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test Business Plan Save</h1>
      
      <div className="mb-4">
        <p>User: {user ? user.email : 'Not logged in'}</p>
      </div>
      
      <button
        onClick={handleTestSave}
        disabled={isSaving || !user}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Test Save Business Plan'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 