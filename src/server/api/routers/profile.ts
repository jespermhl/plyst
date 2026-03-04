import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { profiles } from "~/server/db/schema";
import { clerkClient } from "@clerk/nextjs/server";

export const profileRouter = createTRPCRouter({
  checkHandle: publicProcedure
    .input(z.object({ handle: z.string().min(2) }))
    .query(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(profiles)
        .where(eq(profiles.handle, input.handle.toLowerCase()))
        .limit(1);
      return { isAvailable: existing.length === 0 };
    }),

  create: protectedProcedure
    .input(
      z.object({
        handle: z.string().min(2).max(20),
        displayName: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const client = await clerkClient();

      const userId = ctx.auth.userId!;

      const newProfileRows = await ctx.db
        .insert(profiles)
        .values({
          clerkId: userId,
          handle: input.handle.toLowerCase(),
          displayName: input.displayName,
        })
        .returning();

      const newProfile = newProfileRows[0];

      if (newProfile) {
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            onboarded: true,
            handle: input.handle.toLowerCase(),
          },
        });
      }

      return newProfile;
    }),
});
