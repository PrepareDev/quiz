import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { questions } from "~/server/db/schema";

export const questionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        image: z.string(),
        order: z.number(),
        type: z.enum(["many", "single", "text", "number"]),
        quiz_id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db
        .insert(questions)
        .values({
          text: input.text,
          image: input.image,
          order: input.order,
          type: input.type,
          quiz_id: input.quiz_id
        })
        .returning();
        if (question.length > 1) {
          throw new Error("Internal server error")
        }
      return question[0]!; //handled one line ahead
    }),
});
