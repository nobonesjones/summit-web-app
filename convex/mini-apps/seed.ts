import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Seed the appTemplates table with the initial mini-app
export const seedMiniApps = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if the Business Plan Generator already exists
    const existingApp = await ctx.db
      .query("appTemplates")
      .withIndex("by_slug", (q) => q.eq("slug", "business-plan"))
      .first();

    if (existingApp) {
      console.log("Business Plan Generator already exists, skipping seed");
      return existingApp._id;
    }

    // Create the Business Plan Generator mini-app
    const miniAppId = await ctx.db.insert("appTemplates", {
      name: "15-Minute Business Plan Generator",
      slug: "business-plan",
      description: "Create a comprehensive business plan in just 15 minutes",
      icon: "FileText", // Using a Lucide icon name
      isActive: true,
      order: 1, // First in the list
      createdAt: Date.now(),
      config: {
        questionFlow: [], // Will be populated after creating questions
        outputSections: [
          "Executive Summary",
          "Business Description",
          "Market Analysis",
          "Competitive Analysis",
          "Products/Services",
          "Marketing Strategy",
          "Financial Projections",
          "Implementation Timeline",
          "SWOT Analysis",
          "Risk Assessment"
        ],
        researchTopics: [
          "Problem analysis",
          "Competitor landscape",
          "Industry challenges",
          "Market conditions",
          "Potential differentiators",
          "SWOT analysis"
        ]
      }
    });

    // Create the questions for the Business Plan Generator
    const questions = [
      {
        text: "What is your business idea?",
        inputType: "text",
        placeholder: "E.g. A mobile coffee subscription service that delivers weekly.",
        required: true,
        order: 1
      },
      {
        text: "Where is your business located?",
        inputType: "text",
        placeholder: "E.g. Dubai, UAE or Dubai with global online presence",
        required: true,
        order: 2
      },
      {
        text: "Who is your target market?",
        inputType: "text",
        placeholder: "E.g. Young professionals, coffee enthusiasts, busy parents",
        required: true,
        order: 3
      },
      {
        text: "How does your solution solve the problem?",
        inputType: "text",
        placeholder: "E.g. Delivering fresh coffee directly saves time and ensures quality",
        required: true,
        order: 4
      },
      {
        text: "What stage is your business at currently?",
        inputType: "select",
        placeholder: "Select your business stage",
        required: true,
        order: 5,
        options: [
          "Idea/Concept",
          "Prototype/MVP",
          "Early customers",
          "Growing revenue",
          "Established business"
        ]
      },
      {
        text: "How many team members do you have?",
        inputType: "select",
        placeholder: "Select team size",
        required: true,
        order: 6,
        options: [
          "Solo founder",
          "2-3 co-founders",
          "4-10 employees",
          "11-50 employees",
          "50+ employees"
        ]
      },
      {
        text: "How will you make money?",
        inputType: "text",
        placeholder: "E.g. Subscription model at 99 AED/month, one-time purchases",
        required: true,
        order: 7
      },
      {
        text: "What are your funding needs?",
        inputType: "text",
        placeholder: "E.g. 200K AED for initial inventory and marketing",
        required: true,
        order: 8
      },
      {
        text: "What are your growth goals?",
        inputType: "text",
        placeholder: "E.g. 500 subscribers in year one, expand to Abu Dhabi by year two",
        required: true,
        order: 9
      },
      {
        text: "How will you reach your customers?",
        inputType: "text",
        placeholder: "E.g. Instagram ads, local events, word of mouth",
        required: true,
        order: 10
      },
      {
        text: "What key resources do you need?",
        inputType: "text",
        placeholder: "E.g. Coffee roasting equipment, delivery vehicles, website",
        required: true,
        order: 11
      },
      {
        text: "Is there anything else we should know?",
        inputType: "text",
        placeholder: "E.g. Partnership with local roasters, seasonal menu planned",
        required: false,
        order: 12
      }
    ];

    // Insert all questions and collect their IDs
    const questionIds = [];
    for (const question of questions) {
      const questionId = await ctx.db.insert("questions", {
        miniAppId: miniAppId,
        text: question.text,
        inputType: question.inputType,
        placeholder: question.placeholder,
        required: question.required,
        order: question.order,
        options: question.options || undefined,
        nextQuestionLogic: undefined // Simple linear flow for now
      });
      questionIds.push(questionId);
    }

    // Update the mini-app with the question flow
    await ctx.db.patch(miniAppId, {
      config: {
        questionFlow: questionIds,
        outputSections: [
          "Executive Summary",
          "Business Description",
          "Market Analysis",
          "Competitive Analysis",
          "Products/Services",
          "Marketing Strategy",
          "Financial Projections",
          "Implementation Timeline",
          "SWOT Analysis",
          "Risk Assessment"
        ],
        researchTopics: [
          "Problem analysis",
          "Competitor landscape",
          "Industry challenges",
          "Market conditions",
          "Potential differentiators",
          "SWOT analysis"
        ]
      }
    });

    // Create the AI prompts for the Business Plan Generator
    await ctx.db.insert("prompts", {
      miniAppId: miniAppId,
      type: "suggestions",
      content: "Based on the user's previous answers, especially about {{businessIdea}} and {{targetMarket}}, suggest some possible answers for the question: {{currentQuestion}}. Provide 3-5 concise, specific, and diverse suggestions that would be helpful for creating a business plan.",
      parameters: ["businessIdea", "targetMarket", "currentQuestion"],
      version: 1,
      createdAt: Date.now(),
      isActive: true
    });

    await ctx.db.insert("prompts", {
      miniAppId: miniAppId,
      type: "generation",
      content: "Create a comprehensive business plan based on the following information:\n\nBusiness Idea: {{businessIdea}}\nLocation: {{location}}\nTarget Market: {{targetMarket}}\nSolution: {{solution}}\nBusiness Stage: {{stage}}\nTeam Size: {{teamSize}}\nRevenue Model: {{revenueModel}}\nFunding Needs: {{fundingNeeds}}\nGrowth Goals: {{growthGoals}}\nCustomer Acquisition: {{customerAcquisition}}\nKey Resources: {{keyResources}}\nAdditional Info: {{additionalInfo}}\n\nResearch Insights: {{researchInsights}}\n\nFormat the business plan with the following sections:\n1. Executive Summary\n2. Business Description\n3. Market Analysis\n4. Competitive Analysis\n5. Products/Services\n6. Marketing Strategy\n7. Financial Projections\n8. Implementation Timeline\n9. SWOT Analysis\n10. Risk Assessment\n\nMake the plan specific, actionable, and tailored to the business idea and location provided.",
      parameters: [
        "businessIdea", "location", "targetMarket", "solution", 
        "stage", "teamSize", "revenueModel", "fundingNeeds", 
        "growthGoals", "customerAcquisition", "keyResources", 
        "additionalInfo", "researchInsights"
      ],
      version: 1,
      createdAt: Date.now(),
      isActive: true
    });

    await ctx.db.insert("prompts", {
      miniAppId: miniAppId,
      type: "research",
      content: "Research the following topic related to this business idea: {{businessIdea}} in {{location}}. The specific research topic is: {{researchTopic}}. Provide factual, up-to-date information that would be valuable for a business plan.",
      parameters: ["businessIdea", "location", "researchTopic"],
      version: 1,
      createdAt: Date.now(),
      isActive: true
    });

    return miniAppId;
  },
}); 