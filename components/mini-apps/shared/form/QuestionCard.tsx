import React from 'react';

interface Suggestion {
  id: string;
  text: string;
}

interface QuestionCardProps {
  question: string;
  inputType: 'text' | 'textarea' | 'select' | 'multiselect' | 'clickable-options';
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
  // Log when the component renders
  React.useEffect(() => {
    console.log('QuestionCard: Rendering for question:', question);
  }, [question]);

  // Handle input changes safely
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    console.log('QuestionCard: Input changed:', e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="bg-background rounded-lg shadow-md p-6 border border-border">
      <h3 className="text-xl font-semibold mb-4 text-foreground">{question}</h3>
      
      {inputType === 'text' && (
        <input
          type="text"
          value={value || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      )}
      
      {inputType === 'textarea' && (
        <textarea
          value={value || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      )}
      
      {inputType === 'select' && options && (
        <select
          value={value || ''}
          onChange={handleInputChange}
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
      
      {inputType === 'multiselect' && options && (
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value ? value.split(',').includes(option.value) : false}
                onChange={(e) => {
                  const currentValues = value ? value.split(',') : [];
                  let newValues;
                  
                  if (e.target.checked) {
                    newValues = [...currentValues, option.value];
                  } else {
                    newValues = currentValues.filter(val => val !== option.value);
                  }
                  
                  onChange(newValues.join(','));
                }}
                className="rounded border-input"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}
      
      {!hideSuggestions && suggestions && suggestions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Suggestions:</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => onSuggestionSelect(suggestion.text)}
                className="block w-full text-left px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onRefreshSuggestions}
            className="mt-2 text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Refresh suggestions
          </button>
        </div>
      )}
    </div>
  );
} 