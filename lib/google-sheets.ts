import { env } from "cloudflare:workers";
import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { attendance } from "@/db/schema";

type AttendanceSyncRow = typeof attendance.$inferSelect;

function googleSheetsConfigured() {
  return Boolean(env.GOOGLE_SHEETS_WEBHOOK_URL && env.GOOGLE_SHEETS_SYNC_SECRET);
}

function checkedAtIso(value: string) {
  return new Date(`${value.replace(" ", "T")}Z`).toISOString();
}

async function sendToGoogleSheet(row: AttendanceSyncRow) {
  if (!googleSheetsConfigured()) return false;

  const response = await fetch(env.GOOGLE_SHEETS_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: env.GOOGLE_SHEETS_SYNC_SECRET,
      attendanceDate: row.attendanceDate,
      memberId: row.memberId,
      name: row.name,
      checkedAt: checkedAtIso(row.checkedAt),
      previousMemberId: row.sheetPreviousMemberId,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || result?.ok !== true) {
    throw new Error(result?.error || `Google Sheet trả về HTTP ${response.status}`);
  }
  return true;
}

export async function syncAttendanceRow(row: AttendanceSyncRow) {
  if (!googleSheetsConfigured()) return;
  const db = getDb();
  try {
    const synced = await sendToGoogleSheet(row);
    if (!synced) return;
    await db
      .update(attendance)
      .set({ sheetSyncedAt: new Date().toISOString(), sheetSyncError: null, sheetPreviousMemberId: null })
      .where(eq(attendance.id, row.id));
  } catch (cause) {
    const message = cause instanceof Error ? cause.message.slice(0, 500) : "Không rõ lỗi đồng bộ";
    await db.update(attendance).set({ sheetSyncError: message }).where(eq(attendance.id, row.id));
  }
}

export async function retryPendingGoogleSheetSync(attendanceDate: string, limit = 5) {
  if (!googleSheetsConfigured()) return;
  const pending = await getDb()
    .select()
    .from(attendance)
    .where(and(eq(attendance.attendanceDate, attendanceDate), isNull(attendance.sheetSyncedAt)))
    .limit(limit);
  await Promise.all(pending.map((row) => syncAttendanceRow(row)));
}
