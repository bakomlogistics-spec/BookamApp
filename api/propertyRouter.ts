import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import {
  findPropertyById,
  findProperties,
  countProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  incrementPropertyViews,
  findPropertiesByOwner,
  addPropertyImage,
  removePropertyImage,
  findSimilarProperties,
} from "./queries/properties";

export const propertyRouter = createRouter({
  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const property = await findPropertyById(input.id);
      if (property) {
        await incrementPropertyViews(input.id);
      }
      return property;
    }),

  search: publicQuery
    .input(
      z.object({
        listingType: z.enum(["sale", "rent"]).optional(),
        propertyType: z.enum(["apartment", "house", "villa", "land", "commercial", "office", "studio"]).optional(),
        city: z.string().optional(),
        region: z.string().optional(),
        neighborhood: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        furnished: z.number().optional(),
        parking: z.number().optional(),
        petFriendly: z.number().optional(),
        waterAvailable: z.number().optional(),
        electricityAvailable: z.number().optional(),
        isFeatured: z.number().optional(),
        isVerified: z.number().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const items = await findProperties(input);
      const total = await countProperties(input);
      return { items, total };
    }),

  listFeatured: publicQuery.query(() =>
    findProperties({ isFeatured: 1, status: "available", limit: 6 })
  ),

  listByOwner: authedQuery.query(({ ctx }) =>
    findPropertiesByOwner(ctx.user.id)
  ),

  create: authedQuery
    .input(
      z.object({
        title: z.string().min(3).max(255),
        description: z.string().optional(),
        price: z.string(),
        pricePeriod: z.enum(["monthly", "yearly", "one_time"]).default("one_time"),
        listingType: z.enum(["sale", "rent"]),
        propertyType: z.enum(["apartment", "house", "villa", "land", "commercial", "office", "studio"]),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        areaSqm: z.string().optional(),
        furnished: z.number().optional(),
        parking: z.number().optional(),
        petFriendly: z.number().optional(),
        waterAvailable: z.number().optional(),
        electricityAvailable: z.number().optional(),
        region: z.string().min(1),
        city: z.string().min(1),
        neighborhood: z.string().optional(),
        landmark: z.string().optional(),
        address: z.string().optional(),
        amenities: z.array(z.string()).optional(),
        contactPhone: z.string().optional(),
        contactEmail: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await createProperty({ ...input, ownerId: ctx.user.id });
      return { id };
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(3).max(255).optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        pricePeriod: z.enum(["monthly", "yearly", "one_time"]).optional(),
        listingType: z.enum(["sale", "rent"]).optional(),
        propertyType: z.enum(["apartment", "house", "villa", "land", "commercial", "office", "studio"]).optional(),
        status: z.enum(["available", "sold", "rented", "pending", "rejected"]).optional(),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        areaSqm: z.string().optional(),
        furnished: z.number().optional(),
        parking: z.number().optional(),
        petFriendly: z.number().optional(),
        waterAvailable: z.number().optional(),
        electricityAvailable: z.number().optional(),
        region: z.string().optional(),
        city: z.string().optional(),
        neighborhood: z.string().optional(),
        landmark: z.string().optional(),
        address: z.string().optional(),
        amenities: z.array(z.string()).optional(),
        contactPhone: z.string().optional(),
        contactEmail: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const existing = await findPropertyById(id);
      if (!existing || existing.ownerId !== ctx.user.id) {
        throw new Error("Not authorized to update this property");
      }
      await updateProperty(id, data);
      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await findPropertyById(input.id);
      if (!existing || existing.ownerId !== ctx.user.id) {
        throw new Error("Not authorized to delete this property");
      }
      await deleteProperty(input.id);
      return { success: true };
    }),

  addImage: authedQuery
    .input(z.object({ propertyId: z.number(), url: z.string(), isPrimary: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await findPropertyById(input.propertyId);
      if (!existing || existing.ownerId !== ctx.user.id) {
        throw new Error("Not authorized");
      }
      await addPropertyImage(input.propertyId, input.url, input.isPrimary);
      return { success: true };
    }),

  removeImage: authedQuery
    .input(z.object({ imageId: z.number(), propertyId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await findPropertyById(input.propertyId);
      if (!existing || existing.ownerId !== ctx.user.id) {
        throw new Error("Not authorized");
      }
      await removePropertyImage(input.imageId);
      return { success: true };
    }),

  similar: publicQuery
    .input(z.object({ propertyId: z.number(), city: z.string() }))
    .query(({ input }) => findSimilarProperties(input.propertyId, input.city)),
});
