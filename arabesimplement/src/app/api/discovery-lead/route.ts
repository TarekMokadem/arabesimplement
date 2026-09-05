import { NextResponse } from "next/server";
import { recordDiscoveryLead } from "@/lib/record-discovery-lead";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Requête invalide" },
      { status: 400 }
    );
  }

  const result = await recordDiscoveryLead(body);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
