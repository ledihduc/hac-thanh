import { adminSessionCookie, verifyAdminPin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const payload = (await request.json()) as { pin?: string };
  if (!payload.pin || !verifyAdminPin(payload.pin)) {
    return Response.json({ error: "Mã quản trị không đúng." }, { status: 401 });
  }
  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": adminSessionCookie(), "Cache-Control": "no-store" } },
  );
}
