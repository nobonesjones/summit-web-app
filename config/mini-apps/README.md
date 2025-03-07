# Mini-Apps Configuration

This directory contains configuration files for the mini-apps in the Summit platform.

## Directory Structure

```
config/mini-apps/
├── config.ts            # Main configuration file for mini-apps
└── [mini-app-id]/       # Configuration specific to each mini-app (future)
```

## Main Configuration

The `config.ts` file contains the main configuration for all mini-apps, including:

- `MiniAppConfig` interface: Defines the structure of a mini-app configuration
- Individual mini-app configurations (e.g., `businessPlanConfig`)
- `miniAppsConfig` array: Contains all mini-app configurations
- Utility functions for accessing mini-app configurations

### MiniAppConfig Interface

```typescript
export interface MiniAppConfig {
  id: string;            // Unique identifier for the mini-app
  title: string;         // Display title
  description: string;   // Short description
  icon: string;          // Path to the icon
  status: 'active' | 'coming-soon'; // Status of the mini-app
  path: string;          // URL path
  features: string[];    // List of features
  tags: string[];        // Tags for categorization
}
```

### Utility Functions

- `getMiniAppConfig(id: string)`: Get a mini-app configuration by ID
- `getActiveMiniApps()`: Get all active mini-apps
- `getComingSoonMiniApps()`: Get all coming soon mini-apps

## Mini-App Specific Configuration

In the future, each mini-app may have its own configuration directory with additional settings specific to that mini-app.

## Adding a New Mini-App

To add a new mini-app configuration:

1. Create a new configuration object in `config.ts` following the `MiniAppConfig` interface
2. Add the new configuration to the `miniAppsConfig` array
3. Create an icon for the mini-app in the `public/icons` directory

## Configuration Guidelines

- Use descriptive IDs that match the directory structure
- Keep descriptions concise and focused on the value proposition
- Include a comprehensive list of features
- Use relevant tags for categorization
- Ensure paths are consistent with the routing structure 