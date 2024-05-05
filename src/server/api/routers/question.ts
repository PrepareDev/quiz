import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { answers } from "~/server/db/schema";

export const questionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        type: z.enum([
        "many",
        "single",
        "text",
        "number",
      ]),
        quiz_id: z.number(),
        image: z.string(),
        order: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const quiz = await ctx.db
      .insert(answers)
      .values({
        text: input.text,
        type: input.type,
        quiz_id: input.quiz_id,
        image: input.image,
        order: input.order,
      });
      return quiz;
    }),
});
