# Library Utilities

This directory contains utility functions and modules used throughout the Summit platform.

## Directory Structure

```
lib/
├── ai/                  # AI integration utilities
│   ├── openaiUtils.ts   # OpenAI API utilities
│   └── perplexityUtils.ts # Perplexity API utilities
├── form/                # Form handling utilities
│   └── formUtils.ts     # Form validation and question management
├── utils/               # General utilities
│   ├── fileUtils.ts     # File handling utilities
│   └── templateUtils.ts # Template processing utilities
└── constants.ts         # Application constants
```

## AI Integration Utilities

The `ai` directory contains utilities for integrating with AI services:

- `openaiUtils.ts`: Functions for interacting with the OpenAI API, including generating suggestions and business plans
- `perplexityUtils.ts`: Functions for interacting with the Perplexity API, including performing web searches and research

## Form Handling Utilities

The `form` directory contains utilities for handling forms:

- `formUtils.ts`: Functions for form validation, question management, and data processing

## General Utilities

The `utils` directory contains general-purpose utilities:

- `fileUtils.ts`: Functions for file operations, including generating filenames and downloading files
- `templateUtils.ts`: Functions for processing template strings with variable replacements

## Constants

The `constants.ts` file contains application-wide constants, including:

- Application metadata
- API endpoints and keys
- Default models
- Form constants
- Business plan constants
- File export formats
- Navigation
- Footer links

## Usage Guidelines

- Keep utility functions focused on a single responsibility
- Use TypeScript for all utilities
- Document functions with JSDoc comments
- Use meaningful parameter and return types
- Handle errors gracefully
- Write unit tests for complex utilities
- Avoid side effects in pure utility functions 