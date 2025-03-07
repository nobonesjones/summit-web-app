
## 1. Project Overview

Summit Mini-Apps Platform is a suite of AI-powered tools designed to help business owners quickly generate valuable business planning resources. Each mini-app addresses a specific business need and serves as a lead magnet for Summit's startup mentoring platform. The platform will feature multiple mini-apps, save user outputs, and streamline the process of creating business plans and growth strategies.

## 2. Core Objectives

1. Create multiple high-utility mini-apps that solve specific business needs
2. Capture qualified leads for Summit through app usage
3. Provide immediate, actionable value to business owners
4. Build a platform that can easily scale to add more mini-apps
5. Convert mini-app users to Summit's main mentoring services
6. Implement a lead generation model where users must create an account to access their generated plans

## 3. Target Audience

- Early-stage entrepreneurs
- Small to medium business owners
- Startup founders seeking mentorship
- Business owners looking to improve specific aspects of their operations

## 4. Planned Mini-Apps Suite

1. **15-Minute Business Plan Generator** - Quick comprehensive business plan (INITIAL FOCUS)
2. **30-Day Growth Plan** - Actionable growth strategy for the next month (FUTURE DEVELOPMENT)
3. **One-Page Plan Generator** - Distilled business strategy on a single page (FUTURE DEVELOPMENT)
4. **30-Day Sprint Planner** - Framework to achieve a specific business goal (FUTURE DEVELOPMENT)

Note: The initial development will focus solely on the 15-Minute Business Plan Generator. Additional mini-apps will be developed in later phases.

## 5. User Flow

1. User lands on home page showing available mini-apps
2. User selects desired mini-app
3. User completes 5-10 questions with smart, dynamic forms
   - Questions adapt based on previous answers
   - Multiple choice options where possible
   - Free text inputs only when necessary
   - AI-suggested options to guide users
4. Before receiving output, user must sign up/sign in
5. User receives high-quality, AI-generated output
6. All outputs are saved to user's dashboard for future reference and access

## 6. Technical Stack

Note: This project adapts an existing Next.js 15 Starter Kit, refactoring its folder structure to accommodate our specific requirements for the Summit Mini-Apps Platform.

### Frontend
- **Next.js 15 (App Router)** - Latest version for optimal routing and SEO
- **TypeScript** - For type-safe code and maintainability
- **Tailwind CSS** - For responsive, utility-first styling
- **Shadcn/ui** - For beautiful, accessible UI components
- **Clerk** - For authentication and user management (must remove clerk and replace with supabase auth) 
- **supabase auth** - we have no decided to swap from Clerk to supabase 

### Backend & Data
- **Convex DB** - Real-time database with built-in file storage
- **Convex Functions** - Serverless functions for backend logic
- **Perplexity API** - For fetching up-to-date information

### AI Integration
- **OpenAI API** - For generating plans and dynamic question flows
- **LangChain** - For structuring AI workflows and prompt chaining

### Additional Services
- **Polar.sh** - For potential future monetization of premium mini-apps

## 7. Project Structure

```
├── app/
│   ├── (auth)/         # Authentication routes
│   ├── (marketing)/    # Marketing pages
│   ├── api/            # API routes
│   │   ├── ai/         # AI integration endpoints
│   │   └── perplexity/ # Perplexity search integration
│   ├── dashboard/      # User dashboard to view saved outputs
│   ├── mini-apps/      # Mini-apps container
│   │   ├── business-plan/       # 15-Minute Business Plan Generator
│   │   ├── growth-plan/         # 30-Day Growth Plan
│   │   ├── one-page-plan/       # One-Page Plan Generator
│   │   └── sprint-planner/      # 30-Day Sprint Planner
│   └── playground/     # AI Playground (kept from starter kit)
├── components/
│   ├── homepage/       # Landing page components
│   ├── mini-apps/      # Mini-app specific components
│   │   ├── business-plan/  # Components for business plan app
│   │   ├── growth-plan/    # Components for growth plan app
│   │   ├── one-page-plan/  # Components for one-page plan app
│   │   ├── sprint-planner/ # Components for sprint planner app
│   │   └── shared/         # Components shared between mini-apps
│   │       ├── form/       # Dynamic form components
│   │       ├── results/    # Result display components
│   │       └── suggestions/ # AI suggestion components
│   ├── shared/         # Shared UI components
│   └── wrapper/        # Layout wrappers and navigation
├── config/             # Configuration files
│   ├── mini-apps/      # Mini-apps configuration
│   └── ai/             # AI prompts and configurations
├── convex/             # Convex DB schema and functions
│   ├── schema/         # Database schema
│   ├── auth/           # Authentication functions
│   ├── mini-apps/      # Mini-app specific functions
│   └── ai/             # AI processing functions
├── lib/                # Utility functions
│   ├── ai/             # AI utilities and prompt engineering
│   ├── form/           # Form handling utilities
│   └── helpers/        # General helper functions
├── public/             # Static assets
│   ├── images/         # Image assets
│   ├── svg/            # SVG assets
│   └── templates/      # PDF/Doc templates for downloadable outputs
└── styles/             # Global styles
```

## 8. Development Methodology

### Phase 1: Core Platform & First Mini-App
- Adapt the Next.js 15 starter kit to Summit's needs
- Implement home page design and mini-app selection UI
- Develop one complete mini-app (15-Minute Business Plan Generator)
- Test and refine the entire flow

### Phase 2: Expand Mini-App Suite
- Create templated components for question flows
- Add remaining mini-apps
- Implement analytics to track usage

### Phase 3: Optimization & Integration
- Improve AI prompts based on user feedback
- Enhance cross-promotion between mini-apps
- Deep integration with Summit's core platform

## 9. Technical Considerations

### Form Management
- React Hook Form with Zod for validation
- State machine for complex, dynamic form flows

### AI Implementation
- Store well-crafted prompts in Convex DB
- Implement streaming responses
- Cache common responses to reduce API costs

### Performance
- Implement suspense boundaries for loading states
- Use server components strategically
- Leverage incremental static regeneration for static content

### Data Structure
For Convex DB:
- `users` table linked to Clerk
- `outputs` table to store all generated plans
- `prompts` table for AI system prompts
- `appTemplates` table to define each mini-app's structure

## 10. First Mini-App Flow: 15-Minute Business Plan Generator

### User Flow Overview
1. User selects the Business Plan Generator from the mini-apps homepage
2. User progresses through 12 key questions with AI suggestions
3. User provides authentication to receive the completed plan
4. System generates comprehensive business plan using AI
5. User receives plan and can save it to their dashboard

### Core Questions to Ask
Each question will include AI-powered suggestions displayed below the input box to guide users:

1. **What is your business idea?** 
   *E.g. A mobile coffee subscription service that delivers weekly.*

2. **Where is your business located?** 
   *E.g. Dubai, UAE or Dubai with global online presence*

3. **Who is your target market?** 
   *E.g. Young professionals, coffee enthusiasts, busy parents*

4. **How does your solution solve the problem?** 
   *E.g. Delivering fresh coffee directly saves time and ensures quality*

5. **What stage is your business at currently?** 
   *E.g. Early concept, prototype testing, first paying customers*

6. **How many team members do you have?** 
   *E.g. Solo founder, 3 co-founders, 5 employees*

7. **How will you make money?** 
   *E.g. Subscription model at 99 AED/month, one-time purchases*

8. **What are your funding needs?** 
   *E.g. 200K AED for initial inventory and marketing*

9. **What are your growth goals?** 
   *E.g. 500 subscribers in year one, expand to Abu Dhabi by year two*

10. **How will you reach your customers?** 
    *E.g. Instagram ads, local events, word of mouth*

11. **What key resources do you need?** 
    *E.g. Coffee roasting equipment, delivery vehicles, website*

12. **Is there anything else we should know?** 
    *E.g. Partnership with local roasters, seasonal menu planned*

### AI Research Topics (via Perplexity)
The system will enhance the business plan by researching:
* Problem analysis
* Competitor landscape in business location
* Industry challenges
* Market conditions
* Potential differentiators
* Potential SWOT analysis

### Output Format
The generated business plan will include:
* Executive Summary
* Business Description
* Market Analysis
* Competitive Analysis
* Products/Services
* Marketing Strategy
* Financial Projections
* Implementation Timeline
* SWOT Analysis
* Risk Assessment

## 11. UI/UX Specification

### Home Page Design
The home page will be adapted from the Next.js 15 Starter Kit with the following modifications:

#### Header Section:
- Replace "Next Starter" with "Summit" in the top left
- Remove the "Resources", "Dashboard", and "AI Playground" navigation items
- Add "Dashboard" link for authenticated users
- Retain the "Sign in" button in the top right 
- Keep theme toggle functionality

#### Hero Section:
- Main heading: "Helping Founders Build Startups"
- Tagline in gradient text: "That Achieve Targets."
- Subheading: "Define clear objectives, track progress effortlessly, and turn your vision into measurable success. Get started today!"
- Purple "Get Started" CTA button
- Optional email signup field alongside the CTA
- Light lavender background
- Summit logo (purple) in the top left

#### Mini-Apps Section:
- Replace "Built with Modern Tech Stack" section with "Summit Mini Apps"
- Display 6 tiles (initially with one functional app and placeholders for future apps)
- Each tile will represent one mini-app with:
  - Icon representing the app's purpose
  - Title of the mini-app
  - Brief description (1-2 sentences)
  - "Try Now" button or similar CTA

#### Initial 6 Mini-App Tiles:
1. **15-Minute Business Plan Generator** (Functional)
2. **30-Day Growth Plan** (Coming Soon)
3. **One-Page Plan Generator** (Coming Soon)
4. **30-Day Sprint Planner** (Coming Soon)
5. **Marketing Campaign Builder** (Coming Soon)
6. **Investor Pitch Deck** (Coming Soon)

#### Footer:
- Update all branding to reflect Summit
- Maintain the same structure with:
  - Product links
  - Company information
  - Newsletter signup
  - Legal information

### Mini-App Flow Interface
The Business Plan Generator interface will have the following characteristics:

#### Entry Screen:
- Clear title: "15-Minute Business Plan Generator"
- Brief explanation of the value proposition
- "Start Now" button
- Estimated completion time indicator

#### Question Flow:
- Progress indicator at the top showing step number and total steps (e.g., "Step 3 of 12")
- Summit logo positioned at the top of the screen
- Clean, contained card/box design for each question
- Large, clear question text at the top of the card (e.g., "What makes your business unique?")
- Input field directly below the question:
  - For text input: Text area with placeholder example (e.g., "E.g., all-natural ingredients, warm atmosphere, etc.")
  - For multiple choice: Selectable option boxes with clear labels
- "Personalized ideas for you:" section below the input with:
  - AI-generated suggestions relevant to previous answers
  - Each suggestion displayed as a clickable option
  - Refresh icon to generate new suggestions
- Prominent "Next" button at the bottom to advance to the next question
- Subtle "Back" option to return to previous questions
- Consistent padding and spacing throughout
- Mobile-responsive layout that maintains readability on all devices

#### Authentication Interstitial:
- Appears before showing results
- Required step - users cannot access their generated plan without signing up/signing in
- Clear messaging about the value of creating an account (save your plan, access dashboard, etc.)
- Clean, minimal sign-up/sign-in form
- Option to sign in with social accounts or email
- Reassurance about data privacy and no future paywalls

#### Results Page:
- Success message and congratulations
- Complete business plan displayed in sections with collapsible areas
- Option to download as PDF
- Option to edit specific sections
- "Create Another Plan" button
- Preview of other available mini-apps

#### Dashboard Integration:
- All created plans accessible from user dashboard
- Plans displayed in a list/grid with:
  - Plan name/type
  - Creation date
  - Preview thumbnail or summary
  - Action buttons (view, edit, download, share)
- Each plan stored as a complete, formatted document with proper headers and sections
- Ability to compare different versions
- Edit and share functionality
- Search and filter capabilities
- Option to duplicate and modify existing plans

### User Dashboard Design
The dashboard will provide a centralized location for users to access and manage all their created plans:

#### Dashboard Layout:
- Clean, organized grid/list of all user-generated plans
- Sidebar navigation for different plan types and filters
- Summary statistics at the top (total plans, recent activity)
- Quick-action buttons for creating new plans

#### Plan Document Format:
- Each plan stored as a cohesive, well-formatted document
- Proper document structure with hierarchical headers (H1, H2, H3)
- Consistent typography and spacing throughout
- Table of contents for easy navigation within longer plans
- Clear section breaks and visual organization
- Printer-friendly formatting
- PDF export option with maintained formatting

#### Dashboard Features:
- Sort plans by date, type, or custom tags
- Filter plans by completion status or plan type
- Search functionality for finding specific plans or content within plans
- Bulk actions (download multiple, archive, delete)
- User preferences for dashboard organization
- Optional email reminders for plan follow-ups or revisions

### Design System
- **Brand Colors:**
  - Primary: Purple (#8A4FFF) for Summit logo and primary actions
  - Secondary: Pink (#FF55C6) for accents and highlights
  - Gradient: Purple to Pink gradient for special elements and emphasis
  - Background: Light lavender (#F5F5FF) for page backgrounds
  - White (#FFFFFF) for content cards and containers
  - Dark text (#2D2D2D) for readability and contrast
- **Typography:**
  - Clean, modern sans-serif font family
  - Bold, black headings for impact
  - Regular weight for body text
  - Gradient text effect for key taglines
- **UI Elements:**
  - Rounded buttons with solid colors or gradients
  - Clean, minimal iconography
  - Subtle shadows for depth
  - Ample white space for readability
- Dark mode compatibility
- Consistent use of shadcn/ui components
- Mobile-responsive design for all screens

## 12. Success Metrics

- User signups through mini-apps
- Completion rate of mini-app forms
- Conversion rate from mini-app users to Summit services
- User satisfaction with mini-app outputs
- Number of return visits to dashboard

## 13. Next Steps

1. Design detailed flow for first mini-app
2. Set up project with Next.js 15 starter kit
3. Configure Clerk and Convex DB
4. Implement dynamic form system
5. Build AI integration

## 14. Business Model

### Access Model
- All mini-apps will be free to use with no paywall or premium tier initially
- Users can freely access the question flows for all mini-apps
- Authentication is required at the end of the flow to access the generated plan
- Users must create a Summit account before viewing, downloading, or accessing their generated plans
- This approach balances providing value with lead generation

### Lead Generation
- Each completed mini-app represents a qualified lead for Summit's main services
- User data and plan information provide insights for potential upselling opportunities
- Email marketing can be targeted based on the types of plans users create
- Summit can showcase additional services that complement the free mini-app offerings

### Future Monetization Options (Reserved)
- While keeping the current implementation free, the project architecture supports future monetization if needed:
  - Premium plan upgrades with additional features
  - Subscription access to multiple plan types
  - Consulting services based on plan insights
  - Advanced plan analytics or implementation guidance

### Data Collection
- User information and business details collected during the process will be used to:
  - Improve AI suggestions and outputs
  - Tailor marketing for Summit's main services
  - Create personalized follow-up opportunities
  - Build a database of business trends and needs# Summit Mini-Apps Platform - Project Document


Database Schema; 

Let's design a comprehensive database schema for the Summit Mini-Apps Platform that supports all the requirements we've discussed, with particular focus on the initial Business Plan Generator.

### Users Table
- `id`: Unique identifier (generated by Convex)
- `clerkId`: String - External ID from Clerk authentication
- `email`: String - User's email address
- `name`: String - User's full name
- `createdAt`: Number - Timestamp of account creation
- `lastActive`: Number - Timestamp of last activity
- `preferences`: Object - User preferences for dashboard and notifications

### Mini-Apps Table
- `id`: Unique identifier
- `name`: String - Name of the mini-app (e.g., "15-Minute Business Plan Generator")
- `slug`: String - URL-friendly identifier (e.g., "business-plan")
- `description`: String - Brief description of the mini-app
- `icon`: String - Icon reference for the mini-app
- `isActive`: Boolean - Whether the mini-app is available to users
- `order`: Number - Display order on the homepage
- `createdAt`: Number - When the mini-app was added
- `updatedAt`: Number - When the mini-app was last updated

### Questions Table
- `id`: Unique identifier
- `miniAppId`: String - Reference to the mini-app this question belongs to
- `text`: String - The question text
- `inputType`: String - Type of input (text, select, multiselect, etc.)
- `placeholder`: String - Example text for the input
- `required`: Boolean - Whether an answer is required
- `order`: Number - The sequence order of questions
- `options`: Array - Possible selections for multiple choice questions
- `nextQuestionLogic`: Object - Logic for determining the next question based on answer

### Outputs Table
- `id`: Unique identifier
- `userId`: String - Reference to the user who created this output
- `miniAppId`: String - Reference to the mini-app that generated this output
- `title`: String - User-provided or auto-generated title
- `content`: Object - The structured output content (sections, data, etc.)
- `formattedContent`: String - Markdown or HTML formatted output for display
- `createdAt`: Number - When the output was generated
- `updatedAt`: Number - When the output was last edited
- `metadata`: Object - Additional data about the output process

### Answers Table
- `id`: Unique identifier
- `outputId`: String - Reference to the associated output
- `questionId`: String - Reference to the question that was answered
- `value`: Any - The user's answer
- `createdAt`: Number - When the answer was provided
- `updatedAt`: Number - When the answer was last modified

### AIPrompts Table
- `id`: Unique identifier
- `miniAppId`: String - Reference to the associated mini-app
- `type`: String - The prompt type (suggestions, generation, research)
- `content`: String - The actual prompt template
- `parameters`: Array - Required parameters for the prompt
- `version`: Number - Version number for tracking updates
- `createdAt`: Number - When the prompt was created
- `updatedAt`: Number - When the prompt was last modified

### AIResponses Table (for caching and analysis)
- `id`: Unique identifier
- `promptId`: String - Reference to the prompt used
- `input`: Object - The input parameters provided to the prompt
- `output`: String - The response received from the AI
- `model`: String - The AI model used (e.g., "gpt-4")
- `createdAt`: Number - When the response was generated
- `metadata`: Object - Performance metrics, tokens used, etc.

### ResearchData Table
- `id`: Unique identifier
- `outputId`: String - Reference to the associated output
- `topic`: String - Research topic
- `source`: String - Source of the data (e.g., "perplexity")
- `content`: String - The research content
- `createdAt`: Number - When the research was conducted

### Indexes
- Users: by_clerk_id, by_email
- Mini-Apps: by_slug, by_active_status
- Questions: by_mini_app, by_order
- Outputs: by_user, by_mini_app, by_creation_date
- Answers: by_output, by_question
- AIPrompts: by_mini_app, by_type
- AIResponses: by_prompt, by_creation_date
- ResearchData: by_output, by_topic

This schema provides:
1. Flexible support for multiple mini-apps
2. Detailed tracking of user interactions
3. Storage for all generated content
4. Management of AI prompts and responses
5. Caching capabilities to reduce API costs
6. Structured format for research data

The schema is specifically designed to support the Business Plan Generator as the first mini-app while establishing a foundation that will easily accommodate additional mini-apps in the future.
