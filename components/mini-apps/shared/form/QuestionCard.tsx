import React from 'react';

interface Suggestion {
  id: string;
  text: string;
}

interface QuestionCardProps {
  question: string;
  inputType: 'text' | 'textarea' | 'select' | 'multiselect';
  placeholder?: string;
  options?: { value: string; label: string }[];
  suggestions?: Suggestion[];
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect: (suggestion: string) => void;
  onRefreshSuggestions: () => void;
  hideSuggestions?: boolean;
}

export default function QuestionCard({
  question,
  inputType,
  placeholder,
  options,
  suggestions,
  value,
  onChange,
  onSuggestionSelect,
  onRefreshSuggestions,
  hideSuggestions = false,
}: QuestionCardProps) {
  return (
    <div className="bg-background rounded-lg shadow-md p-6 border border-border">
      <h3 className="text-xl font-semibold mb-4 text-foreground">{question}</h3>
      
      {inputType === 'text' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      )}
      
      {inputType === 'textarea' && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      )}
      
      {inputType === 'select' && options && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      
      {!hideSuggestions && suggestions && suggestions.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-foreground/80">Personalized ideas for you:</h4>
            <button
              type="button"
              onClick={onRefreshSuggestions}
              className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
          
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => onSuggestionSelect(suggestion.text)}
                className="block w-full text-left px-3 py-2 bg-muted/50 text-foreground border border-border rounded-md hover:bg-muted text-sm"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 