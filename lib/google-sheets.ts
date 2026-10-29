import { env } from "cloudflare:workers";

export type SheetAttendanceRow = {
  memberId: number;
  name: string;
  checkedAt: string;
};

type SheetResponse = {
  ok?: boolean;
  code?: string;
  error?: string;
  checkedAt?: string;
  rows?: SheetAttendanceRow[];
};

export class GoogleSheetError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "GoogleSheetError";
    this.code = code;
  }
}

function googleSheetsConfigured() {
  return Boolean(env.GOOGLE_SHEETS_WEBHOOK_URL && env.GOOGLE_SHEETS_SYNC_SECRET);
}

async function requestGoogleSheet(payload: Record<string, unknown>) {
  if (!googleSheetsConfigured()) {
    throw new GoogleSheetError("Google Sheet chưa được cấu hình.", "NOT_CONFIGURED");
  }

  const response = await fetch(env.GOOGLE_SHEETS_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: env.GOOGLE_SHEETS_SYNC_SECRET, ...payload }),
    signal: AbortSignal.timeout(10_000),
  });
  const result = (await response.json().catch(() => null)) as SheetResponse | null;
  if (!response.ok || result?.ok !== true) {
    throw new GoogleSheetError(
      result?.error || `Google Sheet trả về HTTP ${response.status}`,
      result?.code,
    );
  }
  return result;
}

export async function listGoogleSheetAttendance(attendanceDate: string) {
  const result = await requestGoogleSheet({ action: "list", attendanceDate });
  return Array.isArray(result.rows) ? result.rows : [];
}

export async function createGoogleSheetAttendance(input: {
  attendanceDate: string;
  memberId: number;
  name: string;
}) {
  const result = await requestGoogleSheet({ action: "checkin", ...input });
  if (!result.checkedAt) {
    throw new GoogleSheetError("Google Sheet không trả về thời gian điểm danh.", "INVALID_RESPONSE");
  }
  return { checkedAt: result.checkedAt };
}
