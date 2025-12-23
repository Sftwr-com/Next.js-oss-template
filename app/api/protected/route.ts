import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "You must be logged in to access this endpoint",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "This is a protected API endpoint - authentication required",
    timestamp: new Date().toISOString(),
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    session: {
      expiresAt: session.session.expiresAt,
    },
  });
}
