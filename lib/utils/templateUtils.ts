/**
 * Utility functions for handling template strings
 */

/**
 * Replaces template variables in a string with values from a data object
 * Template variables should be in the format {{variableName}}
 * 
 * @param template - The template string containing variables to replace
 * @param data - An object containing key-value pairs for replacement
 * @returns The template with all variables replaced with their values
 */
export function processTemplate(template: string, data: Record<string, any>): string {
  // Return the template as is if no data is provided
  if (!data || Object.keys(data).length === 0) {
    return template;
  }

  // Replace each variable in the template with its corresponding value
  let processedTemplate = template;
  
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    
    // Only replace if the value is a string or number
    if (value !== undefined && (typeof value === 'string' || typeof value === 'number')) {
      processedTemplate = processedTemplate.replace(regex, String(value));
    }
  });

  return processedTemplate;
}

/**
 * Formats previous answers into a string for inclusion in prompts
 * 
 * @param previousAnswers - An object containing previous question answers
 * @returns A formatted string of previous answers
 */
export function formatPreviousAnswers(previousAnswers: Record<string, any>): string {
  if (!previousAnswers || Object.keys(previousAnswers).length === 0) {
    return '';
  }

  // Format the previous answers into a readable string
  return Object.entries(previousAnswers)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      // Format the key to be more readable
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
      
      return `${formattedKey}: ${value}`;
    })
    .join('\n');
}

/**
 * Combines processing a template and formatting previous answers
 * 
 * @param template - The template string containing variables to replace
 * @param data - An object containing key-value pairs for replacement
 * @param previousAnswers - An object containing previous question answers
 * @returns The processed template with variables replaced and previous answers formatted
 */
export function processPromptTemplate(
  template: string, 
  data: Record<string, any>, 
  previousAnswers: Record<string, any> = {}
): string {
  // Format previous answers
  const formattedPreviousAnswers = formatPreviousAnswers(previousAnswers);
  
  // Add formatted previous answers to data
  const dataWithPreviousAnswers = {
    ...data,
    previousAnswers: formattedPreviousAnswers,
  };
  
  // Process the template with the combined data
  return processTemplate(template, dataWithPreviousAnswers);
} 