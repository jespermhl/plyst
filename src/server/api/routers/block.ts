import { desc, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { blocks, profiles } from "~/server/db/schema";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const blockRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId as string;

    const profile = await ctx.db.query.profiles.findFirst({
      where: eq(profiles.clerkId, userId),
    });

    if (!profile) return [];

    return await ctx.db
      .select()
      .from(blocks)
      .where(eq(blocks.profileId, profile.id))
      .orderBy(desc(blocks.order));
  }),

  add: protectedProcedure
    .input(z.object({ type: z.string().default("link") }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId as string;

      const profile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.clerkId, userId),
      });

      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

      return await ctx.db.insert(blocks).values({
        profileId: profile.id,
        type: input.type,
        title: "Neuer Link",
        url: "",
      });
    }),
});
