import React from 'react';
import { Button } from '@/components/ui/button';

interface FormNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
}

export default function FormNavigation({
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
  isNextDisabled = false,
  isSubmitting = false,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={isFirstStep || isSubmitting}
        className={isFirstStep ? 'opacity-0 pointer-events-none' : ''}
      >
        Back
      </Button>
      
      <Button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled || isSubmitting}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : isLastStep ? (
          'Generate Plan'
        ) : (
          'Next'
        )}
      </Button>
    </div>
  );
} 