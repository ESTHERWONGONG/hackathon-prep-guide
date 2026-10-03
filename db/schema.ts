import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const prepPlans = sqliteTable('prep_plans', {
  userId: text('user_id').primaryKey(),
  stateJson: text('state_json').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
