import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryName: text('category_name').notNull(),
  sizeName: text('size_name').notNull(),
  taskDescr: text('task_descr'),
  taskName: text('task_name').notNull(),
  taskStatus: text('task_status').notNull(),
  taskType: text('task_type').notNull(),

  createdAt: integer('created_at').notNull(),
  changetAt: integer('changed_at'),
  deletedAt: integer('deleted_at'),
  expiredAt: integer('expired_at'),

  deadline: integer('deadline'),
  deadlineTime: text('deadline_time'),
  deadlineTimeMS: integer('deadline_time_ms'),
  dateOfComplete: integer('date_of_complete'),
  timeForComplete: integer('time_for_complete'),

  coinsHasPlus: integer('coins_has_plus', {mode: 'boolean'}),
  coinsHasBg: integer('coins_has_bg', {mode: 'boolean'}),
  coinsAmount: integer('coins_amount'),
  coinsNotEarnedAmount: integer('coins_not_earned_amount'),
  coinColor: text('coin_color'),
});