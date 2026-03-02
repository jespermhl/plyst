import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { waitlist } from "~/server/db/schema";

export const waitlistRouter = createTRPCRouter({
  join: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.insert(waitlist).values({
          email: input.email,
        });

        return { success: true, alreadyExists: false };
      } catch (error) {
        const pgError = error as { code?: string; message?: string };
        
        const isUniqueViolation = 
          pgError.code === "23505" || 
          pgError.message?.includes("unique constraint");

        if (isUniqueViolation) {
          return { success: true, alreadyExists: true };
        }

        throw error;
      }
    }),
});