import { NextResponse } from "next/server";
import { getReportRowsData } from "@/lib/services/live-data";
import { toCsv } from "@/lib/services/reports";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department") ?? undefined;
  const quarter = searchParams.get("quarter") ?? undefined;
  const csv = toCsv(await getReportRowsData({ department, quarter }));
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="achievement-report.csv"'
    }
  });
}
