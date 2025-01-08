import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { load } from "cheerio";
import { database } from "@/db";
import { cards, pokemonSets, Card } from "@/db/schema";

const BASE_URL = "https://www.ligapokemon.com.br";

// api route responsible for fetching cards data by set and populating the database
export async function GET(request: Request) {
  const host = request.headers.get("host") || "";
  if (!host.includes("localhost") && !host.includes("127.0.0.1")) {
    return NextResponse.json(
      { error: "This API route can only be accessed locally" },
      { status: 403 }
    );
  }

  try {
    // get cards sets from database
    const sets = await database.select().from(pokemonSets).execute();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const summaryCardList = [] as {
      name: string;
      link: string | null;
      set: string;
      setId: number;
    }[];

    // get cards links
    for (const set of sets.slice(0, 5)) {
      const url = `${BASE_URL}${set.setHref}`; // Construct the URL for each set

      await page.goto(url, { waitUntil: "networkidle2" });

      // Simulate scrolling
      let previousHeight = 0;
      while (true) {
        const currentHeight = await page.evaluate(
          () => document.body.scrollHeight
        );
        if (currentHeight === previousHeight) break;

        previousHeight = currentHeight;
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight)
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust delay if necessary
      }

      // Extract cards links
      const html = await page.content();

      const $ = load(html);

      $(".card-item").each((_, element) => {
        const cardName = $(element).find(".invisible-label b").text().trim();

        const cardLink = $(element).find(".main-link-card").attr("href");

        summaryCardList.push({
          name: cardName,
          set: set.name,
          setId: set.id,
          link: cardLink ? `${BASE_URL}${cardLink}` : null, // Replace with the actual base URL
        });
      });
    }
    console.log({
      cardsLength: summaryCardList.length,
    });

    const cardsData: Card[] = [];

    // navigate to each card link and extract card details
    for (const summaryCard of summaryCardList) {
      if (!summaryCard.link) continue;

      await page.goto(`${summaryCard.link}`, { waitUntil: "networkidle2" });

      const html = await page.content();
      const $ = load(html);

      // Extract card details
      const cardData: Card = {
        name: $(".item-name").text().trim().split("(")[0].trim(), // Abismo da Área Zero (182/187)
        englishName: $(".item-name-en").text().trim() || null, // Area Zero Underdepths
        imageUrl: $("#featuredImage").attr("src")?.trim() || null, // https://www.ligapokemon.com.br/images/cards/ptbr/182-187.jpg
        rarity: $("#details-screen-rarity").text().trim() || null, // Comum (SV8A)
        type:
          $(".container-details:contains('Tipo') span:nth-child(2)")
            .text()
            .trim() || null, // Trainer – Stadium
        setName: summaryCard.set || null,
        cardNumber:
          $(".item-name").text().trim().split(")")[0].split("(")[1] || null,
        subtype: null,
        setId: summaryCard.setId,
      };

      cardsData.push(cardData);
    }

    // Save card data to the database
    console.log({ cardsData });
    await database
      .insert(cards)
      .values(cardsData)
      .onConflictDoNothing()
      .execute();

    await browser.close();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error extracting cards:", error);
    return NextResponse.json(
      { error: "Failed to extract cards" },
      { status: 500 }
    );
  }
}
