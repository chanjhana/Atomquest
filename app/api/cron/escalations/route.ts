import { NextResponse } from "next/server";
import { runEscalationCheck } from "@/lib/services/escalations";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await runEscalationCheck();
  return NextResponse.json(result);
}
