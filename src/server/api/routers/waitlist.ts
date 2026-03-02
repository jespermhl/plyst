import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { waitlist } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const waitlistRouter = createTRPCRouter({
  join: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        return { success: true, alreadyExists: true };
      }
      await ctx.db.insert(waitlist).values({
        email: input.email,
      });

      return { success: true, alreadyExists: false };
    }),
});