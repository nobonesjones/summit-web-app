# AI Configuration

This directory contains configuration files for AI integrations in the Summit platform.

## Directory Structure

```
config/ai/
└── prompts.ts           # System prompts and templates for AI services
```

## Prompts Configuration

The `prompts.ts` file contains system prompts and templates for AI services, including:

- `systemPrompts`: System prompts for different AI tasks
- `promptTemplates`: Prompt templates for different question types
- `researchQueryTemplates`: Templates for research queries

### System Prompts

System prompts define the role and behavior of the AI assistant for different tasks:

- `suggestions`: Prompt for generating suggestions for form questions
- `businessPlan`: Prompt for generating a business plan
- `research`: Prompt for research queries

### Prompt Templates

Prompt templates are used to generate specific prompts for different question types in forms:

- `businessIdea`: Template for generating business idea suggestions
- `businessLocation`: Template for generating business location suggestions
- `targetMarket`: Template for generating target market suggestions
- And more...

Each template includes placeholders for variables that will be replaced with actual values when the prompt is generated.

### Research Query Templates

Research query templates are used to generate specific queries for research tasks:

- `marketConditions`: Template for researching market conditions
- `competitors`: Template for researching competitors
- `industryTrends`: Template for researching industry trends
- And more...

## Usage

The prompts and templates in this directory are used by the AI integration utilities in the `lib/ai` directory. The utilities process the templates with actual values and send the resulting prompts to the AI services.

## Guidelines for Writing Prompts

- Be specific about the desired output format
- Provide clear instructions on the task
- Include examples when helpful
- Keep prompts concise but comprehensive
- Use consistent formatting across similar prompts
- Test prompts with different inputs to ensure they produce the desired results 