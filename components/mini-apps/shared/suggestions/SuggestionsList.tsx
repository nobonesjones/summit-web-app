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
    <div className="mt-6 bg-muted/30 p-4 rounded-md border border-border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-foreground/80">Personalized ideas for you:</h4>
        <button
          type="button"
          onClick={onRefresh}
          className={`text-sm text-purple-600 hover:text-purple-800 flex items-center ${isLoading ? 'opacity-50' : ''}`}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSelect(suggestion.text)}
              className="flex items-center w-full text-left px-3 py-2 bg-muted/50 text-foreground border border-border rounded-md hover:bg-muted text-sm"
            >
              <Plus className="h-4 w-4 mr-2 text-purple-500" />
              {suggestion.text}
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-3 text-xs text-foreground/60 italic">
        Click any suggestion to add it to your answer
      </div>
    </div>
  );
} 