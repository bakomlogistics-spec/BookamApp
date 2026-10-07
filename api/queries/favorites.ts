import { getDb } from "./connection";
import { favorites } from "@db/schema";
import { eq, and } from "drizzle-orm";

export async function findFavoritesByUser(userId: number) {
  const db = getDb();
  return db.query.favorites.findMany({
    where: eq(favorites.userId, userId),
    with: { property: { with: { images: true } } },
  });
}

export async function addFavorite(userId: number, propertyId: number) {
  const db = getDb();
  await db.insert(favorites).values({ userId, propertyId }).onDuplicateKeyUpdate({
    set: { userId, propertyId },
  });
}

export async function removeFavorite(userId: number, propertyId: number) {
  const db = getDb();
  await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)));
}

export async function isFavorite(userId: number, propertyId: number) {
  const db = getDb();
  const rows = await db.select().from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId))).limit(1);
  return rows.length > 0;
}
