# Summit Mini-Apps

This directory contains the mini-apps for the Summit platform. Each mini-app is a self-contained application that provides a specific functionality to users.

## Structure

The mini-apps are organized as follows:

```
app/mini-apps/
├── layout.tsx           # Shared layout for all mini-apps
├── page.tsx             # Index page listing all mini-apps
├── business-plan/       # Business Plan Generator mini-app
│   ├── page.tsx         # Main page for the Business Plan Generator
│   └── [...slug]/       # Dynamic routes for multi-step forms
├── marketing-strategy/  # Marketing Strategy Builder mini-app (coming soon)
├── product-roadmap/     # Product Roadmap Planner mini-app (coming soon)
└── pitch-deck/          # Pitch Deck Creator mini-app (coming soon)
```

## Components

The components for each mini-app are located in the `components/mini-apps` directory:

```
components/mini-apps/
├── shared/              # Shared components used across mini-apps
│   ├── form/            # Form components (QuestionCard, etc.)
│   ├── results/         # Result display components (PlanDisplay, etc.)
│   └── suggestions/     # Suggestion components (SuggestionProvider, etc.)
├── business-plan/       # Components specific to the Business Plan Generator
├── marketing-strategy/  # Components specific to the Marketing Strategy Builder
├── product-roadmap/     # Components specific to the Product Roadmap Planner
└── pitch-deck/          # Components specific to the Pitch Deck Creator
```

## Configuration

The configuration for mini-apps is located in the `config/mini-apps` directory:

```
config/mini-apps/
├── config.ts            # Main configuration file for mini-apps
└── [mini-app-id]/       # Configuration specific to each mini-app
```

## Utilities

Utility functions for mini-apps are located in the `lib` directory:

```
lib/
├── ai/                  # AI integration utilities
│   ├── openaiUtils.ts   # OpenAI API utilities
│   └── perplexityUtils.ts # Perplexity API utilities
├── form/                # Form handling utilities
│   └── formUtils.ts     # Form validation and question management
└── utils/               # General utilities
    ├── fileUtils.ts     # File handling utilities
    └── templateUtils.ts # Template processing utilities
```

## Adding a New Mini-App

To add a new mini-app:

1. Create a new directory in `app/mini-apps/` for the mini-app
2. Create a new directory in `components/mini-apps/` for the mini-app components
3. Add the mini-app configuration to `config/mini-apps/config.ts`
4. Update the mini-apps index page to include the new mini-app

## Development Guidelines

- Each mini-app should be self-contained and not depend on other mini-apps
- Use shared components from `components/mini-apps/shared` when possible
- Follow the established patterns for form handling, AI integration, and result display
- Ensure that each mini-app has a consistent user experience with the rest of the platform 