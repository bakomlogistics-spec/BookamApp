import { relations } from "drizzle-orm";
import { users, properties, propertyImages, favorites, inquiries, reports } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  favorites: many(favorites),
  inquiriesSent: many(inquiries, { relationName: "sender" }),
  inquiriesReceived: many(inquiries, { relationName: "owner" }),
  reports: many(reports),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(users, { fields: [properties.ownerId], references: [users.id] }),
  images: many(propertyImages),
  favorites: many(favorites),
  inquiries: many(inquiries),
  reports: many(reports),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  property: one(properties, {
    fields: [propertyImages.propertyId],
    references: [properties.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  property: one(properties, {
    fields: [favorites.propertyId],
    references: [properties.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  property: one(properties, {
    fields: [inquiries.propertyId],
    references: [properties.id],
  }),
  sender: one(users, { fields: [inquiries.senderId], references: [users.id] }),
  owner: one(users, { fields: [inquiries.ownerId], references: [users.id] }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  property: one(properties, {
    fields: [reports.propertyId],
    references: [properties.id],
  }),
  reporter: one(users, { fields: [reports.reporterId], references: [users.id] }),
}));
