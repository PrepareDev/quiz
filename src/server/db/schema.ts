import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => name);

export const users = createTable(
  "user",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: timestamp("emailVerified", {
      mode: "date",
    }).defaultNow(),
    image: varchar("image", { length: 255 }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  }),
);

export const categories = createTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const quizes = createTable("quiz", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  creator_id: varchar("creator_id")
    .notNull()
    .references(() => users.id),
  category_id: integer("category_id")
    .notNull()
    .references(() => categories.id),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const questionType = pgEnum("question_type", [
  "many",
  "single",
  "text",
  "number",
]);

export const answers = createTable("answer", {
  id: serial("id").primaryKey(),
  text: varchar("text", { length: 255 }).notNull(),
  question_id: integer("question_id")
    .notNull()
    .references(() => questions.id),
  is_valid: boolean("is_valid").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const questions = createTable("question", {
  id: serial("id").primaryKey(),
  text: varchar("text", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }),
  order: integer("order").notNull(),
  type: questionType("type").notNull(),
  quiz_id: integer("quiz_id")
    .notNull()
    .references(() => quizes.id),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userAnswers = createTable("user_answer", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id")
    .notNull()
    .references(() => users.id),
  answer_id: integer("answer_id")
    .notNull()
    .references(() => answers.id),
  quiz_id: integer("quiz_id")
    .notNull()
    .references(() => quizes.id),
  question_id: integer("question_id")
    .notNull()
    .references(() => questions.id),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userAnswersRelations = relations(userAnswers, ({ one }) => ({
  user: one(users),
  answer: one(answers),
  quiz: one(quizes),
  question: one(questions),
}));

export const questionsRelations = relations(questions, ({ many }) => ({
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  quizes: many(quizes),
}));

export const quizesRelations = relations(quizes, ({ one, many }) => ({
  category: one(categories),
  creator: one(users),
  questions: many(questions),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  createdQuizes: many(quizes),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    session_token: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    user_id: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.user_id),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.user_id], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
