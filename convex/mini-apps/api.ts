import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// Get all active mini-apps
export const listMiniApps = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("appTemplates")
      .withIndex("by_active_status", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Get a specific mini-app by slug
export const getMiniAppBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appTemplates")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get questions for a mini-app
export const getMiniAppQuestions = query({
  args: { miniAppId: v.id("appTemplates") },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_mini_app", (q) => q.eq("miniAppId", args.miniAppId))
      .collect();
    
    // Sort by order field manually
    return questions.sort((a, b) => a.order - b.order);
  },
});

// Get a specific question by ID
export const getQuestion = query({
  args: { questionId: v.id("questions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.questionId);
  },
});

// Save user answers and create an output
export const createOutput = mutation({
  args: {
    userId: v.string(),
    miniAppId: v.id("appTemplates"),
    title: v.string(),
    answers: v.array(
      v.object({
        questionId: v.id("questions"),
        value: v.any(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Create a placeholder output
    const outputId = await ctx.db.insert("outputs", {
      userId: args.userId,
      miniAppId: args.miniAppId,
      title: args.title,
      content: {
        sections: [
          {
            title: "Processing",
            content: "Your business plan is being generated...",
          },
        ],
      },
      formattedContent: "# Processing\n\nYour business plan is being generated...",
      createdAt: Date.now(),
    });

    // Save all the answers
    for (const answer of args.answers) {
      await ctx.db.insert("answers", {
        outputId,
        questionId: answer.questionId,
        value: answer.value,
        createdAt: Date.now(),
      });
    }

    // In a real implementation, you would trigger the AI generation here
    // For now, we'll just return the output ID
    return outputId;
  },
});

// Get all outputs for a user
export const getUserOutputs = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const outputs = await ctx.db
      .query("outputs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Sort by createdAt in descending order manually
    return outputs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get a specific output
export const getOutput = query({
  args: { outputId: v.id("outputs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.outputId);
  },
});

// Get answers for an output
export const getOutputAnswers = query({
  args: { outputId: v.id("outputs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("answers")
      .withIndex("by_output", (q) => q.eq("outputId", args.outputId))
      .collect();
  },
}); 