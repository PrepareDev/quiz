import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { quizes, users } from "~/server/db/schema";

export const quizRouter = createTRPCRouter({ // test later
  create: protectedProcedure
  .input(z.object({
    name: z.string(),
    category_id: z.number(),
}))
  .mutation(async ({ctx, input}) => {
    const user = ctx.session.user
    const quiz = await ctx.db
    .insert(quizes)
    .values({
        name: input.name, 
        creator_id: user.id,
        category_id: input.category_id,
    })
    console.log(quiz)
    return quiz
  })
});