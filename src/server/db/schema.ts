import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { type ThemeConfig } from "~/lib/theme";

export const waitlist = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  handle: text("handle").unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  theme: jsonb("theme").$type<ThemeConfig>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blocks = pgTable("block", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id),
  type: text("type").notNull(),
  title: text("title"),
  url: text("url"),
  config: jsonb("config"),
  order: integer("order").notNull().default(0),
});
