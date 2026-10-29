import { memberNames } from "../../../lib/members";
import {
  createGoogleSheetAttendance,
  GoogleSheetError,
  listGoogleSheetAttendance,
} from "../../../lib/google-sheets";

const validMembers = memberNames;

function todayInVietnam() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function GET() {
  try {
    const attendanceDate = todayInVietnam();
    const rows = await listGoogleSheetAttendance(attendanceDate);
    const checkedMemberIds = [...new Set(rows.map((row) => row.memberId).filter((id) => validMembers.has(id)))];

    return Response.json(
      { attendanceDate, checkedMemberIds },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    return Response.json({ error: "Chưa thể tải danh sách điểm danh từ Google Sheet." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { memberId?: number; name?: string };
    const memberId = Number(payload.memberId);
    const canonicalName = validMembers.get(memberId);
    const attendanceDate = todayInVietnam();

    if (!canonicalName || payload.name !== canonicalName) {
      return Response.json({ error: "Thông tin thành viên không hợp lệ." }, { status: 400 });
    }

    const result = await createGoogleSheetAttendance({
      attendanceDate,
      memberId,
      name: canonicalName,
    });
    return Response.json(
      { checkedAt: result.checkedAt, attendanceDate, alreadyCheckedIn: false },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof GoogleSheetError && error.code === "ALREADY_CHECKED_IN") {
      return Response.json({ error: error.message }, { status: 409 });
    }
    return Response.json(
      { error: "Chưa thể ghi nhận vào Google Sheet. Vui lòng thử lại." },
      { status: 503 },
    );
  }
}
