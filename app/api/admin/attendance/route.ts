import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { attendance } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { dateFromRequest } from "@/lib/vietnam-time";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Bạn chưa đăng nhập quản trị." }, { status: 401 });
  }
  const date = dateFromRequest(request);
  if (!date) {
    return Response.json({ error: "Ngày cần xem không hợp lệ." }, { status: 400 });
  }
  const rows = await getDb()
    .select({ memberId: attendance.memberId, name: attendance.name, checkedAt: attendance.checkedAt })
    .from(attendance)
    .where(eq(attendance.attendanceDate, date))
    .orderBy(asc(attendance.checkedAt));
  return Response.json({ date, rows }, { headers: { "Cache-Control": "no-store" } });
}
