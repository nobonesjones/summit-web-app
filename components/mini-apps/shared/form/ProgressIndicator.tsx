import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  percentage: number;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  percentage,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground/70">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-foreground/70">
          {percentage}% Complete
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-purple-600 to-pink-500 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
} 