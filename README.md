# Summit Mini-Apps Platform

Summit is a platform of AI-powered mini-apps designed to help entrepreneurs and business leaders build and grow their businesses.

## Features

- **Mini-Apps Ecosystem**: A collection of focused, AI-powered tools for specific business tasks
- **AI Integration**: Powered by OpenAI and Perplexity for intelligent suggestions and content generation
- **Modern UI**: Built with Next.js and Tailwind CSS for a responsive and beautiful user experience
- **Modular Architecture**: Easily extensible with new mini-apps and features

## Mini-Apps

- **Business Plan Generator**: Create a comprehensive business plan for your startup or small business idea
- **Marketing Strategy Builder** (Coming Soon): Develop a targeted marketing strategy for your product or service
- **Product Roadmap Planner** (Coming Soon): Plan your product development timeline with features and milestones
- **Pitch Deck Creator** (Coming Soon): Create a compelling pitch deck for investors and stakeholders

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Convex (serverless backend)
- **AI**: OpenAI API, Perplexity API
- **Deployment**: Vercel

## Project Structure

```
summit/
├── app/                 # Next.js app directory
│   ├── mini-apps/       # Mini-apps pages
│   └── api/             # API routes
├── components/          # React components
│   ├── mini-apps/       # Mini-apps components
│   └── ui/              # UI components
├── config/              # Configuration files
│   ├── mini-apps/       # Mini-apps configuration
│   └── ai/              # AI configuration
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema
│   └── api.ts           # API endpoints
├── lib/                 # Utility functions
│   ├── ai/              # AI integration utilities
│   ├── form/            # Form handling utilities
│   └── utils/           # General utilities
└── public/              # Static assets
    └── icons/           # SVG icons
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Convex account
- OpenAI API key
- Perplexity API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/summit.git
   cd summit
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your API keys.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Adding a New Mini-App

1. Create a new directory in `app/mini-apps/` for the mini-app
2. Create a new directory in `components/mini-apps/` for the mini-app components
3. Add the mini-app configuration to `config/mini-apps/config.ts`
4. Update the mini-apps index page to include the new mini-app

### Folder Structure Guidelines

- Keep related files together
- Use descriptive names for files and directories
- Follow the established patterns for each type of file
- Document complex components and utilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Convex](https://www.convex.dev/)
- [OpenAI](https://openai.com/)
- [Perplexity](https://www.perplexity.ai/)
