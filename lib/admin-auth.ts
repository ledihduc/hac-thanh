import { env } from "cloudflare:workers";

export const ADMIN_COOKIE = "bni_admin_session";

function secureEqual(left: string, right: string) {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

export function verifyAdminPin(pin: string) {
  return Boolean(env.ADMIN_PIN && secureEqual(pin, env.ADMIN_PIN));
}

export function isAdminRequest(request: Request) {
  if (!env.ADMIN_SESSION_TOKEN) return false;
  const cookieHeader = request.headers.get("cookie") || "";
  const session = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);
  return Boolean(session && secureEqual(decodeURIComponent(session), env.ADMIN_SESSION_TOKEN));
}

export function adminSessionCookie() {
  if (!env.ADMIN_SESSION_TOKEN) throw new Error("ADMIN_SESSION_TOKEN is not configured");
  return `${ADMIN_COOKIE}=${encodeURIComponent(env.ADMIN_SESSION_TOKEN)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
