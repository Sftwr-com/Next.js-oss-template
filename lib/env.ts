import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    NEON_API_KEY: z.string().min(1),
    NEON_PROJECT_ID: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    ENABLE_SIGNUP_WHITELIST: z
      .string()
      .optional()
      .default("false")
      .transform((val) => val === "true"),
    SIGNUP_WHITELIST: z.string().optional().default(""),
  },
  client: {
    // Add client-side env vars here with NEXT_PUBLIC_ prefix
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NEON_API_KEY: process.env.NEON_API_KEY,
    NEON_PROJECT_ID: process.env.NEON_PROJECT_ID,
    NODE_ENV: process.env.NODE_ENV,
    ENABLE_SIGNUP_WHITELIST: process.env.ENABLE_SIGNUP_WHITELIST,
    SIGNUP_WHITELIST: process.env.SIGNUP_WHITELIST,
  },
});
