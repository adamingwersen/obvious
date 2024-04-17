import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default {
  schema: "./src/server/db/schema/*",
  driver: "pg",
  out: "./drizzle",
  dbCredentials: { connectionString: process.env.DATABASE_URL! },
} satisfies Config;
