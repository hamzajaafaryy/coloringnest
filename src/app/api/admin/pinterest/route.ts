import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listPinterestArtwork } from "@/lib/pinterest-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!await isAdminAuthenticated()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const q = (request.nextUrl.searchParams.get("q") || "").slice(0,75);
  const raw = Number(request.nextUrl.searchParams.get("page") || "1");
  const page = Number.isSafeInteger(raw) ? Math.min(10000,Math.max(1,raw)) : 1;
  try {
    const result = await listPinterestArtwork(q, page);
    return NextResponse.json(result, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Pinterest catalog failed", error);
    return NextResponse.json({error:"Unable to load published pages"},{status:500});
  }
}
