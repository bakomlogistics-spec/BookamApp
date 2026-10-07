import { z } from "zod";
import { createRouter, adminQuery, authedQuery } from "./middleware";
import {
  getAdminStats,
  findAllUsers,
  updateUserRole,
  verifyAgent,
  findAllReports,
  updateReportStatus,
  createReport,
} from "./queries/admin";
import { updateProperty, findProperties, deleteProperty } from "./queries/properties";

export const adminRouter = createRouter({
  stats: adminQuery.query(() => getAdminStats()),

  users: adminQuery.query(() => findAllUsers()),

  updateUserRole: adminQuery
    .input(z.object({ id: z.number(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ input }) => {
      await updateUserRole(input.id, input.role);
      return { success: true };
    }),

  verifyAgent: adminQuery
    .input(z.object({ id: z.number(), verified: z.boolean() }))
    .mutation(async ({ input }) => {
      await verifyAgent(input.id, input.verified);
      return { success: true };
    }),

  listings: adminQuery.query(() =>
    findProperties({ limit: 100, status: undefined })
  ),

  updateListingStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["available", "sold", "rented", "pending", "rejected"]),
        isFeatured: z.number().optional(),
        isVerified: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateProperty(id, data);
      return { success: true };
    }),

  deleteListing: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteProperty(input.id);
      return { success: true };
    }),

  reports: adminQuery.query(() => findAllReports()),

  updateReport: adminQuery
    .input(z.object({ id: z.number(), status: z.enum(["open", "resolved", "dismissed"]) }))
    .mutation(async ({ input }) => {
      await updateReportStatus(input.id, input.status);
      return { success: true };
    }),

  submitReport: authedQuery
    .input(
      z.object({
        propertyId: z.number(),
        reason: z.enum(["spam", "fraud", "wrong_info", "sold", "other"]),
        details: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await createReport({ ...input, reporterId: ctx.user.id });
      return { id };
    }),
});
