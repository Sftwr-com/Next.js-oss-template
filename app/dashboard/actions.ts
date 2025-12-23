"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const headersList = await headers();
    console.log(headersList);
    console.log(headersList.get("x-pathname"));
    const pathname = headersList.get("x-pathname") || "/dashboard";
    redirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  return session.user;
}
