import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { attendance } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { createAttendanceWorkbook } from "@/lib/attendance-xlsx";
import { dateFromRequest } from "@/lib/vietnam-time";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Bạn chưa đăng nhập quản trị." }, { status: 401 });
  }
  const date = dateFromRequest(request);
  if (!date) {
    return Response.json({ error: "Ngày cần xuất không hợp lệ." }, { status: 400 });
  }
  const rows = await getDb()
    .select({ memberId: attendance.memberId, name: attendance.name, checkedAt: attendance.checkedAt })
    .from(attendance)
    .where(eq(attendance.attendanceDate, date))
    .orderBy(asc(attendance.checkedAt));
  const workbook = createAttendanceWorkbook(rows, date);
  return new Response(new Uint8Array(workbook).buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="bni-mountain-diem-danh-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
