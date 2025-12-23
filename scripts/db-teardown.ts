import { sql } from "drizzle-orm";
import { db } from "../lib/db";

async function teardown() {
  console.log("Dropping all tables...");

  // Neon HTTP driver requires each command to be executed separately
  await db.execute(sql`DROP SCHEMA public CASCADE`);
  await db.execute(sql`CREATE SCHEMA public`);
  await db.execute(sql`GRANT ALL ON SCHEMA public TO postgres`);
  await db.execute(sql`GRANT ALL ON SCHEMA public TO public`);

  console.log("Database teardown complete!");
  process.exit(0);
}

teardown().catch((error) => {
  console.error("Teardown failed:", error);
  process.exit(1);
});
