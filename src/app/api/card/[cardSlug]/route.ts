import { NextResponse } from "next/server";
import { scrapeCardPrice } from "@/lib/scraper";
import { getCachedPrice, setCachedPrice } from "@/lib/cache";

export async function GET(
  request: Request,
  { params }: { params: { cardSlug: string } }
) {
  const { cardSlug } = params;

  if (!cardSlug) {
    return NextResponse.json({ error: "Invalid card slug" }, { status: 400 });
  }

  // Check cache first
  let cachedPrice = getCachedPrice(cardSlug);
  console.log({ cachedPrice });
  if (cachedPrice !== null) {
    return NextResponse.json({
      cardSlug,
      priceData: cachedPrice,
      source: "cache",
    });
  }

  // Scrape price if not cached
  const priceData = await scrapeCardPrice(cardSlug);
  console.log({ priceData });
  if (priceData !== null) {
    // Cache the scraped price data for 24 hours
    setCachedPrice(cardSlug, priceData);
    return NextResponse.json({ cardSlug, priceData, source: "scraped" });
  }

  return NextResponse.json({ error: "Price not found" }, { status: 404 });
}
