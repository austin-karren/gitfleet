import { type Config } from "drizzle-kit";

import { env } from "@gitfleet/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  // comment out turso driver to use a local db.sqlite file
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  tablesFilter: ["gitfleet_*"],
} satisfies Config;
