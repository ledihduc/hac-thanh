import { isAdminRequest } from "@/lib/admin-auth";
import { createAttendanceWorkbook } from "@/lib/attendance-xlsx";
import { listGoogleSheetAttendance } from "@/lib/google-sheets";
import { dateFromRequest } from "@/lib/vietnam-time";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Bạn chưa đăng nhập quản trị." }, { status: 401 });
  }
  const date = dateFromRequest(request);
  if (!date) {
    return Response.json({ error: "Ngày cần xuất không hợp lệ." }, { status: 400 });
  }
  let rows;
  try {
    rows = await listGoogleSheetAttendance(date);
    rows.sort((left, right) => left.checkedAt.localeCompare(right.checkedAt));
  } catch {
    return Response.json({ error: "Không thể xuất dữ liệu từ Google Sheet." }, { status: 503 });
  }
  const workbook = createAttendanceWorkbook(rows, date);
  return new Response(new Uint8Array(workbook).buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="bni-mountain-diem-danh-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
