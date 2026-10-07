import { getDb } from "./connection";
import { inquiries } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function findInquiriesByOwner(ownerId: number) {
  const db = getDb();
  return db.query.inquiries.findMany({
    where: eq(inquiries.ownerId, ownerId),
    with: { property: true, sender: true },
    orderBy: desc(inquiries.createdAt),
  });
}

export async function findInquiriesBySender(senderId: number) {
  const db = getDb();
  return db.query.inquiries.findMany({
    where: eq(inquiries.senderId, senderId),
    with: { property: true },
    orderBy: desc(inquiries.createdAt),
  });
}

export async function createInquiry(data: {
  propertyId: number;
  senderId: number;
  ownerId: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const db = getDb();
  const [{ id }] = await db.insert(inquiries).values(data).$returningId();
  return id;
}

export async function updateInquiryStatus(id: number, status: "new" | "read" | "replied" | "archived") {
  const db = getDb();
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
}
