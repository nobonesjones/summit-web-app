'use client';

import { useState, useCallback } from 'react';

export interface Question {
  id: string;
  text: string;
  inputType: 'text' | 'textarea' | 'select' | 'multiselect' | 'clickable-options';
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  hideSuggestions?: boolean;
  multiSelect?: boolean;
}

export interface FormState {
  currentStep: number;
  answers: Record<string, string>;
  suggestions: Record<string, { id: string; text: string }[]>;
  suggestionsLoaded: Record<string, boolean>; // Track if suggestions have been loaded for each question
}

export function useBusinessPlanForm(questions: Question[]) {
  const [formState, setFormState] = useState<FormState>({
    currentStep: 0,
    answers: {},
    suggestions: {},
    suggestionsLoaded: {},
  });

  const [isLoading, setIsLoading] = useState(false);

  // Move to the next question
  const nextStep = useCallback(() => {
    if (formState.currentStep < questions.length - 1) {
      setFormState((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    }
  }, [formState.currentStep, questions.length]);

  // Move to the previous question
  const prevStep = useCallback(() => {
    if (formState.currentStep > 0) {
      setFormState((prev) => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
    }
  }, [formState.currentStep]);

  // Update an answer
  const updateAnswer = useCallback((questionId: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      },
    }));
  }, []);

  // Set suggestions for a question
  const setSuggestions = useCallback((questionId: string, suggestions: { id: string; text: string }[]) => {
    setFormState((prev) => ({
      ...prev,
      suggestions: {
        ...prev.suggestions,
        [questionId]: suggestions,
      },
      suggestionsLoaded: {
        ...prev.suggestionsLoaded,
        [questionId]: true,
      },
    }));
  }, []);

  // Check if suggestions are already loaded for the current question
  const areSuggestionsLoaded = useCallback((questionId: string) => {
    return formState.suggestionsLoaded[questionId] || false;
  }, [formState.suggestionsLoaded]);

  // Get suggestions for the current question
  const refreshSuggestions = useCallback(async (forceRefresh = false) => {
    const currentQuestion = questions[formState.currentStep];
    if (!currentQuestion || currentQuestion.hideSuggestions) return;

    // If suggestions are already loaded and we're not forcing a refresh, don't fetch again
    if (areSuggestionsLoaded(currentQuestion.id) && !forceRefresh) {
      return;
    }

    setIsLoading(true);
    
    try {
      // For question 3 (targetMarket) and beyond, use AI-generated suggestions based on previous answers
      if (currentQuestion.id === 'targetMarket' || formState.currentStep > 2) {
        // Get previous answers to use for context
        const previousAnswers = {
          businessIdea: formState.answers.businessIdea || '',
          location: formState.answers.location || '',
        };

        console.log('Fetching suggestions for:', currentQuestion.id);
        console.log('Previous answers:', previousAnswers);

        // Call the API to get AI-generated suggestions
        const response = await fetch('/api/ai/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentQuestion,
            previousAnswers,
          }),
        });

        console.log('API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error:', errorText);
          throw new Error(`Failed to fetch suggestions: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('API response data:', data);
        
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(currentQuestion.id, data.suggestions);
        } else {
          console.error('Invalid suggestions format:', data);
        }
      } else {
        // For other questions, use dummy suggestions
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Generate some dummy suggestions
        const dummySuggestions = [
          { id: '1', text: 'Suggestion 1 for ' + currentQuestion.text },
          { id: '2', text: 'Suggestion 2 for ' + currentQuestion.text },
          { id: '3', text: 'Suggestion 3 for ' + currentQuestion.text },
        ];
        
        setSuggestions(currentQuestion.id, dummySuggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formState.currentStep, formState.answers, questions, setSuggestions, areSuggestionsLoaded]);

  // Check if the current question is valid
  const isCurrentQuestionValid = useCallback(() => {
    const currentQuestion = questions[formState.currentStep];
    if (!currentQuestion) return true;
    
    if (currentQuestion.required) {
      const answer = formState.answers[currentQuestion.id];
      return !!answer && answer.trim() !== '';
    }
    
    return true;
  }, [formState.answers, formState.currentStep, questions]);

  // Get the current question
  const currentQuestion = questions[formState.currentStep];

  // Check if we're on the first question
  const isFirstQuestion = formState.currentStep === 0;
  
  // Check if we're on the last question
  const isLastQuestion = formState.currentStep === questions.length - 1;

  // Get the progress percentage
  const progressPercentage = Math.round(((formState.currentStep + 1) / questions.length) * 100);

  return {
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
  };
} 