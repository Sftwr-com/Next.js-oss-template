import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "This is a public API endpoint - no authentication required",
    timestamp: new Date().toISOString(),
    data: {
      version: "1.0.0",
      status: "healthy",
    },
  });
}
