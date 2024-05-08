"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasks = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.tasks = (0, sqlite_core_1.sqliteTable)("tasks", {
    id: (0, sqlite_core_1.integer)("id").primaryKey({ autoIncrement: true }),
    categoryName: (0, sqlite_core_1.text)('category_name').notNull(),
    sizeName: (0, sqlite_core_1.text)('size_name').notNull(),
    taskDescr: (0, sqlite_core_1.text)('task_descr'),
    taskName: (0, sqlite_core_1.text)('task_name').notNull(),
    taskStatus: (0, sqlite_core_1.text)('task_status').notNull(),
    taskType: (0, sqlite_core_1.text)('task_type').notNull(),
    createdAt: (0, sqlite_core_1.integer)('created_at').notNull(),
    changetAt: (0, sqlite_core_1.integer)('changed_at'),
    deletedAt: (0, sqlite_core_1.integer)('deleted_at'),
    expiredAt: (0, sqlite_core_1.integer)('expired_at'),
    deadline: (0, sqlite_core_1.integer)('deadline'),
    deadlineTime: (0, sqlite_core_1.text)('deadline_time'),
    deadlineTimeMS: (0, sqlite_core_1.integer)('deadline_time_ms'),
    dateOfComplete: (0, sqlite_core_1.integer)('date_of_complete'),
    timeForComplete: (0, sqlite_core_1.integer)('time_for_complete'),
    coinsHasPlus: (0, sqlite_core_1.integer)('coins_has_plus', { mode: 'boolean' }),
    coinsHasBg: (0, sqlite_core_1.integer)('coins_has_bg', { mode: 'boolean' }),
    coinsAmount: (0, sqlite_core_1.integer)('coins_amount'),
    coinsNotEarnedAmount: (0, sqlite_core_1.integer)('coins_not_earned_amount'),
    coinColor: (0, sqlite_core_1.text)('coin_color'),
});
