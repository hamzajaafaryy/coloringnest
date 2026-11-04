import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPinterestArtwork } from "@/lib/pinterest-data";
import { fetchPinterestArtworkImage, renderPinterestPin } from "@/lib/pinterest-render";
import { isPinTemplate, pinArtworkForSheet } from "@/lib/pinterest-studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({error:"Unauthorized"},{status:401});
  try {
    const body = await request.text();
    if (body.length > 3000) return NextResponse.json({error:"Request too long"},{status:413});
    const data: unknown = JSON.parse(body);
    if (typeof data !== "object" || data === null) return NextResponse.json({error:"Invalid request"},{status:400});
    const input = data as Record<string, unknown>;
    const id = Number(input.id);
    const template = input.template;
    const sheetId = typeof input.sheetId === "string" ? input.sheetId.slice(0,75) : "cover";
    const headline = typeof input.headline === "string" ? input.headline.trim().slice(0,90) : "";
    if (!Number.isSafeInteger(id) || id <= 0 || !isPinTemplate(template) || !headline) {
      return NextResponse.json({error:"Choose a valid page, template and headline"},{status:400});
    }
    const item = await getPinterestArtwork(id);
    if (!item) return NextResponse.json({error:"Published artwork not found"},{status:404});
    if (sheetId !== "cover" && !item.sheets.some(sheet => sheet.id === sheetId)) {
      return NextResponse.json({error:"Unknown collection sheet"},{status:400});
    }
    const selected = pinArtworkForSheet(item, sheetId);
    if (!selected.imageUrl) return NextResponse.json({error:"This page needs a raster cover image first"},{status:422});
    const image = await fetchPinterestArtworkImage(selected.imageUrl);
    const result = await renderPinterestPin({
      template, headline, category: item.categoryName, image,
    });
    return new Response(new Uint8Array(result), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="craftcoloring-pin.png"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Pinterest render failed", error);
    return NextResponse.json({error:"Unable to render this image. Check the artwork file and retry."},{status:500});
  }
}
