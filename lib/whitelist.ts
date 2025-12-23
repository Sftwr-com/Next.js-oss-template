import { env } from "./env";

export function isEmailWhitelisted(email: string): boolean {
  if (!env.ENABLE_SIGNUP_WHITELIST) {
    return true;
  }

  if (!env.SIGNUP_WHITELIST) {
    return false;
  }

  const whitelist = env.SIGNUP_WHITELIST.split(",").map((e) => e.trim().toLowerCase());
  const normalizedEmail = email.toLowerCase();

  return whitelist.some((whitelistedEmail) => {
    if (whitelistedEmail.startsWith("@")) {
      const domain = normalizedEmail.split("@")[1];
      return domain === whitelistedEmail.slice(1);
    }

    return normalizedEmail === whitelistedEmail;
  });
}

export function getWhitelistError(): string {
  return "Your email is not authorized to create an account. Please contact an administrator.";
}
