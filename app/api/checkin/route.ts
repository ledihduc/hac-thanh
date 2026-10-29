import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { attendance } from "../../../db/schema";

const validMembers = new Map<number, string>([
  [1, "Đàm Mai An"], [2, "Đỗ Ngọc Vương Anh"], [3, "Lê Vân Anh"], [4, "Lê Chung"],
  [5, "Nguyễn Duy Cường"], [6, "Lê Minh Dương"], [7, "Lê Đình Đức"], [8, "Hoàng Văn Đặng"],
  [9, "Kim Hậu"], [10, "Lê Thị Hằng"], [11, "Trần Tuấn Hoài"], [12, "Lê Hoa"],
  [13, "Phạm Thu Hồng"], [14, "Nguyễn Thị Huệ"], [15, "Cao Thị Huyền"], [16, "Nguyễn Thị Kiều Loan"],
  [17, "Nguyễn Khắc Long"], [18, "Nguyễn Hữu Minh"], [19, "Phạm Văn Nam"], [20, "Hồ Ninh"],
  [21, "Lê Oanh"], [22, "Lê Văn Quyền"], [23, "Lê Hoàng Sơn"], [24, "Bùi Kim Thúy"],
  [25, "Lê Phương Thảo"], [26, "Đoàn Thị Thoáng"], [27, "Trịnh Anh Thư"], [28, "Nguyễn Thị Thương"],
  [29, "Dương Thị Thúy"], [30, "Phan Văn Tùng"], [31, "Dương Thủy"], [32, "Cao Thị Huyền Trang"],
  [33, "Nguyễn Thanh Thúy"],
]);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      memberId?: number;
      name?: string;
      previousMemberId?: number;
      correctionToken?: string;
    };
    const memberId = Number(payload.memberId);
    const canonicalName = validMembers.get(memberId);
    const attendanceDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    if (!canonicalName || payload.name !== canonicalName) {
      return Response.json({ error: "Thông tin thành viên không hợp lệ." }, { status: 400 });
    }

    const db = getDb();
    const isCorrection = payload.previousMemberId !== undefined || payload.correctionToken !== undefined;

    if (isCorrection) {
      const previousMemberId = Number(payload.previousMemberId);
      const correctionToken = payload.correctionToken;
      if (!validMembers.has(previousMemberId) || !correctionToken) {
        return Response.json({ error: "Không thể xác thực lần điểm danh cần sửa." }, { status: 400 });
      }

      const previous = await db
        .select()
        .from(attendance)
        .where(
          and(
            eq(attendance.memberId, previousMemberId),
            eq(attendance.attendanceDate, attendanceDate),
            eq(attendance.correctionToken, correctionToken),
          ),
        )
        .limit(1);

      if (!previous[0]) {
        return Response.json({ error: "Lần điểm danh này không còn hiệu lực để sửa." }, { status: 403 });
      }

      if (previousMemberId === memberId) {
        return Response.json({
          checkedAt: previous[0].checkedAt,
          attendanceDate,
          correctionToken,
          alreadyCheckedIn: true,
        });
      }

      const target = await db
        .select({ id: attendance.id })
        .from(attendance)
        .where(and(eq(attendance.memberId, memberId), eq(attendance.attendanceDate, attendanceDate)))
        .limit(1);
      if (target[0]) {
        return Response.json({ error: `${canonicalName} đã được điểm danh hôm nay.` }, { status: 409 });
      }

      const updated = await db
        .update(attendance)
        .set({ memberId, name: canonicalName, checkedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(attendance.id, previous[0].id))
        .returning();
      return Response.json({
        checkedAt: updated[0].checkedAt,
        attendanceDate,
        correctionToken,
        alreadyCheckedIn: false,
        corrected: true,
      });
    }

    const existing = await db
      .select()
      .from(attendance)
      .where(and(eq(attendance.memberId, memberId), eq(attendance.attendanceDate, attendanceDate)))
      .limit(1);
    if (existing[0]) {
      return Response.json({
        checkedAt: existing[0].checkedAt,
        attendanceDate,
        alreadyCheckedIn: true,
      });
    }

    const correctionToken = crypto.randomUUID();
    const inserted = await db
      .insert(attendance)
      .values({ memberId, name: canonicalName, attendanceDate, correctionToken })
      .returning();
    return Response.json(
      { checkedAt: inserted[0].checkedAt, attendanceDate, correctionToken, alreadyCheckedIn: false },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    if (message.includes("UNIQUE constraint failed")) {
      return Response.json({ error: "Thành viên đã được điểm danh hôm nay." }, { status: 409 });
    }
    return Response.json({ error: "Hệ thống chưa thể ghi nhận. Vui lòng thử lại." }, { status: 500 });
  }
}
