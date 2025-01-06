import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["member", "admin"]);
export const accountTypeEnum = pgEnum("type", ["email", "google", "github"]);

export const users = pgTable("gf_user", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
});

export const accounts = pgTable(
  "gf_accounts",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountType: accountTypeEnum("accountType").notNull(),
    githubId: text("githubId").unique(),
    googleId: text("googleId").unique(),
    password: text("password"),
    salt: text("salt"),
  },
  (table) => [
    index("user_id_account_type_idx").on(table.userId, table.accountType),
  ]
);

export const magicLinks = pgTable(
  "gf_magic_links",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
  },
  (table) => [index("magic_links_token_idx").on(table.token)]
);

export const resetTokens = pgTable(
  "gf_reset_tokens",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
  },
  (table) => [index("reset_tokens_token_idx").on(table.token)]
);

export const verifyEmailTokens = pgTable(
  "gf_verify_email_tokens",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
  },
  (table) => [index("verify_email_tokens_token_idx").on(table.token)]
);

export const profiles = pgTable("gf_profile", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  displayName: text("displayName"),
  imageId: text("imageId"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
});

export const sessions = pgTable(
  "gf_session",
  {
    id: text("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)]
);

export const subscriptions = pgTable(
  "gf_subscriptions",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    stripeSubscriptionId: text("stripeSubscriptionId").notNull(),
    stripeCustomerId: text("stripeCustomerId").notNull(),
    stripePriceId: text("stripePriceId").notNull(),
    stripeCurrentPeriodEnd: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [
    index("subscriptions_stripe_subscription_id_idx").on(
      table.stripeSubscriptionId
    ),
  ]
);

// Add your own tables here

// Table: pokemon_sets
export const pokemonSets = pgTable("pokemon_sets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Surging Sparks"
  description: text("description"), // Optional description
  releaseDate: timestamp("release_date"), // Optional release date of the set
  createdAt: timestamp("created_at").defaultNow(),
});

export const pokemonSetsRelations = relations(pokemonSets, ({ many }) => ({
  cards: many(cards),
}));

// Table: cards
export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  setName: text("set_name"), // Additional set details
  cardNumber: text("card_number"),
  rarity: text("rarity"),
  type: text("type"),
  imageUrl: text("image_url"),
  setId: integer("set_id")
    .notNull()
    .references(() => pokemonSets.id), // Links to a Pokémon set
  createdAt: timestamp("created_at").defaultNow(),
});

export const cardsRelations = relations(cards, ({ one, many }) => ({
  pokemonSet: one(pokemonSets, {
    fields: [cards.setId],
    references: [pokemonSets.id],
  }),
  userCollections: many(userCollections),
}));

export const usersRelations = relations(users, ({ many }) => ({
  userCollections: many(userCollections),
}));

// Table: user_collections
export const userCollections = pgTable("user_collections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id), // Links to a user
  cardId: integer("card_id")
    .notNull()
    .references(() => cards.id), // Links to a card
  quantity: integer("quantity").notNull().default(1), // Number of this card in the user’s collection
  customTags: jsonb("custom_tags"), // Optional tags for the card
  notes: text("notes"), // Optional user notes about the card
  createdAt: timestamp("created_at").defaultNow(),
});

export const userCollectionsRelations = relations(
  userCollections,
  ({ one }) => ({
    user: one(users, {
      fields: [userCollections.userId],
      references: [users.id],
    }),
    card: one(cards, {
      fields: [userCollections.cardId],
      references: [cards.id],
    }),
  })
);

// delete this after you have added your own tables, this is just an example

export const following = pgTable(
  "gf_following",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    foreignUserId: serial("foreignUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("following_user_id_foreign_user_id_idx").on(
      table.userId,
      table.foreignUserId
    ),
  ]
);

/**
 * newsletters - although the emails for the newsletter are tracked in Resend, it's beneficial to also track
 * sign ups in your own database in case you decide to move to another email provider.
 * The last thing you'd want is for your email list to get lost due to a
 * third party provider shutting down or dropping your data.
 */
export const newsletters = pgTable("gf_newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
});

export const groups = pgTable(
  "gf_group",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    isPublic: boolean("isPublic").notNull().default(false),
    bannerId: text("bannerId"),
    info: text("info").default(""),
    youtubeLink: text("youtubeLink").default(""),
    discordLink: text("discordLink").default(""),
    githubLink: text("githubLink").default(""),
    xLink: text("xLink").default(""),
  },
  (table) => [
    index("groups_user_id_is_public_idx").on(table.userId, table.isPublic),
  ]
);

export const memberships = pgTable(
  "gf_membership",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    groupId: serial("groupId")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    role: roleEnum("role").default("member"),
  },
  (table) => [
    index("memberships_user_id_group_id_idx").on(table.userId, table.groupId),
  ]
);

export const invites = pgTable("gf_invites", {
  id: serial("id").primaryKey(),
  token: text("token")
    .notNull()
    .default(sql`gen_random_uuid()`)
    .unique(),
  groupId: serial("groupId")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }).notNull(),
});

export const events = pgTable("gf_events", {
  id: serial("id").primaryKey(),
  groupId: serial("groupId")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageId: text("imageId"),
  startsOn: timestamp("startsOn", { mode: "date" }).notNull(),
});

export const notifications = pgTable("gf_notifications", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  groupId: serial("groupId")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  postId: integer("postId"),
  isRead: boolean("isRead").notNull().default(false),
  type: text("type").notNull(),
  message: text("message").notNull(),
  createdOn: timestamp("createdOn", { mode: "date" }).notNull(),
});

export const posts = pgTable("gf_posts", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  groupId: serial("groupId")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  createdOn: timestamp("createdOn", { mode: "date" }).notNull(),
});

export const reply = pgTable(
  "gf_replies",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: serial("postId")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    groupId: serial("groupId")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    createdOn: timestamp("createdOn", { mode: "date" }).notNull(),
  },
  (table) => [index("replies_post_id_idx").on(table.postId)]
);

/**
 * RELATIONSHIPS
 *
 * Here you can define drizzle relationships between table which helps improve the type safety
 * in your code.
 */

export const groupRelations = relations(groups, ({ many }) => ({
  memberships: many(memberships),
}));

export const membershipRelations = relations(memberships, ({ one }) => ({
  user: one(users, { fields: [memberships.userId], references: [users.id] }),
  profile: one(profiles, {
    fields: [memberships.userId],
    references: [profiles.userId],
  }),
  group: one(groups, {
    fields: [memberships.groupId],
    references: [groups.id],
  }),
}));

export const postsRelationships = relations(posts, ({ one }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  group: one(groups, { fields: [posts.groupId], references: [groups.id] }),
}));

export const followingRelationship = relations(following, ({ one }) => ({
  foreignProfile: one(profiles, {
    fields: [following.foreignUserId],
    references: [profiles.userId],
  }),
  userProfile: one(profiles, {
    fields: [following.userId],
    references: [profiles.userId],
  }),
}));

/**
 * TYPES
 *
 * You can create and export types from your schema to use in your application.
 * This is useful when you need to know the shape of the data you are working with
 * in a component or function.
 */
export type Subscription = typeof subscriptions.$inferSelect;
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type Membership = typeof memberships.$inferSelect;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;

export type Notification = typeof notifications.$inferSelect;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Reply = typeof reply.$inferSelect;
export type NewReply = typeof reply.$inferInsert;

export type Following = typeof following.$inferSelect;

export type GroupId = Group["id"];

export type Session = typeof sessions.$inferSelect;
