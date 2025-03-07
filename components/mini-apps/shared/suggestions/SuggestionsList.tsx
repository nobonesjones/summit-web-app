import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';

interface Suggestion {
  id: string;
  text: string;
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
  onSelect: (suggestion: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
  currentValue: string;
}

export default function SuggestionsList({
  suggestions,
  onSelect,
  onRefresh,
  isLoading = false,
  currentValue,
}: SuggestionsListProps) {
  // Always show the suggestions section if loading or if we have suggestions
  const shouldShow = isLoading || suggestions.length > 0;
  
  if (!shouldShow) {
    return null;
  }

  // Handle selecting a suggestion - add it directly to the text box
  const handleSelect = (suggestion: string) => {
    // Combine current value with the selected suggestion
    let newValue = currentValue;
    
    // If there's already content, add a new line before adding the suggestion
    if (newValue && !newValue.endsWith('\n')) {
      newValue += '\n';
    }
    
    // Add the suggestion
    newValue += suggestion;
    
    // Apply the combined value
    onSelect(newValue);
  };

  return (
    <div className="mt-4 bg-muted/30 p-4 rounded-md border border-border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-foreground/80">
          {isLoading ? 'Generating ideas for you...' : 'Personalized ideas for you:'}
        </h4>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="text-sm text-purple-600 hover:text-purple-800 flex items-center disabled:opacity-50"
          title="Click to generate new suggestions"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Generating...' : 'Refresh Ideas'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="py-6 flex justify-center items-center">
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
            <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
            <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
          </div>
        </div>
      ) : (
        <div>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => handleSelect(suggestion.text)}
                className="block w-full text-left px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors flex items-center bg-background text-foreground"
              >
                <div className="mr-2 flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm">{suggestion.text}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-3 text-xs text-foreground/60 italic">
            Click any suggestion to add it to your answer
          </div>
        </div>
      )}
    </div>
  );
} 