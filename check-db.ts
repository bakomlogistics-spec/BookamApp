import { getDb } from "./api/queries/connection";
import { properties, locations, users } from "./db/schema";

async function check() {
  const db = getDb();
  const props = await db.select().from(properties).limit(1);
  const locs = await db.select().from(locations).limit(1);
  const usrs = await db.select().from(users).limit(1);
  console.log("Properties:", props.length);
  console.log("Locations:", locs.length);
  console.log("Users:", usrs.length);
  if (props.length > 0) console.log("First prop:", props[0].title);
}
check();
