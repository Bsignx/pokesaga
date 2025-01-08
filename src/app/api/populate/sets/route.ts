import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { load } from "cheerio";
import { database } from "@/db";
import { PokemonSet, pokemonSets } from "@/db/schema";

const BASE_URL = "https://www.ligapokemon.com.br";

// api route responsible for fetching sets data and populating the database
export async function GET(request: Request) {
  const host = request.headers.get("host") || "";
  console.log({ host });
  if (!host.includes("localhost") && !host.includes("127.0.0.1")) {
    return NextResponse.json(
      { error: "This API route can only be accessed locally" },
      { status: 403 }
    );
  }

  try {
    const url = `${BASE_URL}/?view=cards/edicoes`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Switch to portuguese cards
    await page.waitForSelector('label[for="language_switch"]', {
      visible: true,
    });
    await page.click('label[for="language_switch"]');

    const html = await page.content();

    console.log({ html });
    const $ = load(html);

    const sets: PokemonSet[] = [];

    // press switch input with id language_switch to show only portuguese sets

    // wait for the page to load the sets

    await page.waitForSelector(".edition");

    // Select all editions dynamically
    $(".edition").each((_, element) => {
      const name = $(element).find(".edc-nm a").text().trim();
      const setHref = $(element).find(".edc-nm a").attr("href")?.trim() || "";
      const code = $(element).find(".edc-acronym").text().trim();

      sets.push({
        name,
        code,
        setHref,
        description: name,
        releaseDate: new Date(),
        imageUrl: null,
      });
    });

    await database
      .insert(pokemonSets)
      .values(sets)
      .onConflictDoNothing()
      .execute();

    await browser.close();

    return NextResponse.json({ sets }, { status: 200 });
  } catch (error) {
    console.error("Error extracting sets:", error);
    return NextResponse.json(
      { error: "Failed to extract sets" },
      { status: 500 }
    );
  }
}
