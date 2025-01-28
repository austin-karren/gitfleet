import { type Config } from "drizzle-kit";

import { env } from "@gitfleet/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["gitfleet_*"],
} satisfies Config;
