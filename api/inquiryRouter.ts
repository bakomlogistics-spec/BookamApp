import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { createInquiry, findInquiriesByOwner, findInquiriesBySender, updateInquiryStatus } from "./queries/inquiries";

export const inquiryRouter = createRouter({
  listReceived: authedQuery.query(({ ctx }) =>
    findInquiriesByOwner(ctx.user.id)
  ),

  listSent: authedQuery.query(({ ctx }) =>
    findInquiriesBySender(ctx.user.id)
  ),

  create: authedQuery
    .input(
      z.object({
        propertyId: z.number(),
        ownerId: z.number(),
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().min(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await createInquiry({ ...input, senderId: ctx.user.id });
      return { id };
    }),

  updateStatus: authedQuery
    .input(z.object({ id: z.number(), status: z.enum(["new", "read", "replied", "archived"]) }))
    .mutation(async ({ input }) => {
      // Optional: verify ownership
      await updateInquiryStatus(input.id, input.status);
      return { success: true };
    }),
});
