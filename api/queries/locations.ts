import { getDb } from "./connection";
import { locations } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function findAllLocations() {
  const db = getDb();
  return db.select().from(locations).orderBy(desc(locations.listingCount));
}

export async function findPopularLocations(limit = 8) {
  const db = getDb();
  return db.select().from(locations).orderBy(desc(locations.listingCount)).limit(limit);
}

export async function findLocationsByCity(city: string) {
  const db = getDb();
  return db.select().from(locations).where(eq(locations.city, city));
}

export async function findCities() {
  const db = getDb();
  const rows = await db.select({ city: locations.city, region: locations.region }).from(locations).groupBy(locations.city, locations.region);
  return rows;
}

export async function updateLocationListingCount(city: string) {
  const db = getDb();
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(locations).where(eq(locations.city, city));
  const count = countResult[0]?.count ?? 0;
  await db.update(locations).set({ listingCount: count }).where(eq(locations.city, city));
}
