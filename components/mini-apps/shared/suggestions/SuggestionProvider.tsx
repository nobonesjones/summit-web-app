import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Suggestion {
  id: string;
  text: string;
}

interface SuggestionContextType {
  suggestions: Suggestion[];
  loading: boolean;
  error: string | null;
  fetchSuggestions: (prompt: string, previousAnswers?: Record<string, string>) => Promise<void>;
}

const SuggestionContext = createContext<SuggestionContextType | undefined>(undefined);

interface SuggestionProviderProps {
  children: ReactNode;
}

export function SuggestionProvider({ children }: SuggestionProviderProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (prompt: string, previousAnswers?: Record<string, string>) => {
    setLoading(true);
    setError(null);
    
    try {
      // This is a placeholder for the actual API call
      // In a real implementation, this would call your OpenAI API endpoint
      
      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock response
      const mockSuggestions = [
        { id: '1', text: 'A mobile coffee subscription service that delivers freshly roasted beans weekly' },
        { id: '2', text: 'A specialty coffee delivery service with curated beans from around the world' },
        { id: '3', text: 'A coffee subscription with brewing equipment rentals for the perfect cup' },
      ];
      
      setSuggestions(mockSuggestions);
    } catch (err) {
      setError('Failed to fetch suggestions. Please try again.');
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    suggestions,
    loading,
    error,
    fetchSuggestions,
  };

  return (
    <SuggestionContext.Provider value={value}>
      {children}
    </SuggestionContext.Provider>
  );
}

export function useSuggestions() {
  const context = useContext(SuggestionContext);
  
  if (context === undefined) {
    throw new Error('useSuggestions must be used within a SuggestionProvider');
  }
  
  return context;
} 