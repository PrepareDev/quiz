import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { quizes, users } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export const profileRouter = createTRPCRouter({
  getProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        columns: {
          image: true,
          email: true,
          name: true,
        },
        extras: {
          quizes_created:
            sql`(SELECT COUNT(*) FROM quiz WHERE ${quizes.id} = ${users.id})`
              .mapWith(Number)
              .as("quizes_created"),
        },
      });
      return user;
    }),
});
