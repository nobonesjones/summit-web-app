import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            return ("Not authenticated");
        }
        return identity
    }
})

export const getUserByToken = query({
    args: { tokenIdentifier: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", args.tokenIdentifier)
            )
            .unique();
    },
});

export const listUsers = query({
    args: {},
    handler: async (ctx) => {
        // Get all users from the database
        return await ctx.db.query("users").collect();
    },
});

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        // Check if we've already stored this identity before
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.subject)
            )
            .unique();

        if (user !== null) {
            // If we've seen this identity before but the name has changed, patch the value
            if (user.name !== identity.name) {
                await ctx.db.patch(user._id, { name: identity.name, email: identity.email });
            }
            return user._id;
        }

        // If it's a new identity, create a new User
        return await ctx.db.insert("users", {
            name: identity.name!,
            email: identity.email!,
            userId: identity.subject,
            tokenIdentifier: identity.subject,
            createdAt: new Date().toISOString(),
        });
    },
});

// Create a user from Supabase webhook
export const createUser = mutation({
    args: {
        tokenIdentifier: v.string(),
        userId: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        createdAt: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if the user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", args.tokenIdentifier)
            )
            .unique();

        if (existingUser !== null) {
            // User already exists, update their information
            await ctx.db.patch(existingUser._id, {
                name: args.name,
                email: args.email,
            });
            return existingUser._id;
        }

        // Create a new user
        return await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            userId: args.userId,
            email: args.email,
            name: args.name || args.email.split('@')[0],
            createdAt: args.createdAt,
        });
    },
});

// Update a user from Supabase webhook
export const updateUser = mutation({
    args: {
        tokenIdentifier: v.string(),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Find the user by token identifier
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", args.tokenIdentifier)
            )
            .unique();

        if (user === null) {
            throw new Error(`User with token ${args.tokenIdentifier} not found`);
        }

        // Update the user's information
        const updates: Record<string, any> = {};
        if (args.email) updates.email = args.email;
        if (args.name) updates.name = args.name;

        await ctx.db.patch(user._id, updates);
        return user._id;
    },
});
