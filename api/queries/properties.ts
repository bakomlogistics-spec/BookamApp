import { getDb } from "./connection";
import { properties, propertyImages } from "@db/schema";
import { eq, and, gte, lte, sql, desc, asc } from "drizzle-orm";

export async function findPropertyById(id: number) {
  const db = getDb();
  const rows = await db.query.properties.findMany({
    where: eq(properties.id, id),
    with: {
      owner: true,
      images: true,
    },
    limit: 1,
  });
  return rows[0] ?? null;
}

export async function findProperties(filters: {
  listingType?: "sale" | "rent";
  propertyType?: "apartment" | "house" | "villa" | "land" | "commercial" | "office" | "studio";
  city?: string;
  region?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: number;
  parking?: number;
  petFriendly?: number;
  waterAvailable?: number;
  electricityAvailable?: number;
  status?: "available" | "sold" | "rented" | "pending" | "rejected";
  isFeatured?: number;
  isVerified?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const db = getDb();
  const conditions = [];

  if (filters.listingType) {
    conditions.push(eq(properties.listingType, filters.listingType));
  }
  if (filters.propertyType) {
    conditions.push(eq(properties.propertyType, filters.propertyType));
  }
  if (filters.city) {
    conditions.push(eq(properties.city, filters.city));
  }
  if (filters.region) {
    conditions.push(eq(properties.region, filters.region));
  }
  if (filters.neighborhood) {
    conditions.push(eq(properties.neighborhood, filters.neighborhood));
  }
  if (filters.minPrice !== undefined) {
    conditions.push(gte(properties.price, String(filters.minPrice)));
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(properties.price, String(filters.maxPrice)));
  }
  if (filters.bedrooms !== undefined) {
    conditions.push(gte(properties.bedrooms, filters.bedrooms));
  }
  if (filters.bathrooms !== undefined) {
    conditions.push(gte(properties.bathrooms, filters.bathrooms));
  }
  if (filters.furnished !== undefined) {
    conditions.push(eq(properties.furnished, filters.furnished));
  }
  if (filters.parking !== undefined) {
    conditions.push(eq(properties.parking, filters.parking));
  }
  if (filters.petFriendly !== undefined) {
    conditions.push(eq(properties.petFriendly, filters.petFriendly));
  }
  if (filters.waterAvailable !== undefined) {
    conditions.push(eq(properties.waterAvailable, filters.waterAvailable));
  }
  if (filters.electricityAvailable !== undefined) {
    conditions.push(eq(properties.electricityAvailable, filters.electricityAvailable));
  }
  if (filters.status) {
    conditions.push(eq(properties.status, filters.status));
  } else {
    conditions.push(eq(properties.status, "available"));
  }
  if (filters.isFeatured !== undefined) {
    conditions.push(eq(properties.isFeatured, filters.isFeatured));
  }
  if (filters.isVerified !== undefined) {
    conditions.push(eq(properties.isVerified, filters.isVerified));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderBy =
    filters.sortBy === "price"
      ? filters.sortOrder === "asc"
        ? asc(properties.price)
        : desc(properties.price)
      : filters.sortBy === "date"
        ? filters.sortOrder === "asc"
          ? asc(properties.createdAt)
          : desc(properties.createdAt)
        : desc(properties.createdAt);

  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  const rows = await db.query.properties.findMany({
    where: whereClause,
    with: { images: true, owner: { columns: { id: true, name: true, email: true, phone: true, avatar: true, isVerifiedAgent: true } } },
    orderBy,
    limit,
    offset,
  });

  return rows;
}

export async function countProperties(filters: {
  listingType?: "sale" | "rent";
  propertyType?: "apartment" | "house" | "villa" | "land" | "commercial" | "office" | "studio";
  city?: string;
  region?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: number;
  parking?: number;
  petFriendly?: number;
  waterAvailable?: number;
  electricityAvailable?: number;
  status?: "available" | "sold" | "rented" | "pending" | "rejected";
  isFeatured?: number;
  isVerified?: number;
}) {
  const db = getDb();
  const conditions = [];

  if (filters.listingType) {
    conditions.push(eq(properties.listingType, filters.listingType));
  }
  if (filters.propertyType) {
    conditions.push(eq(properties.propertyType, filters.propertyType));
  }
  if (filters.city) {
    conditions.push(eq(properties.city, filters.city));
  }
  if (filters.region) {
    conditions.push(eq(properties.region, filters.region));
  }
  if (filters.neighborhood) {
    conditions.push(eq(properties.neighborhood, filters.neighborhood));
  }
  if (filters.minPrice !== undefined) {
    conditions.push(gte(properties.price, String(filters.minPrice)));
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(properties.price, String(filters.maxPrice)));
  }
  if (filters.bedrooms !== undefined) {
    conditions.push(gte(properties.bedrooms, filters.bedrooms));
  }
  if (filters.bathrooms !== undefined) {
    conditions.push(gte(properties.bathrooms, filters.bathrooms));
  }
  if (filters.furnished !== undefined) {
    conditions.push(eq(properties.furnished, filters.furnished));
  }
  if (filters.parking !== undefined) {
    conditions.push(eq(properties.parking, filters.parking));
  }
  if (filters.petFriendly !== undefined) {
    conditions.push(eq(properties.petFriendly, filters.petFriendly));
  }
  if (filters.waterAvailable !== undefined) {
    conditions.push(eq(properties.waterAvailable, filters.waterAvailable));
  }
  if (filters.electricityAvailable !== undefined) {
    conditions.push(eq(properties.electricityAvailable, filters.electricityAvailable));
  }
  if (filters.status) {
    conditions.push(eq(properties.status, filters.status));
  } else {
    conditions.push(eq(properties.status, "available"));
  }
  if (filters.isFeatured !== undefined) {
    conditions.push(eq(properties.isFeatured, filters.isFeatured));
  }
  if (filters.isVerified !== undefined) {
    conditions.push(eq(properties.isVerified, filters.isVerified));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db.select({ count: sql<number>`count(*)` }).from(properties).where(whereClause);
  return result[0]?.count ?? 0;
}

export async function createProperty(data: {
  title: string;
  description?: string;
  price: string;
  pricePeriod: "monthly" | "yearly" | "one_time";
  listingType: "sale" | "rent";
  propertyType: "apartment" | "house" | "villa" | "land" | "commercial" | "office" | "studio";
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: string;
  furnished?: number;
  parking?: number;
  petFriendly?: number;
  waterAvailable?: number;
  electricityAvailable?: number;
  region: string;
  city: string;
  neighborhood?: string;
  landmark?: string;
  address?: string;
  amenities?: string[];
  contactPhone?: string;
  contactEmail?: string;
  ownerId: number;
}) {
  const db = getDb();
  const [{ id }] = await db.insert(properties).values({
    ...data,
    status: "pending",
    amenities: data.amenities ? JSON.stringify(data.amenities) : null,
  }).$returningId();
  return id;
}

export async function updateProperty(
  id: number,
  data: Partial<{
    title: string;
    description: string;
    price: string;
    pricePeriod: "monthly" | "yearly" | "one_time";
    listingType: "sale" | "rent";
    propertyType: "apartment" | "house" | "villa" | "land" | "commercial" | "office" | "studio";
    status: "available" | "sold" | "rented" | "pending" | "rejected";
    bedrooms: number;
    bathrooms: number;
    areaSqm: string;
    furnished: number;
    parking: number;
    petFriendly: number;
    waterAvailable: number;
    electricityAvailable: number;
    region: string;
    city: string;
    neighborhood: string;
    landmark: string;
    address: string;
    amenities: string[];
    isFeatured: number;
    isVerified: number;
    contactPhone: string;
    contactEmail: string;
  }>
) {
  const db = getDb();
  const updateData: Record<string, unknown> = { ...data };
  if (data.amenities) {
    updateData.amenities = JSON.stringify(data.amenities);
  }
  await db.update(properties).set(updateData).where(eq(properties.id, id));
}

export async function deleteProperty(id: number) {
  const db = getDb();
  await db.delete(properties).where(eq(properties.id, id));
}

export async function incrementPropertyViews(id: number) {
  const db = getDb();
  await db.update(properties).set({ viewCount: sql`${properties.viewCount} + 1` }).where(eq(properties.id, id));
}

export async function findPropertiesByOwner(ownerId: number) {
  const db = getDb();
  return db.query.properties.findMany({
    where: eq(properties.ownerId, ownerId),
    with: { images: true },
    orderBy: desc(properties.createdAt),
  });
}

export async function addPropertyImage(propertyId: number, url: string, isPrimary = false) {
  const db = getDb();
  await db.insert(propertyImages).values({ propertyId, url, isPrimary: isPrimary ? 1 : 0 });
}

export async function removePropertyImage(imageId: number) {
  const db = getDb();
  await db.delete(propertyImages).where(eq(propertyImages.id, imageId));
}

export async function findSimilarProperties(_propertyId: number, city: string, limit = 4) {
  const db = getDb();
  return db.query.properties.findMany({
    where: and(eq(properties.city, city), eq(properties.status, "available")),
    with: { images: true },
    orderBy: desc(properties.isFeatured),
    limit,
  });
}
