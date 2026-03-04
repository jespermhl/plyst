import { eq, and, asc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { blocks, profiles } from "~/server/db/schema";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const blockRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId!;

    const profile = await ctx.db.query.profiles.findFirst({
      where: eq(profiles.clerkId, userId),
    });

    if (!profile) return [];

    return await ctx.db.query.blocks.findMany({
      where: eq(blocks.profileId, profile.id),
      orderBy: [asc(blocks.order)],
    });
  }),

  add: protectedProcedure
    .input(z.object({ type: z.string().default("link") }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId!;

      const profile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.clerkId, userId),
      });

      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

      const existingBlocks = await ctx.db.query.blocks.findMany({
        where: eq(blocks.profileId, profile.id),
      });

      return await ctx.db
        .insert(blocks)
        .values({
          profileId: profile.id,
          type: input.type,
          title: "Neuer Link",
          url: "",
          order: existingBlocks.length,
        })
        .returning();
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        url: z.string().optional(),
        config: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const userId = ctx.auth.userId!;

      const profile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.clerkId, userId),
      });
      if (!profile) throw new TRPCError({ code: "UNAUTHORIZED" });

      return await ctx.db
        .update(blocks)
        .set(data)
        .where(and(eq(blocks.id, id), eq(blocks.profileId, profile.id)));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId!;

      const profile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.clerkId, userId),
      });
      if (!profile) throw new TRPCError({ code: "UNAUTHORIZED" });

      return await ctx.db
        .delete(blocks)
        .where(and(eq(blocks.id, input.id), eq(blocks.profileId, profile.id)));
    }),

  reorder: protectedProcedure
    .input(z.array(z.object({ id: z.string(), order: z.number() })))
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.map((item) =>
          ctx.db
            .update(blocks)
            .set({ order: item.order })
            .where(eq(blocks.id, item.id)),
        ),
      );
      return { success: true };
    }),

  getPublicProfile: publicProcedure
    .input(z.object({ handle: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.handle, input.handle),
      });

      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

      const profileBlocks = await ctx.db.query.blocks.findMany({
        where: eq(blocks.profileId, profile.id),
        orderBy: [asc(blocks.order)],
      });

      return { profile, blocks: profileBlocks };
    }),
});
