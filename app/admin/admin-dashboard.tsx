"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { CalendarDays, Clock, Download, LockKeyhole, LogOut, RefreshCw, Users } from "lucide-react";

type AttendanceRow = { memberId: number; name: string; checkedAt: string };

function formatCheckedAt(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(`${value.replace(" ", "T")}Z`));
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export default function AdminDashboard() {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [date, setDate] = useState("");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAttendance = useCallback(async (requestedDate?: string) => {
    setLoading(true);
    try {
      const query = requestedDate ? `?date=${encodeURIComponent(requestedDate)}` : "";
      const response = await fetch(`/api/admin/attendance${query}`, { cache: "no-store" });
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = (await response.json()) as { date: string; rows: AttendanceRow[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Không thể tải dữ liệu.");
      setRows(data.rows);
      setDate(data.date);
      setAuthenticated(true);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAttendance();
  }, [loadAttendance]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Không thể đăng nhập.");
      setPin("");
      await loadAttendance();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể đăng nhập.");
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setRows([]);
  }

  if (authenticated !== true) {
    return (
      <main className="admin-shell admin-login-shell">
        <section className="admin-login-card">
          <img src="/brand/bni-mountain.jpg" alt="BNI Mountain" />
          <div className="admin-lock"><LockKeyhole size={26} /></div>
          <p className="admin-kicker">Trang quản trị</p>
          <h1>Danh sách điểm danh</h1>
          <p>Nhập mã quản trị để xem dữ liệu trong ngày.</p>
          <form onSubmit={login}>
            <label htmlFor="admin-pin">Mã quản trị</label>
            <input id="admin-pin" type="password" value={pin} onChange={(event) => setPin(event.target.value)} autoComplete="current-password" autoFocus />
            {error && <div className="admin-error">{error}</div>}
            <button type="submit" disabled={loading || !pin}>{loading ? "Đang kiểm tra..." : "Đăng nhập"}</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div><img src="/brand/bni-mountain.jpg" alt="BNI Mountain" /><span>Quản trị điểm danh</span></div>
        <button type="button" onClick={logout}><LogOut size={17} /> Đăng xuất</button>
      </header>
      <section className="admin-content">
        <div className="admin-heading">
          <div><p className="admin-kicker">BNI Mountain</p><h1>Thành viên đã điểm danh</h1><p>Dữ liệu ngày {formatDate(date)}</p></div>
          <div className="admin-actions">
            <label className="admin-date-filter"><CalendarDays size={18} /><span>Ngày</span><input type="date" value={date} onChange={(event) => { setDate(event.target.value); void loadAttendance(event.target.value); }} /></label>
            <button type="button" className="admin-refresh" onClick={() => void loadAttendance(date)} disabled={loading}><RefreshCw size={18} className={loading ? "is-spinning" : ""} /> Làm mới</button>
            <a className="admin-download" href={`/api/admin/export?date=${encodeURIComponent(date)}`}><Download size={18} /> Tải Excel đầy đủ</a>
          </div>
        </div>
        <div className="admin-summary"><Users size={22} /><div><strong>{rows.length}</strong><span>thành viên đã đến trong ngày</span></div></div>
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>STT</th><th>Thành viên</th><th>Mã</th><th><Clock size={15} /> Thời gian</th></tr></thead>
            <tbody>
              {rows.map((row, index) => <tr key={row.memberId}><td>{index + 1}</td><td><strong>{row.name}</strong></td><td>{String(row.memberId).padStart(2, "0")}</td><td>{formatCheckedAt(row.checkedAt)}</td></tr>)}
              {rows.length === 0 && <tr><td colSpan={4} className="admin-empty">Chưa có thành viên nào điểm danh trong ngày này.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
