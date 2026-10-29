export function todayInVietnam() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function formatVietnamDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function dateFromRequest(request: Request) {
  const requestedDate = new URL(request.url).searchParams.get("date");
  if (!requestedDate) return todayInVietnam();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) return null;
  const parsed = new Date(`${requestedDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== requestedDate) return null;
  return requestedDate;
}
