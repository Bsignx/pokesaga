import "dotenv/config";

import { database, pg } from "./index";
import {
  accounts,
  cards,
  pokemonSets,
  profiles,
  userCollections,
  users,
} from "@/db/schema";

async function main() {
  const [user] = await database
    .insert(users)
    .values({
      email: "testing@example.com",
      emailVerified: undefined,
    })
    .onConflictDoNothing()
    .returning();

  const [account] = await database
    .insert(accounts)
    .values({
      accountType: "email",
      githubId: undefined,
      googleId: undefined,
      password:
        "39a491e82a8c8b7d85294ce9dde7d91c62895c87e78b289dabb2e55ae5e317ee9285738a2ff5deac5de0c8182592674b28f96882527cb6d90f988fef2b96d9c2",
      salt: "bAxwTKjE6LjYiH/tyYPin7bTGd+Gp2AlaWSJ10W6VDnDXuBeQLQYMHkxRPzuYQ7zfN9EjRE0aFxe5ECoI0TpWAeRWeoxaa/MDfc73dQ+dJA3o5t7lkzpoa8QVdT9DGkY95a24k4z1rGsROywa0VY1splQzPDPa1I7Lo7Sc6P6MU=",
      userId: user.id,
    })
    .onConflictDoNothing()
    .returning();

  const [profile] = await database
    .insert(profiles)
    .values({
      userId: user.id,
      displayName: "Test User",
    })
    .onConflictDoNothing()
    .returning();

  const sets = await database
    .insert(pokemonSets)
    .values([
      {
        name: "Surging Sparks",
        description:
          "A collection featuring electric-type Pokémon with dazzling abilities.",
        releaseDate: new Date("2023-01-15"),
      },
      {
        name: "Mystic Shadows",
        description: "A set that explores the mysterious and shadowy Pokémon.",
        releaseDate: new Date("2023-06-20"),
      },
    ])
    .onConflictDoNothing()
    .returning();

  const cardsData = await database
    .insert(cards)
    .values([
      {
        name: "Pikachu",
        setName: "Surging Sparks",
        cardNumber: "SS001",
        rarity: "Rare",
        type: "Electric",
        imageUrl: "https://example.com/images/pikachu.jpg",
        setId: sets[0].id,
      },
      {
        name: "Gengar",
        setName: "Mystic Shadows",
        cardNumber: "MS002",
        rarity: "Ultra Rare",
        type: "Ghost",
        imageUrl: "https://example.com/images/gengar.jpg",
        setId: sets[1].id,
      },
      {
        name: "Zapdos",
        setName: "Surging Sparks",
        cardNumber: "SS003",
        rarity: "Legendary",
        type: "Electric/Flying",
        imageUrl: "https://example.com/images/zapdos.jpg",
        setId: sets[0].id,
      },
    ])
    .returning();

  await database.insert(userCollections).values([
    {
      userId: user.id,
      cardId: cardsData[0].id,
      quantity: 2,
      customTags: [{ tag: "favorite", reason: "First Pokémon" }],
      notes: "This card is iconic!",
    },
    {
      userId: user.id,
      cardId: cardsData[1].id,
      quantity: 1,
      customTags: [{ tag: "trade", priority: 1 }],
      notes: "Looking to trade this rare card.",
    },
    {
      userId: user.id,
      cardId: cardsData[2].id,
      quantity: 3,
      customTags: [{ tag: "legendary", value: true }],
      notes: "A powerful addition to my collection!",
    },
  ]);

  await pg.end();
}

main();
