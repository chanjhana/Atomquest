import { NextResponse } from "next/server";
import { runEscalationCheck } from "@/lib/services/escalations";

export async function GET() {
  const result = await runEscalationCheck();
  return NextResponse.json(result);
}
