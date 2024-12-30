import puppeteer from "puppeteer";
import { load } from "cheerio";

const BASE_URL = "https://www.ligapokemon.com.br";

export interface CardPrices {
  normal: {
    min: number | null;
    medium: number | null;
    max: number | null;
  };
  foil: {
    min: number | null;
    medium: number | null;
    max: number | null;
  };
}

// Helper function to parse prices
const parsePrice = (priceText: string): number | null => {
  const sanitizedText = priceText
    .replace("R$", "")
    .replace(".", "")
    .replace(",", ".")
    .trim();
  const price = parseFloat(sanitizedText);
  return isNaN(price) ? null : price;
};

export async function scrapeCardPrice(
  cardSlug: string
): Promise<CardPrices | null> {
  try {
    const url = `${BASE_URL}/?view=cards/card&card=${cardSlug}`;
    console.log({ url });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const html = await page.content();
    const $ = load(html);

    // Extract normal prices
    const normalMin = parsePrice(
      $("#container-price-mkp-card .container-price-mkp")
        .first()
        .find(".min .price")
        .text()
    );
    const normalMedium = parsePrice(
      $("#container-price-mkp-card .container-price-mkp")
        .first()
        .find(".medium .price")
        .text()
    );
    const normalMax = parsePrice(
      $("#container-price-mkp-card .container-price-mkp")
        .first()
        .find(".max .price")
        .text()
    );

    // Extract foil prices
    const foilMin = parsePrice(
      $("#container-price-mkp-card .container-price-mkp")
        .last()
        .find(".min .price")
        .text()
    );
    const foilMedium = parsePrice(
      $("#container-price-mkp-card .container-price-mkp")
        .last()
        .find(".medium .price")
        .text()
    );
    const foilMax = parsePrice(
      $("#container-price-mkp-card .container-price-mkp")
        .last()
        .find(".max .price")
        .text()
    );

    await browser.close();

    return {
      normal: { min: normalMin, medium: normalMedium, max: normalMax },
      foil: { min: foilMin, medium: foilMedium, max: foilMax },
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
