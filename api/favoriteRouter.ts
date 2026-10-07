import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { findFavoritesByUser, addFavorite, removeFavorite, isFavorite } from "./queries/favorites";

export const favoriteRouter = createRouter({
  list: authedQuery.query(({ ctx }) =>
    findFavoritesByUser(ctx.user.id)
  ),

  add: authedQuery
    .input(z.object({ propertyId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await addFavorite(ctx.user.id, input.propertyId);
      return { success: true };
    }),

  remove: authedQuery
    .input(z.object({ propertyId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await removeFavorite(ctx.user.id, input.propertyId);
      return { success: true };
    }),

  check: authedQuery
    .input(z.object({ propertyId: z.number() }))
    .query(async ({ ctx, input }) => {
      return isFavorite(ctx.user.id, input.propertyId);
    }),
});
