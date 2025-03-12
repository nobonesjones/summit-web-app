'use client';

import { useState, useCallback, useEffect } from 'react';

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
  // Ensure we have questions before initializing
  const [formState, setFormState] = useState<FormState>(() => {
    console.log('useBusinessPlanForm: Initializing with', questions.length, 'questions');
    return {
      currentStep: 0,
      answers: {},
      suggestions: {},
      suggestionsLoaded: {},
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize the form when the component mounts
  useEffect(() => {
    console.log('useBusinessPlanForm: Initializing with', questions.length, 'questions');
    if (!initialized && questions.length > 0) {
      console.log('useBusinessPlanForm: First question -', questions[0]?.id);
      
      // Ensure we have a valid initial state
      setFormState(current => {
        // Only update if needed
        if (current.currentStep !== 0 || Object.keys(current.answers).length > 0) {
          return current;
        }
        
        return {
          currentStep: 0,
          answers: {},
          suggestions: {},
          suggestionsLoaded: {},
        };
      });
      
      setInitialized(true);
    }
  }, [questions, initialized]);

  // Move to the next question
  const nextStep = useCallback(() => {
    if (formState.currentStep < questions.length - 1) {
      console.log('useBusinessPlanForm: Moving to next step -', formState.currentStep + 1);
      setFormState((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    }
  }, [formState.currentStep, questions.length]);

  // Move to the previous question
  const prevStep = useCallback(() => {
    if (formState.currentStep > 0) {
      console.log('useBusinessPlanForm: Moving to previous step -', formState.currentStep - 1);
      setFormState((prev) => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
    }
  }, [formState.currentStep]);

  // Update an answer
  const updateAnswer = useCallback((questionId: string, value: string) => {
    console.log('useBusinessPlanForm: Updating answer for', questionId, '-', value);
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
    console.log('useBusinessPlanForm: Setting suggestions for', questionId, '-', suggestions.length, 'suggestions');
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
    // Safety check - make sure we have questions
    if (!questions || questions.length === 0) {
      console.error('useBusinessPlanForm: No questions available for suggestions');
      return;
    }
    
    // Safety check - make sure currentStep is valid
    if (formState.currentStep < 0 || formState.currentStep >= questions.length) {
      console.error('useBusinessPlanForm: Invalid currentStep:', formState.currentStep);
      return;
    }
    
    const currentQuestion = questions[formState.currentStep];
    if (!currentQuestion || currentQuestion.hideSuggestions) return;

    // If suggestions are already loaded and we're not forcing a refresh, don't fetch again
    if (areSuggestionsLoaded(currentQuestion.id) && !forceRefresh) {
      console.log(`useBusinessPlanForm: Suggestions already loaded for ${currentQuestion.id}, skipping fetch`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Get all answers to use for context
      const allAnswers = { ...formState.answers };
      
      // Create a more focused set of previous answers for specific context
      const previousAnswers = {
        businessIdea: allAnswers.businessIdea || '',
        location: allAnswers.location || '',
        targetMarket: allAnswers.targetMarket || '',
        businessStage: allAnswers.businessStage || '',
        teamSize: allAnswers.teamSize || '',
      };

      console.log('useBusinessPlanForm: Fetching suggestions for:', currentQuestion.id);
      console.log('useBusinessPlanForm: Previous answers for context:', JSON.stringify(previousAnswers));

      // Generate personalized mock suggestions based on the question and previous answers
      let mockSuggestions = [];
      
      // Business idea suggestions
      if (currentQuestion.id === 'businessIdea') {
        mockSuggestions = [
          { id: 'idea-1', text: 'A subscription-based meal prep service for busy professionals' },
          { id: 'idea-2', text: 'An on-demand home cleaning service with eco-friendly products' },
          { id: 'idea-3', text: 'A mobile app that connects local farmers with consumers for fresh produce' },
          { id: 'idea-4', text: 'A co-working space specifically designed for creative professionals' },
        ];
      } 
      // Location suggestions
      else if (currentQuestion.id === 'location') {
        mockSuggestions = [
          { id: 'loc-1', text: 'Dubai, UAE with potential for expansion to Abu Dhabi' },
          { id: 'loc-2', text: 'Dubai Internet City for tech-focused businesses' },
          { id: 'loc-3', text: 'Dubai with an online presence serving the entire UAE' },
          { id: 'loc-4', text: 'DIFC (Dubai International Financial Centre) for financial services' },
        ];
      } 
      // Target market suggestions
      else if (currentQuestion.id === 'targetMarket') {
        const businessIdea = previousAnswers.businessIdea.toLowerCase();
        const location = previousAnswers.location;
        
        if (businessIdea.includes('food') || businessIdea.includes('restaurant') || businessIdea.includes('meal')) {
          mockSuggestions = [
            { id: 'market-1', text: 'Young professionals aged 25-40 with disposable income who value convenience and quality food' },
            { id: 'market-2', text: 'Health-conscious individuals looking for nutritious meal options' },
            { id: 'market-3', text: 'Busy families who want quality dining experiences without cooking' },
          ];
        } else if (businessIdea.includes('tech') || businessIdea.includes('app') || businessIdea.includes('software')) {
          mockSuggestions = [
            { id: 'market-1', text: 'Tech-savvy professionals aged 22-45 who are early adopters of new technologies' },
            { id: 'market-2', text: 'Small to medium businesses looking for digital solutions' },
            { id: 'market-3', text: 'Remote workers and digital nomads seeking productivity tools' },
          ];
        } else {
          mockSuggestions = [
            { id: 'market-1', text: 'Middle to upper-income residents in ' + (location || 'your area') + ' aged 25-45' },
            { id: 'market-2', text: 'Young professionals with disposable income and busy lifestyles' },
            { id: 'market-3', text: 'Small business owners and entrepreneurs looking for solutions' },
          ];
        }
      }
      // Solution suggestions
      else if (currentQuestion.id === 'solution') {
        const businessIdea = previousAnswers.businessIdea.toLowerCase();
        
        if (businessIdea.includes('food') || businessIdea.includes('restaurant') || businessIdea.includes('meal')) {
          mockSuggestions = [
            { id: 'sol-1', text: 'Providing convenient, high-quality meals that save time without sacrificing nutrition or taste' },
            { id: 'sol-2', text: 'Solving the "what\'s for dinner" problem with curated meal options delivered to your door' },
            { id: 'sol-3', text: 'Eliminating food waste through portion-controlled, chef-designed meals' },
          ];
        } else {
          mockSuggestions = [
            { id: 'sol-1', text: 'Saving customers time and reducing stress by providing a convenient, reliable service' },
            { id: 'sol-2', text: 'Addressing the lack of quality options in the market with our premium offering' },
            { id: 'sol-3', text: 'Solving the problem of accessibility and convenience in this industry' },
          ];
        }
      }
      // Revenue model suggestions
      else if (currentQuestion.id === 'revenueModel') {
        mockSuggestions = [
          { id: 'rev-1', text: 'Subscription-based model with tiered pricing for different service levels' },
          { id: 'rev-2', text: 'Pay-per-use model with premium features available as add-ons' },
          { id: 'rev-3', text: 'Freemium model with basic features free and advanced features paid' },
        ];
      }
      // Marketing strategy suggestions
      else if (currentQuestion.id === 'marketingStrategy') {
        const location = previousAnswers.location || 'Dubai';
        mockSuggestions = [
          { id: 'mkt-1', text: 'Social media marketing targeting specific demographics on Instagram and Facebook' },
          { id: 'mkt-2', text: 'Content marketing through blog posts and videos showcasing the benefits of our solution' },
          { id: 'mkt-3', text: 'Local partnerships with complementary businesses in ' + location },
        ];
      }
      // Competitive advantage suggestions
      else if (currentQuestion.id === 'competitiveAdvantage') {
        mockSuggestions = [
          { id: 'adv-1', text: 'Superior customer service with personalized attention and quick response times' },
          { id: 'adv-2', text: 'Innovative technology that streamlines processes and enhances user experience' },
          { id: 'adv-3', text: 'Strategic partnerships that provide exclusive access to resources or markets' },
        ];
      }
      // Resources needed suggestions
      else if (currentQuestion.id === 'resourcesNeeded') {
        mockSuggestions = [
          { id: 'res-1', text: 'Physical retail/office space in a high-traffic or accessible location' },
          { id: 'res-2', text: 'Technology infrastructure including website, app, and backend systems' },
          { id: 'res-3', text: 'Skilled team members including operations, marketing, and customer service' },
        ];
      }
      // Default suggestions for other questions
      else {
        mockSuggestions = [
          { id: `${currentQuestion.id}-1`, text: `Suggestion 1 for ${currentQuestion.id}` },
          { id: `${currentQuestion.id}-2`, text: `Suggestion 2 for ${currentQuestion.id}` },
          { id: `${currentQuestion.id}-3`, text: `Suggestion 3 for ${currentQuestion.id}` },
        ];
      }
      
      // Call the API to get AI-generated suggestions
      console.log('useBusinessPlanForm: Sending request to /api/ai/suggestions');
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentQuestion,
          previousAnswers,
          allAnswers,
          userId: typeof window !== 'undefined' ? localStorage.getItem('userId') : null, // Include user ID if available
        }),
      });

      console.log('useBusinessPlanForm: API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('useBusinessPlanForm: API error:', errorText);
        throw new Error(`Failed to fetch suggestions: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('useBusinessPlanForm: API response data received');
      
      if (data.suggestions && Array.isArray(data.suggestions)) {
        console.log('useBusinessPlanForm: Setting suggestions:', data.suggestions.length, 'items');
        setSuggestions(currentQuestion.id, data.suggestions);
      } else {
        console.error('useBusinessPlanForm: Invalid suggestions format:', data);
        if (data.error) {
          console.error('useBusinessPlanForm: API returned error:', data.error);
        }
        
        // If API fails, use the mock suggestions as fallback
        console.log('useBusinessPlanForm: Using mock suggestions as fallback');
        setSuggestions(currentQuestion.id, mockSuggestions);
      }
    } catch (error) {
      console.error('useBusinessPlanForm: Error fetching suggestions:', error);
      
      // Generate generic suggestions as a fallback
      console.log('useBusinessPlanForm: Using generic fallback suggestions due to error');
      const genericSuggestions = [
        { id: 'generic-1', text: `Consider ${currentQuestion.id === 'businessIdea' ? 'a business that solves a common problem in your area' : 'options that align with your business goals'}` },
        { id: 'generic-2', text: `Think about ${currentQuestion.id === 'location' ? 'where your target customers are located' : 'what would best support your business idea'}` },
        { id: 'generic-3', text: `Explore ${currentQuestion.id === 'targetMarket' ? 'different customer segments who might need your product/service' : 'various possibilities before making a decision'}` },
      ];
      
      setSuggestions(currentQuestion.id, genericSuggestions);
      
      // Mark suggestions as loaded even if there was an error
      setFormState(prev => ({
        ...prev,
        suggestionsLoaded: {
          ...prev.suggestionsLoaded,
          [currentQuestion.id]: true
        }
      }));
    } finally {
      setIsLoading(false);
    }
  }, [formState.currentStep, formState.answers, questions, setSuggestions, areSuggestionsLoaded]);

  // Check if the current question is valid
  const isCurrentQuestionValid = useCallback(() => {
    // Safety check - make sure we have questions
    if (!questions || questions.length === 0) {
      console.error('useBusinessPlanForm: No questions available for validation');
      return true;
    }
    
    // Safety check - make sure currentStep is valid
    if (formState.currentStep < 0 || formState.currentStep >= questions.length) {
      console.error('useBusinessPlanForm: Invalid currentStep for validation:', formState.currentStep);
      return true;
    }
    
    const currentQuestion = questions[formState.currentStep];
    if (!currentQuestion) return true;
    
    if (currentQuestion.required) {
      const answer = formState.answers[currentQuestion.id];
      return !!answer && answer.trim() !== '';
    }
    
    return true;
  }, [formState.answers, formState.currentStep, questions]);

  // Get the current question with safety checks
  let currentQuestion = null;
  if (questions && questions.length > 0 && formState.currentStep >= 0 && formState.currentStep < questions.length) {
    currentQuestion = questions[formState.currentStep];
  }

  // Check if we're on the first question
  const isFirstQuestion = formState.currentStep === 0;
  
  // Check if we're on the last question
  const isLastQuestion = questions.length > 0 && formState.currentStep === questions.length - 1;

  // Get the progress percentage
  const progressPercentage = questions.length > 0 
    ? Math.round(((formState.currentStep + 1) / questions.length) * 100)
    : 0;

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