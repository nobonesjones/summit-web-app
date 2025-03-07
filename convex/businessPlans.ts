import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

// Create a new business plan
export const create = mutation({
  args: {
    title: v.string(),
    businessIdea: v.string(),
    location: v.string(),
    category: v.string(),
    sections: v.array(
      v.object({
        title: v.string(),
        content: v.string(),
      })
    ),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }
    
    const userId = identity.subject;
    
    // Create the business plan
    const businessPlanId = await ctx.db.insert('businessPlans', {
      userId,
      title: args.title,
      businessIdea: args.businessIdea,
      location: args.location,
      category: args.category,
      sections: args.sections,
      createdAt: args.createdAt,
    });
    
    return businessPlanId;
  },
});

// Get all business plans for the current user
export const getPlans = query({
  handler: async (ctx) => {
    // Get the current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    
    const userId = identity.subject;
    
    // Get all business plans for the user
    const businessPlans = await ctx.db
      .query('businessPlans')
      .filter((q) => q.eq(q.field('userId'), userId))
      .order('desc')
      .collect();
    
    return businessPlans;
  },
});

// Get a specific business plan by ID
export const getPlanById = query({
  args: { id: v.id('businessPlans') },
  handler: async (ctx, args) => {
    // Get the current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }
    
    // Get the business plan
    const businessPlan = await ctx.db.get(args.id);
    
    // Check if the business plan exists and belongs to the user
    if (!businessPlan || businessPlan.userId !== identity.subject) {
      throw new Error('Business plan not found or unauthorized');
    }
    
    return businessPlan;
  },
});

// Delete a business plan
export const deletePlan = mutation({
  args: { id: v.id('businessPlans') },
  handler: async (ctx, args) => {
    // Get the current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }
    
    // Get the business plan
    const businessPlan = await ctx.db.get(args.id);
    
    // Check if the business plan exists and belongs to the user
    if (!businessPlan || businessPlan.userId !== identity.subject) {
      throw new Error('Business plan not found or unauthorized');
    }
    
    // Delete the business plan
    await ctx.db.delete(args.id);
    
    return { success: true };
  },
}); 