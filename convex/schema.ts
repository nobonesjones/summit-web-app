import { defineSchema, defineTable } from "convex/server"
import { Infer, v } from "convex/values"

export const INTERVALS = {
    MONTH: "month",
    YEAR: "year",
} as const;

export const intervalValidator = v.union(
    v.literal(INTERVALS.MONTH),
    v.literal(INTERVALS.YEAR),
);

export type Interval = Infer<typeof intervalValidator>;

// Define a price object structure that matches your data
const priceValidator = v.object({
    amount: v.number(),
    polarId: v.string(),
});

// Define a prices object structure for a specific interval
const intervalPricesValidator = v.object({
    usd: priceValidator,
});

export default defineSchema({
    // Users table - Enhanced for Summit Mini-Apps Platform
    users: defineTable({
        // Authentication fields
        tokenIdentifier: v.string(), // Supabase auth token
        userId: v.string(), // Unique user ID
        email: v.string(), // User's email address
        name: v.optional(v.string()), // User's full name
        image: v.optional(v.string()), // User's profile image
        
        // User metadata
        createdAt: v.string(), // When the account was created
        lastActive: v.optional(v.number()), // Timestamp of last activity
        
        // Subscription information
        subscription: v.optional(v.string()), // Subscription status
        credits: v.optional(v.string()), // Available credits
        
        // User preferences
        preferences: v.optional(v.object({
            dashboardLayout: v.optional(v.string()), // User's preferred dashboard layout
            notifications: v.optional(v.boolean()), // Notification preferences
            theme: v.optional(v.string()), // UI theme preference
        })),
    })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),
    
    // Outputs table - For storing generated plans
    outputs: defineTable({
        userId: v.string(), // Reference to the user who created this output
        miniAppId: v.string(), // Reference to the mini-app that generated this output
        title: v.string(), // User-provided or auto-generated title
        content: v.object({ // The structured output content
            sections: v.array(v.object({
                title: v.string(),
                content: v.string(),
            })),
            metadata: v.optional(v.any()),
        }),
        formattedContent: v.string(), // Markdown or HTML formatted output for display
        createdAt: v.number(), // When the output was generated
        updatedAt: v.optional(v.number()), // When the output was last edited
        tags: v.optional(v.array(v.string())), // User-defined tags for organization
    })
    .index("by_user", ["userId"])
    .index("by_mini_app", ["miniAppId"])
    .index("by_creation_date", ["createdAt"]),
    
    // Answers table - For storing user responses to questions
    answers: defineTable({
        outputId: v.string(), // Reference to the associated output
        questionId: v.string(), // Reference to the question that was answered
        value: v.any(), // The user's answer (can be string, number, boolean, etc.)
        createdAt: v.number(), // When the answer was provided
        updatedAt: v.optional(v.number()), // When the answer was last modified
    })
    .index("by_output", ["outputId"])
    .index("by_question", ["questionId"]),
    
    // Prompts table - For AI templates
    prompts: defineTable({
        miniAppId: v.string(), // Reference to the associated mini-app
        type: v.string(), // The prompt type (suggestions, generation, research)
        content: v.string(), // The actual prompt template
        parameters: v.array(v.string()), // Required parameters for the prompt
        version: v.number(), // Version number for tracking updates
        createdAt: v.number(), // When the prompt was created
        updatedAt: v.optional(v.number()), // When the prompt was last modified
        isActive: v.boolean(), // Whether this prompt is currently in use
    })
    .index("by_mini_app", ["miniAppId"])
    .index("by_type", ["type"]),
    
    // AIResponses table - For caching and analysis
    aiResponses: defineTable({
        promptId: v.string(), // Reference to the prompt used
        input: v.any(), // The input parameters provided to the prompt
        output: v.string(), // The response received from the AI
        model: v.string(), // The AI model used (e.g., "gpt-4")
        createdAt: v.number(), // When the response was generated
        metadata: v.optional(v.object({
            tokensUsed: v.optional(v.number()),
            processingTime: v.optional(v.number()),
            cost: v.optional(v.number()),
        })),
    })
    .index("by_prompt", ["promptId"])
    .index("by_creation_date", ["createdAt"]),
    
    // ResearchData table - For storing external research
    researchData: defineTable({
        outputId: v.string(), // Reference to the associated output
        topic: v.string(), // Research topic
        source: v.string(), // Source of the data (e.g., "perplexity")
        content: v.string(), // The research content
        createdAt: v.number(), // When the research was conducted
        url: v.optional(v.string()), // Source URL if applicable
    })
    .index("by_output", ["outputId"])
    .index("by_topic", ["topic"]),
    
    // Mini-Apps table - For storing mini-app configurations
    appTemplates: defineTable({
        name: v.string(), // Name of the mini-app (e.g., "15-Minute Business Plan Generator")
        slug: v.string(), // URL-friendly identifier (e.g., "business-plan")
        description: v.string(), // Brief description of the mini-app
        icon: v.string(), // Icon reference for the mini-app
        isActive: v.boolean(), // Whether the mini-app is available to users
        order: v.number(), // Display order on the homepage
        createdAt: v.number(), // When the mini-app was added
        updatedAt: v.optional(v.number()), // When the mini-app was last updated
        config: v.object({
            questionFlow: v.array(v.string()), // IDs of questions in sequence
            outputSections: v.array(v.string()), // Sections to include in output
            researchTopics: v.optional(v.array(v.string())), // Topics to research
        }),
    })
    .index("by_slug", ["slug"])
    .index("by_active_status", ["isActive"]),
    
    // Questions table - For storing mini-app questions
    questions: defineTable({
        miniAppId: v.string(), // Reference to the mini-app this question belongs to
        text: v.string(), // The question text
        inputType: v.string(), // Type of input (text, select, multiselect, etc.)
        placeholder: v.optional(v.string()), // Example text for the input
        required: v.boolean(), // Whether an answer is required
        order: v.number(), // The sequence order of questions
        options: v.optional(v.array(v.string())), // Possible selections for multiple choice
        nextQuestionLogic: v.optional(v.any()), // Logic for determining the next question
    })
    .index("by_mini_app", ["miniAppId"])
    .index("by_order", ["order"]),
    
    // Existing tables for subscription functionality
    plans: defineTable({
        key: v.string(),
        name: v.string(),
        description: v.string(),
        polarProductId: v.string(),
        prices: v.object({
            month: v.optional(intervalPricesValidator),
            year: v.optional(intervalPricesValidator),
        }),
    })
    .index("key", ["key"])
    .index("polarProductId", ["polarProductId"]),
    
    subscriptions: defineTable({
        userId: v.optional(v.string()),
        polarId: v.optional(v.string()),
        polarPriceId: v.optional(v.string()),
        currency: v.optional(v.string()),
        interval: v.optional(v.string()),
        status: v.optional(v.string()),
        currentPeriodStart: v.optional(v.number()),
        currentPeriodEnd: v.optional(v.number()),
        cancelAtPeriodEnd: v.optional(v.boolean()),
        amount: v.optional(v.number()),
        startedAt: v.optional(v.number()),
        endsAt: v.optional(v.number()),
        endedAt: v.optional(v.number()),
        canceledAt: v.optional(v.number()),
        customerCancellationReason: v.optional(v.string()),
        customerCancellationComment: v.optional(v.string()),
        metadata: v.optional(v.any()),
        customFieldData: v.optional(v.any()),
        customerId: v.optional(v.string()),
    })
    .index("userId", ["userId"])
    .index("polarId", ["polarId"]),
    
    webhookEvents: defineTable({
        type: v.string(),
        polarEventId: v.string(),
        createdAt: v.string(),
        modifiedAt: v.string(),
        data: v.any(),
    })
    .index("type", ["type"])
    .index("polarEventId", ["polarEventId"]),
})