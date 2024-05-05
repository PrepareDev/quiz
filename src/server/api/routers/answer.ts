import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { answers } from "~/server/db/schema";

export const questionsRouter = createTRPCRouter({
  create: protectedProcedure
  .input(
    z.object({
        text: z.string(),
        question_id: z.number(),
        is_valid: z.boolean(),
  }))
  .output(
    z.object({
        id: z.number(),
        created_at: z.nullable(z.date()),
        updated_at: z.nullable(z.date()),
        text: z.string(),
        question_id: z.number(),
        is_valid: z.boolean(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const rows = await ctx.db
    .insert(answers)
    .values({
        text: input.text,
        question_id: input.question_id,
        is_valid: input.is_valid
    })
    .returning();
    if (rows.length < 1) {
        throw new Error("Internal Server Error")
    }
    return rows[0]! // handled
  })
})