import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema/index";
import { VercelPool } from "@vercel/postgres";

export { schema };

export * from "drizzle-orm";

export const db = drizzle(
  new VercelPool({ connectionString: process.env.DATABASE_URL }),
  {
    schema,
  },
);
