import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const attendance = sqliteTable("attendance", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memberId: integer("member_id").notNull().unique(),
  name: text("name").notNull(),
  checkedAt: text("checked_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
