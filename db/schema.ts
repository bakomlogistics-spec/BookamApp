import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
  decimal,
  index,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  phone: varchar("phone", { length: 50 }),
  bio: text("bio"),
  city: varchar("city", { length: 100 }),
  region: varchar("region", { length: 100 }),
  isVerifiedAgent: int("isVerifiedAgent", { unsigned: true }).default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const properties = mysqlTable(
  "properties",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    pricePeriod: mysqlEnum("pricePeriod", ["monthly", "yearly", "one_time"])
      .default("one_time")
      .notNull(),
    listingType: mysqlEnum("listingType", ["sale", "rent"]).notNull(),
    propertyType: mysqlEnum("propertyType", [
      "apartment",
      "house",
      "villa",
      "land",
      "commercial",
      "office",
      "studio",
    ]).notNull(),
    status: mysqlEnum("status", [
      "available",
      "sold",
      "rented",
      "pending",
      "rejected",
    ])
      .default("pending")
      .notNull(),
    bedrooms: int("bedrooms", { unsigned: true }).default(0),
    bathrooms: int("bathrooms", { unsigned: true }).default(0),
    areaSqm: decimal("areaSqm", { precision: 10, scale: 2 }),
    furnished: int("furnished", { unsigned: true }).default(0),
    parking: int("parking", { unsigned: true }).default(0),
    petFriendly: int("petFriendly", { unsigned: true }).default(0),
    waterAvailable: int("waterAvailable", { unsigned: true }).default(1),
    electricityAvailable: int("electricityAvailable", { unsigned: true }).default(1),
    region: varchar("region", { length: 100 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    neighborhood: varchar("neighborhood", { length: 100 }),
    landmark: varchar("landmark", { length: 200 }),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    address: text("address"),
    amenities: json("amenities"),
    isFeatured: int("isFeatured", { unsigned: true }).default(0),
    isVerified: int("isVerified", { unsigned: true }).default(0),
    viewCount: int("viewCount", { unsigned: true }).default(0),
    ownerId: bigint("ownerId", { mode: "number", unsigned: true }).notNull(),
    contactPhone: varchar("contactPhone", { length: 50 }),
    contactEmail: varchar("contactEmail", { length: 320 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    cityIdx: index("city_idx").on(table.city),
    regionIdx: index("region_idx").on(table.region),
    priceIdx: index("price_idx").on(table.price),
    typeIdx: index("type_idx").on(table.listingType),
    statusIdx: index("status_idx").on(table.status),
    ownerIdx: index("owner_idx").on(table.ownerId),
    featuredIdx: index("featured_idx").on(table.isFeatured),
    verifiedIdx: index("verified_idx").on(table.isVerified),
  })
);

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

export const propertyImages = mysqlTable(
  "propertyImages",
  {
    id: serial("id").primaryKey(),
    propertyId: bigint("propertyId", { mode: "number", unsigned: true }).notNull(),
    url: text("url").notNull(),
    order: int("order", { unsigned: true }).default(0),
    isPrimary: int("isPrimary", { unsigned: true }).default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    propertyIdx: index("prop_img_prop_idx").on(table.propertyId),
  })
);

export type PropertyImage = typeof propertyImages.$inferSelect;
export type InsertPropertyImage = typeof propertyImages.$inferInsert;

export const favorites = mysqlTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    propertyId: bigint("propertyId", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userPropIdx: index("user_prop_idx").on(table.userId, table.propertyId),
  })
);

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

export const inquiries = mysqlTable(
  "inquiries",
  {
    id: serial("id").primaryKey(),
    propertyId: bigint("propertyId", { mode: "number", unsigned: true }).notNull(),
    senderId: bigint("senderId", { mode: "number", unsigned: true }).notNull(),
    ownerId: bigint("ownerId", { mode: "number", unsigned: true }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    message: text("message").notNull(),
    status: mysqlEnum("status", ["new", "read", "replied", "archived"])
      .default("new")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    propertyIdx: index("inquiry_prop_idx").on(table.propertyId),
    ownerIdx: index("inquiry_owner_idx").on(table.ownerId),
    senderIdx: index("inquiry_sender_idx").on(table.senderId),
  })
);

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

export const locations = mysqlTable(
  "locations",
  {
    id: serial("id").primaryKey(),
    region: varchar("region", { length: 100 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    neighborhood: varchar("neighborhood", { length: 100 }),
    displayName: varchar("displayName", { length: 200 }).notNull(),
    listingCount: int("listingCount", { unsigned: true }).default(0),
    imageUrl: text("imageUrl"),
  },
  (table) => ({
    cityIdx: index("loc_city_idx").on(table.city),
    regionIdx: index("loc_region_idx").on(table.region),
  })
);

export type Location = typeof locations.$inferSelect;
export type InsertLocation = typeof locations.$inferInsert;

export const reports = mysqlTable(
  "reports",
  {
    id: serial("id").primaryKey(),
    propertyId: bigint("propertyId", { mode: "number", unsigned: true }).notNull(),
    reporterId: bigint("reporterId", { mode: "number", unsigned: true }).notNull(),
    reason: mysqlEnum("reason", ["spam", "fraud", "wrong_info", "sold", "other"]).notNull(),
    details: text("details"),
    status: mysqlEnum("status", ["open", "resolved", "dismissed"])
      .default("open")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    propertyIdx: index("report_prop_idx").on(table.propertyId),
    reporterIdx: index("report_reporter_idx").on(table.reporterId),
  })
);

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;
