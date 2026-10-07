import { getDb } from "./connection";
import { reports, properties, users } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function createReport(data: {
  propertyId: number;
  reporterId: number;
  reason: "spam" | "fraud" | "wrong_info" | "sold" | "other";
  details?: string;
}) {
  const db = getDb();
  const [{ id }] = await db.insert(reports).values(data).$returningId();
  return id;
}

export async function findAllReports() {
  const db = getDb();
  return db.query.reports.findMany({
    with: { property: true, reporter: true },
    orderBy: desc(reports.createdAt),
  });
}

export async function updateReportStatus(id: number, status: "open" | "resolved" | "dismissed") {
  const db = getDb();
  await db.update(reports).set({ status }).where(eq(reports.id, id));
}

export async function getAdminStats() {
  const db = getDb();
  const [propertyCount] = await db.select({ count: sql<number>`count(*)` }).from(properties);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [pendingCount] = await db.select({ count: sql<number>`count(*)` }).from(properties).where(eq(properties.status, "pending"));
  const [reportCount] = await db.select({ count: sql<number>`count(*)` }).from(reports).where(eq(reports.status, "open"));
  const [featuredCount] = await db.select({ count: sql<number>`count(*)` }).from(properties).where(eq(properties.isFeatured, 1));
  const [verifiedCount] = await db.select({ count: sql<number>`count(*)` }).from(properties).where(eq(properties.isVerified, 1));

  return {
    totalProperties: propertyCount?.count ?? 0,
    totalUsers: userCount?.count ?? 0,
    pendingListings: pendingCount?.count ?? 0,
    openReports: reportCount?.count ?? 0,
    featuredListings: featuredCount?.count ?? 0,
    verifiedListings: verifiedCount?.count ?? 0,
  };
}

export async function findAllUsers() {
  const db = getDb();
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(id: number, role: "user" | "admin") {
  const db = getDb();
  await db.update(users).set({ role }).where(eq(users.id, id));
}

export async function verifyAgent(id: number, verified: boolean) {
  const db = getDb();
  await db.update(users).set({ isVerifiedAgent: verified ? 1 : 0 }).where(eq(users.id, id));
}
