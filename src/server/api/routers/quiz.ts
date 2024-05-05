import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { questions, quizes } from "~/server/db/schema";

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
      const rows = await ctx.db
      .insert(quizes)
      .values({
        name: input.name,
        creator_id: user.id,
        category_id: input.category_id,
      }).returning();
      if (rows.length < 1) {
        throw new Error("Internal server error");
      }
      return rows[0]!; // handled on line ahead
    }),
    getQuestionsById: protectedProcedure
    .input(
      z.object({
        quiz_id: z.number(),
      })
    )
    .output(
      z.array(z.object({
        id: z.number(),
        image: z.nullable(z.string()),
        created_at: z.nullable(z.date()),
        updated_at: z.nullable(z.date()),
        text: z.string(),
        order: z.number(),
        type: z.enum(["many", "single", "text", "number"]),
        quiz_id: z.number()
      })
    ))
    .query(async ({ctx, input}) => {
      return await ctx.db
      .select()
      .from(questions)
      .where(eq(questions.quiz_id, input.quiz_id))
    })
});
