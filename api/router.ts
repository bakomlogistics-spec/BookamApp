import { authRouter } from "./auth-router";
import { propertyRouter } from "./propertyRouter";
import { locationRouter } from "./locationRouter";
import { inquiryRouter } from "./inquiryRouter";
import { favoriteRouter } from "./favoriteRouter";
import { adminRouter } from "./adminRouter";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  property: propertyRouter,
  location: locationRouter,
  inquiry: inquiryRouter,
  favorite: favoriteRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
