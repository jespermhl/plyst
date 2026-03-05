import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { profiles } from "~/server/db/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

function canonicalizeHandle(input: string): string {
  return input.trim().toLowerCase();
}

function normalizeClerkError(error: unknown):
  | {
      status?: number;
      errors?: { code?: string }[];
      message?: string;
    }
  | null {
  if (!error || typeof error !== "object") return null;

  const e = error as {
    status?: number;
    errors?: { code?: string }[];
    message?: string;
  };

  return e;
}

export const profileRouter = createTRPCRouter({
  checkHandle: publicProcedure
    .input(z.object({ handle: z.string().min(2) }))
    .query(async ({ ctx, input }) => {
      const normalizedHandle = canonicalizeHandle(input.handle);

      const existing = await ctx.db
        .select()
        .from(profiles)
        .where(eq(profiles.handle, normalizedHandle))
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
      const normalizedHandle = canonicalizeHandle(input.handle);

      const newProfileRows = await ctx.db
        .insert(profiles)
        .values({
          clerkId: userId,
          handle: normalizedHandle,
          displayName: input.displayName,
        })
        .returning();

      const newProfile = newProfileRows[0];

      if (!newProfile) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Profil konnte nicht erstellt werden.",
        });
      }

      try {
        await client.users.updateUser(userId, {
          username: normalizedHandle,
        });

        return newProfile;
      } catch (error) {
        await ctx.db
          .delete(profiles)
          .where(eq(profiles.id, newProfile.id));

        const maybeError = normalizeClerkError(error);

        console.error("profile.create Clerk sync failed", {
          scope: "profile.create",
          userId,
          status: maybeError?.status,
          code: maybeError?.errors?.[0]?.code,
          message: maybeError?.message,
        });

        const isConflict =
          !!maybeError &&
          (maybeError.errors?.[0]?.code === "form_identifier_exists" ||
            maybeError.status === 422 ||
            maybeError.message?.toLowerCase().includes("username"));

        throw new TRPCError({
          code: isConflict ? "CONFLICT" : "INTERNAL_SERVER_ERROR",
          message: isConflict
            ? "Dieser Name ist bereits vergeben."
            : "Ein Fehler ist aufgetreten.",
          cause: error,
        });
      }
    }),

  createInitial: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.userId!;

    const existingProfile = await ctx.db.query.profiles.findFirst({
      where: eq(profiles.clerkId, userId),
    });

    if (existingProfile) {
      return existingProfile;
    }

    const newProfileRows = await ctx.db
      .insert(profiles)
      .values({
        clerkId: userId,
      })
      .returning();

    return newProfileRows[0];
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
      const userId = ctx.auth.userId!;

      const existingProfile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.clerkId, userId),
      });

      if (!existingProfile) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const hasChanges =
        typeof input.displayName !== "undefined" ||
        typeof input.bio !== "undefined";

      if (!hasChanges) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Keine Änderungen übermittelt.",
        });
      }

      const updatedRows = await ctx.db
        .update(profiles)
        .set(input)
        .where(eq(profiles.clerkId, userId))
        .returning();

      return updatedRows[0] ?? existingProfile;
    }),

  updateHandle: protectedProcedure
    .input(z.object({ newHandle: z.string().min(3).max(30) }))
    .mutation(async ({ ctx, input }) => {
      const client = await clerkClient();
      const userId = ctx.auth.userId!;
      const normalizedHandle = canonicalizeHandle(input.newHandle);

      const existingProfile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.clerkId, userId),
      });

      if (!existingProfile) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      try {
        await ctx.db
          .update(profiles)
          .set({ handle: normalizedHandle })
          .where(eq(profiles.clerkId, userId));
        await client.users.updateUser(userId, {
          username: normalizedHandle,
        });

        return { success: true };
      } catch (error) {
        await ctx.db
          .update(profiles)
          .set({ handle: existingProfile.handle })
          .where(eq(profiles.clerkId, userId));

        const maybeError = normalizeClerkError(error);

        console.error("updateHandle failed", {
          scope: "profile.updateHandle",
          userId,
          status: maybeError?.status,
          code: maybeError?.errors?.[0]?.code,
          message: maybeError?.message,
        });

        const isConflict =
          !!maybeError &&
          (maybeError.errors?.[0]?.code === "form_identifier_exists" ||
            maybeError.status === 422 ||
            maybeError.message?.toLowerCase().includes("username"));

        throw new TRPCError({
          code: isConflict ? "CONFLICT" : "INTERNAL_SERVER_ERROR",
          message: isConflict
            ? "Dieser Name ist bereits vergeben."
            : "Ein Fehler ist aufgetreten.",
          cause: error,
        });
      }
    }),
});
