import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { quizes } from "~/server/db/schema";

export const quizRouter = createTRPCRouter({
  // test later
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        category_id: z.number(),
      }),
    )
    .output(
      z.object({
        id: z.number(),
        name: z.string(),
        creator_id: z.string(),
        category_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const quiz = await ctx.db
      .insert(quizes)
      .values({
        name: input.name,
        creator_id: user.id,
        category_id: input.category_id,
      }).returning();
      if (quiz.length < 1) {
        throw new Error("Internal server error");
      }
      return quiz[0]!; // handled on line ahead
    }),
});
