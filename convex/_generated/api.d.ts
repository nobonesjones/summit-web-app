/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as businessPlans from "../businessPlans.js";
import type * as http from "../http.js";
import type * as mini_apps_api from "../mini-apps/api.js";
import type * as mini_apps_seed from "../mini-apps/seed.js";
import type * as plans from "../plans.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  businessPlans: typeof businessPlans;
  http: typeof http;
  "mini-apps/api": typeof mini_apps_api;
  "mini-apps/seed": typeof mini_apps_seed;
  plans: typeof plans;
  subscriptions: typeof subscriptions;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
