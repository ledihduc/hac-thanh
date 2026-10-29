import { isAdminRequest } from "@/lib/admin-auth";
import { listGoogleSheetAttendance } from "@/lib/google-sheets";
import { dateFromRequest } from "@/lib/vietnam-time";
import { memberNames } from "@/lib/members";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Bạn chưa đăng nhập quản trị." }, { status: 401 });
  }
  const date = dateFromRequest(request);
  if (!date) {
    return Response.json({ error: "Ngày cần xem không hợp lệ." }, { status: 400 });
  }
  try {
    const rows = await listGoogleSheetAttendance(date);
    return Response.json(
      {
        date,
        rows: rows
          .filter((row) => memberNames.has(row.memberId))
          .sort((left, right) => left.checkedAt.localeCompare(right.checkedAt)),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Không thể tải dữ liệu từ Google Sheet." }, { status: 503 });
  }
}
