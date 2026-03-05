import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { profiles } from "~/server/db/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

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

  getMe: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.profiles.findFirst({
      where: eq(profiles.clerkId, ctx.auth.userId!),
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).max(50).optional(),
        bio: z.string().max(160).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(profiles)
        .set(input)
        .where(eq(profiles.clerkId, ctx.auth.userId!));
    }),

  updateHandle: protectedProcedure
    .input(z.object({ newHandle: z.string().min(3).max(30) }))
    .mutation(async ({ ctx, input }) => {
      const client = await clerkClient();
      const userId = ctx.auth.userId!;

      try {
        await client.users.updateUser(userId, {
          username: input.newHandle,
        });
        await ctx.db
          .update(profiles)
          .set({ handle: input.newHandle })
          .where(eq(profiles.clerkId, userId));

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Dieser Name ist bereits vergeben.",
        });
      }
    }),
});
