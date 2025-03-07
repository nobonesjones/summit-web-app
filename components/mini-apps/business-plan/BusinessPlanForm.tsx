'use client';

import React, { useEffect } from 'react';
import { Question, useBusinessPlanForm } from '@/lib/hooks/useBusinessPlanForm';
import ProgressIndicator from '../shared/form/ProgressIndicator';
import QuestionCard from '../shared/form/QuestionCard';
import FormNavigation from '../shared/form/FormNavigation';
import SuggestionsList from '../shared/suggestions/SuggestionsList';
import { X } from 'lucide-react';

interface BusinessPlanFormProps {
  onSubmit: (data: Record<string, string>) => void;
  isSubmitting?: boolean;
}

// Sample questions for the business plan
const businessPlanQuestions: Question[] = [
  {
    id: 'businessIdea',
    text: 'What is your business idea?',
    inputType: 'textarea',
    placeholder: 'E.g. A mobile coffee subscription service that delivers weekly.',
    required: true,
    hideSuggestions: true,
  },
  {
    id: 'location',
    text: 'Where is your business located?',
    inputType: 'text',
    placeholder: 'E.g. Dubai, UAE or Dubai with global online presence',
    required: true,
    hideSuggestions: true,
  },
  {
    id: 'targetMarket',
    text: 'Who is your target market?',
    inputType: 'textarea',
    placeholder: 'E.g. Young professionals, coffee enthusiasts, busy parents',
    required: true,
  },
  {
    id: 'solution',
    text: 'What problem are you solving?',
    inputType: 'textarea',
    placeholder: 'E.g. Delivering fresh coffee directly saves time and ensures quality',
    required: true,
  },
  {
    id: 'stage',
    text: 'What stage is your business at currently?',
    inputType: 'clickable-options',
    placeholder: 'Select your business stage',
    required: true,
    multiSelect: true,
    options: [
      { value: 'concept', label: 'Concept / Idea' },
      { value: 'prototype', label: 'Prototype / MVP' },
      { value: 'first-customers', label: 'First Few Customers' },
      { value: 'scaling', label: 'Already In Business Scaling Up (+$100k yearly revenue)' },
      { value: 'established', label: 'Established Business (+ $1 million yearly revenue)' },
    ],
  },
  {
    id: 'teamSize',
    text: 'How many team members do you have?',
    inputType: 'clickable-options',
    placeholder: 'Select team size',
    required: true,
    multiSelect: true,
    options: [
      { value: 'founders', label: 'Founder / Founders' },
      { value: 'small-team', label: '1 - 5 employees' },
      { value: 'medium-team', label: '6 - 10 employees' },
      { value: 'large-team', label: '11 - 50 employees' },
      { value: 'enterprise', label: '50+ employees' },
    ],
  },
  {
    id: 'revenueModel',
    text: 'How will you make money?',
    inputType: 'textarea',
    placeholder: 'E.g. We will sell subscriptions and offer one-time purchases',
    required: true,
  },
  {
    id: 'fundingNeeds',
    text: 'Is the business funded, do you need funding?',
    inputType: 'text',
    placeholder: 'E.g. 200K AED for initial inventory and marketing',
    required: true,
  },
  {
    id: 'growthGoals',
    text: 'What are your growth goals?',
    inputType: 'textarea',
    placeholder: 'E.g. 500 subscribers in year one, expand to Abu Dhabi by year two',
    required: true,
  },
  {
    id: 'customerAcquisition',
    text: 'How will you reach your customers?',
    inputType: 'textarea',
    placeholder: 'E.g. Instagram ads, local events, word of mouth',
    required: true,
  },
  {
    id: 'keyResources',
    text: 'What key resources do you need?',
    inputType: 'textarea',
    placeholder: 'E.g. Coffee roasting equipment, delivery vehicles, website',
    required: true,
  },
  {
    id: 'additionalInfo',
    text: 'Any advantages, experiences, connections etc that would help this person in this business',
    inputType: 'textarea',
    placeholder: 'E.g. We have a big instagram folllowing alread, we work in the industry, we have partnership with local roasters, seasonal menu planned',
    required: false,
  },
];

// Component for clickable options with multi-select support
const ClickableOptions = ({ 
  options, 
  value, 
  onChange,
  multiSelect = false
}: { 
  options: { value: string; label: string }[]; 
  value: string; 
  onChange: (value: string) => void;
  multiSelect?: boolean;
}) => {
  // Parse the current value into an array of selected values
  const selectedValues = value ? value.split(', ') : [];
  
  // Handle option click
  const handleOptionClick = (optionValue: string) => {
    if (multiSelect) {
      // For multi-select, toggle the selection
      let newSelectedValues: string[];
      
      if (selectedValues.includes(optionValue)) {
        // Remove the value if already selected
        newSelectedValues = selectedValues.filter(val => val !== optionValue);
      } else {
        // Add the value if not already selected
        newSelectedValues = [...selectedValues, optionValue];
      }
      
      // Join the selected values with a comma and space
      onChange(newSelectedValues.join(', '));
    } else {
      // For single select, just set the value
      onChange(optionValue);
    }
  };
  
  // Check if an option is selected
  const isSelected = (optionValue: string) => {
    return multiSelect 
      ? selectedValues.includes(optionValue)
      : value === optionValue;
  };
  
  return (
    <div>
      {multiSelect && selectedValues.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-foreground/70 mb-2">Selected options:</p>
          <div className="flex flex-wrap gap-2">
            {selectedValues.map((val) => {
              const option = options.find(opt => opt.value === val);
              return option ? (
                <div 
                  key={option.value} 
                  className="inline-flex items-center bg-purple-100 dark:bg-purple-900 text-foreground px-3 py-1 rounded-full text-sm"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={() => handleOptionClick(option.value)}
                    className="ml-1 text-foreground/70 hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
      
      <div className="mt-4 space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleOptionClick(option.value)}
            className={`block w-full text-left px-4 py-3 border rounded-md transition-colors ${
              isSelected(option.value)
                ? 'bg-purple-100 border-purple-500 dark:bg-purple-900 dark:border-purple-400' 
                : 'bg-background border-border hover:bg-muted'
            } text-foreground`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function BusinessPlanForm({ onSubmit, isSubmitting = false }: BusinessPlanFormProps) {
  const {
    formState,
    currentQuestion,
    isLoading,
    isFirstQuestion,
    isLastQuestion,
    progressPercentage,
    nextStep,
    prevStep,
    updateAnswer,
    refreshSuggestions,
    isCurrentQuestionValid,
    areSuggestionsLoaded,
  } = useBusinessPlanForm(businessPlanQuestions);

  // Load suggestions when the current question changes, but only if they haven't been loaded yet
  useEffect(() => {
    if (currentQuestion && !currentQuestion.hideSuggestions) {
      // For question 3 (targetMarket), only fetch suggestions if we have answers for questions 1 and 2
      if (currentQuestion.id === 'targetMarket') {
        const businessIdea = formState.answers.businessIdea;
        const location = formState.answers.location;
        
        // Only fetch suggestions if we have both previous answers and suggestions haven't been loaded yet
        if (businessIdea && location && !areSuggestionsLoaded(currentQuestion.id)) {
          console.log('Initial fetch of suggestions for targetMarket question');
          console.log('Business idea:', businessIdea);
          console.log('Location:', location);
          refreshSuggestions(false); // false means don't force refresh
        } else if (!businessIdea || !location) {
          console.log('Missing previous answers for targetMarket question');
          console.log('Business idea:', businessIdea);
          console.log('Location:', location);
        } else {
          console.log('Suggestions already loaded for targetMarket question');
        }
      } else if (!areSuggestionsLoaded(currentQuestion.id)) {
        // For other questions, fetch suggestions if they haven't been loaded yet
        refreshSuggestions(false);
      }
    }
  }, [currentQuestion, formState.answers, refreshSuggestions, areSuggestionsLoaded]);

  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit(formState.answers);
    } else {
      nextStep();
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    if (currentQuestion) {
      updateAnswer(currentQuestion.id, suggestion);
    }
  };

  // Handle manual refresh of suggestions
  const handleRefreshSuggestions = () => {
    if (currentQuestion) {
      refreshSuggestions(true); // true means force refresh
    }
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const currentSuggestions = formState.suggestions[currentQuestion.id] || [];
  const currentAnswer = formState.answers[currentQuestion.id] || '';

  // Special case for question 3 (targetMarket) - only show suggestions if we have answers for questions 1 and 2
  const shouldShowSuggestions = 
    !currentQuestion.hideSuggestions && 
    currentQuestion.inputType !== 'clickable-options' &&
    !(currentQuestion.id === 'targetMarket' && 
      (!formState.answers.businessIdea || !formState.answers.location));

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Create Your Business Plan</h2>
      
      <ProgressIndicator
        currentStep={formState.currentStep}
        totalSteps={businessPlanQuestions.length}
        percentage={progressPercentage}
      />
      
      {/* For questions with clickable options */}
      {currentQuestion.inputType === 'clickable-options' ? (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-foreground">{currentQuestion.text}</h3>
          <p className="text-sm text-foreground/70 mb-2">{currentQuestion.placeholder}</p>
          <ClickableOptions 
            options={currentQuestion.options || []} 
            value={currentAnswer}
            onChange={(value) => updateAnswer(currentQuestion.id, value)}
            multiSelect={currentQuestion.multiSelect}
          />
        </div>
      ) : (
        // For regular questions
        <QuestionCard
          question={currentQuestion.text}
          inputType={currentQuestion.inputType}
          placeholder={currentQuestion.placeholder}
          options={currentQuestion.options}
          value={currentAnswer}
          onChange={(value) => updateAnswer(currentQuestion.id, value)}
          onSuggestionSelect={handleSuggestionSelect}
          onRefreshSuggestions={refreshSuggestions}
          hideSuggestions={true} // We're handling suggestions separately below
        />
      )}
      
      {/* Only show suggestions if this question should have them */}
      {shouldShowSuggestions && (
        <SuggestionsList
          suggestions={currentSuggestions}
          onSelect={handleSuggestionSelect}
          onRefresh={handleRefreshSuggestions}
          isLoading={isLoading}
          currentValue={currentAnswer}
        />
      )}
      
      {/* Special message for question 3 when missing previous answers */}
      {currentQuestion.id === 'targetMarket' && 
       (!formState.answers.businessIdea || !formState.answers.location) && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Please provide your business idea and location to get personalized target market suggestions.
          </p>
        </div>
      )}
      
      <FormNavigation
        onNext={handleNext}
        onPrev={prevStep}
        isFirstStep={isFirstQuestion}
        isLastStep={isLastQuestion}
        isNextDisabled={!isCurrentQuestionValid()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
} 