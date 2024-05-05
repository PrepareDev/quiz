import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { categories } from "~/server/db/schema";

export const categoryRouter = createTRPCRouter({ // test later
  create: protectedProcedure
  .input(z.object({
    name: z.string(),
}))
.output(z.object({
  id: z.number(),
  name: z.string(),
}))
  .mutation(async ({input, ctx}) => {
    const category = await ctx.db
    .insert(categories)
    .values({
        name: input.name,
    }).returning()
    if (category[0]?.id === undefined) {
      throw new Error("internal server error")
    }
    return category[0]
  }),
  getAll: protectedProcedure
  .output(z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ))
  .query(async ({ctx}) => {
    const category = await ctx.db
    .select()
    .from(categories)
    if (category[0] === undefined) {
      throw new Error("internal server error")
    }
    return category
  })
});