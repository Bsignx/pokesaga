import { NextResponse } from "next/server";
import { scrapeCardPrice } from "@/lib/scraper";

export async function GET(
  request: Request,
  { params }: { params: { cardSlug: string } }
) {
  const { cardSlug } = params;

  if (!cardSlug) {
    return NextResponse.json({ error: "Invalid card slug" }, { status: 400 });
  }

  const price = await scrapeCardPrice(cardSlug);

  if (price !== null) {
    return NextResponse.json({ success: true, price }, { status: 200 });
  }

  return NextResponse.json({ error: "Price not found" }, { status: 404 });
}
