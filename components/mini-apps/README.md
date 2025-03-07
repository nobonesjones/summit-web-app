# Mini-Apps Components

This directory contains the React components used by the mini-apps in the Summit platform.

## Directory Structure

```
components/mini-apps/
├── shared/              # Shared components used across mini-apps
│   ├── form/            # Form components
│   │   ├── QuestionCard.tsx       # Card component for displaying form questions
│   │   └── FormProgress.tsx       # Progress indicator for multi-step forms
│   ├── results/         # Result display components
│   │   ├── PlanDisplay.tsx        # Component for displaying generated plans
│   │   └── ResultsHeader.tsx      # Header for results pages
│   ├── suggestions/     # Suggestion components
│   │   ├── SuggestionProvider.tsx # Context provider for suggestions
│   │   └── SuggestionList.tsx     # Component for displaying suggestions
│   ├── layout/          # Layout components
│   │   ├── MiniAppHeader.tsx      # Header for mini-app pages
│   │   └── MiniAppFooter.tsx      # Footer for mini-app pages
│   └── ui/              # UI components
│       ├── Button.tsx             # Button component
│       └── Card.tsx               # Card component
├── business-plan/       # Components specific to the Business Plan Generator
│   ├── BusinessPlanForm.tsx       # Main form component
│   ├── BusinessPlanResults.tsx    # Results component
│   └── BusinessPlanStepper.tsx    # Stepper component
├── marketing-strategy/  # Components specific to the Marketing Strategy Builder
├── product-roadmap/     # Components specific to the Product Roadmap Planner
└── pitch-deck/          # Components specific to the Pitch Deck Creator
```

## Shared Components

The `shared` directory contains components that are used across multiple mini-apps. These components are designed to be reusable and configurable.

### Form Components

- `QuestionCard.tsx`: A card component for displaying form questions with various input types (text, textarea, select, etc.)
- `FormProgress.tsx`: A progress indicator for multi-step forms

### Results Components

- `PlanDisplay.tsx`: A component for displaying generated plans with sections that can be expanded/collapsed
- `ResultsHeader.tsx`: A header component for results pages with actions like download, edit, etc.

### Suggestions Components

- `SuggestionProvider.tsx`: A context provider for managing suggestions from AI
- `SuggestionList.tsx`: A component for displaying suggestions with actions to select/refresh

## Mini-App Specific Components

Each mini-app has its own directory containing components specific to that mini-app. These components are built using the shared components and are tailored to the specific needs of the mini-app.

## Component Guidelines

- Use TypeScript for all components
- Define prop types using interfaces
- Use functional components with hooks
- Follow the established design patterns and styling conventions
- Keep components focused on a single responsibility
- Use composition over inheritance
- Document complex components with JSDoc comments 