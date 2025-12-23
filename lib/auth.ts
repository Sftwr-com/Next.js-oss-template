import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { env } from "./env";
import { isEmailWhitelisted, getWhitelistError } from "./whitelist";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  async onRequest(request: { body?: unknown; url: string }) {
    if (request.body && typeof request.body === "object" && "email" in request.body) {
      const email = request.body.email as string;
      if (request.url.includes("/sign-up") && !isEmailWhitelisted(email)) {
        throw new Error(getWhitelistError());
      }
    }
  },
});
