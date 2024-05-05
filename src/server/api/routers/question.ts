import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { answers, questions } from "~/server/db/schema";
import { eq } from "drizzle-orm";
export const questionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        image: z.nullable(z.string()),
        order: z.number(),
        type: z.enum(["many", "single", "text", "number"]),
        quiz_id: z.number(),
      }),
    )
    .output(
      z.object({
        id: z.number(),
        image: z.nullable(z.string()),
        text: z.string(),
        order: z.number(),
        type: z.enum(["many", "single", "text", "number"]),
        quiz_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await ctx.db
        .insert(questions)
        .values({
          text: input.text,
          image: input.image,
          order: input.order,
          type: input.type,
          quiz_id: input.quiz_id
        })
        .returning();
        if (rows.length > 1) {
          throw new Error("Internal server error")
        }
      return rows[0]!; //handled one line ahead
    }),
    getAnswersByQuestionId: protectedProcedure
    .input(z.object({
      question_id: z.number(),
    }))
    .output(
      z.array(
        z.object({
          id: z.number(),
          created_at: z.nullable(z.date()),
          updated_at: z.nullable(z.date()),
          text: z.string(),
          question_id: z.number(),
          is_valid: z.boolean()
        })
    ))
    .query(async ({ctx, input}) => {
      return await ctx.db
      .select()
      .from(answers)
      .where(eq(answers.question_id, input.question_id))
    })
});
