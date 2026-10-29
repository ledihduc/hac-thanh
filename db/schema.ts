import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const attendance = sqliteTable(
  "attendance",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    memberId: integer("member_id").notNull(),
    name: text("name").notNull(),
    attendanceDate: text("attendance_date").notNull(),
    checkedAt: text("checked_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    correctionToken: text("correction_token"),
    sheetSyncedAt: text("sheet_synced_at"),
    sheetSyncError: text("sheet_sync_error"),
    sheetPreviousMemberId: integer("sheet_previous_member_id"),
  },
  (table) => [
    uniqueIndex("attendance_member_day_unique").on(table.memberId, table.attendanceDate),
    uniqueIndex("attendance_correction_token_unique").on(table.correctionToken),
  ],
);
