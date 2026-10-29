"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, Search, X } from "lucide-react";
import { members, type Member } from "@/lib/members";

function memberImage(id: number) {
  return `/members/member-${String(id).padStart(2, "0")}.jpg`;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

type View = "search" | "confirm" | "success";
const DEVICE_LOCK_KEY = "bni-mountain-meeting-332-checkin";

type DeviceCheckin = {
  memberId: number;
  name: string;
  checkedAt: string;
  attendanceDate: string;
  correctionToken?: string;
};

function todayInVietnam() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default function AttendanceApp() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);
  const [view, setView] = useState<View>("search");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [checkedAt, setCheckedAt] = useState("");
  const [deviceCheckin, setDeviceCheckin] = useState<DeviceCheckin | null>(null);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [checkedMemberIds, setCheckedMemberIds] = useState<number[]>([]);

  async function refreshCheckedMembers() {
    try {
      const response = await fetch("/api/checkin", { cache: "no-store" });
      const data = (await response.json()) as { checkedMemberIds?: number[] };
      if (response.ok && Array.isArray(data.checkedMemberIds)) {
        setCheckedMemberIds(data.checkedMemberIds);
      }
    } catch {
      // The server still enforces uniqueness if the public status list is temporarily unavailable.
    }
  }

  useEffect(() => {
    void refreshCheckedMembers();
    try {
      const saved = window.localStorage.getItem(DEVICE_LOCK_KEY);
      if (!saved) return;
      const record = JSON.parse(saved) as DeviceCheckin;
      if (record.attendanceDate !== todayInVietnam()) {
        window.localStorage.removeItem(DEVICE_LOCK_KEY);
        return;
      }
      const member = members.find((item) => item.id === record.memberId && item.name === record.name);
      if (!member) {
        window.localStorage.removeItem(DEVICE_LOCK_KEY);
        return;
      }
      setSelected(member);
      setCheckedAt(record.checkedAt || "đã ghi nhận");
      setDeviceCheckin(record);
      setView("success");
    } catch {
      window.localStorage.removeItem(DEVICE_LOCK_KEY);
    }
  }, []);

  const filteredMembers = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return members;
    return members.filter((member) => normalize(member.name).includes(needle));
  }, [query]);

  function chooseMember(member: Member) {
    if (checkedMemberIds.includes(member.id)) return;
    setSelected(member);
    setError("");
    setView("confirm");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startCorrection() {
    if (!deviceCheckin?.correctionToken) return;
    setIsCorrecting(true);
    setQuery("");
    setSelected(null);
    setError("");
    setView("search");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function confirmAttendance() {
    if (!selected || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: selected.id,
          name: selected.name,
          ...(isCorrecting && deviceCheckin
            ? { previousMemberId: deviceCheckin.memberId, correctionToken: deviceCheckin.correctionToken }
            : {}),
        }),
      });
      const data = (await response.json()) as {
        checkedAt?: string;
        attendanceDate?: string;
        correctionToken?: string;
        error?: string;
      };
      if (!response.ok) {
        if (response.status === 409) await refreshCheckedMembers();
        throw new Error(data.error || "Không thể điểm danh lúc này.");
      }

      const time = data.checkedAt ? new Date(`${data.checkedAt.replace(" ", "T")}Z`) : new Date();
      const formattedTime = new Intl.DateTimeFormat("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "Asia/Ho_Chi_Minh",
        }).format(time);
      setCheckedAt(formattedTime);
      const record: DeviceCheckin = {
        memberId: selected.id,
        name: selected.name,
        checkedAt: formattedTime,
        attendanceDate: data.attendanceDate || todayInVietnam(),
        correctionToken: data.correctionToken,
      };
      window.localStorage.setItem(DEVICE_LOCK_KEY, JSON.stringify(record));
      setDeviceCheckin(record);
      await refreshCheckedMembers();
      setIsCorrecting(false);
      setView("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="site-shell">
      <div className="red-orb red-orb-one" />
      <div className="red-orb red-orb-two" />
      <header className="brand-header">
        <img className="brand-logo" src="/brand/bni-mountain.jpg" alt="BNI Mountain" />
      </header>

      <section className="attendance-card">
        {view === "search" && (
          <>
            {isCorrecting && <div className="device-locked">Bạn đang sửa người đã điểm danh hôm nay</div>}
            <div className="eyebrow"><span /> Điểm danh thành viên</div>
            <h1>Chào mừng bạn<br />đã đến buổi họp!</h1>
            <p className="lead">Tìm và chọn tên của bạn để hoàn tất điểm danh.</p>

            <label className="search-box">
              <Search size={21} aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nhập tên của bạn..." autoComplete="off" autoFocus />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Xóa tìm kiếm"><X size={18} /></button>}
            </label>

            <div className="list-meta"><span>Danh sách thành viên</span><span>{filteredMembers.length} kết quả</span></div>
            <div className="member-grid">
              {filteredMembers.map((member) => (
                <button
                  className={`member-card${checkedMemberIds.includes(member.id) ? " is-checked" : ""}`}
                  key={member.id}
                  onClick={() => chooseMember(member)}
                  disabled={checkedMemberIds.includes(member.id)}
                  aria-label={checkedMemberIds.includes(member.id) ? `${member.name} đã điểm danh hôm nay` : `Điểm danh ${member.name}`}
                >
                  <span className="member-photo-wrap">
                    <img src={memberImage(member.id)} alt={`Ảnh ${member.name}`} className="member-photo" />
                    <span className="member-number">{String(member.id).padStart(2, "0")}</span>
                    {checkedMemberIds.includes(member.id) && <span className="checked-badge"><Check size={13} /> Đã điểm danh</span>}
                  </span>
                  <span className="member-card-body">
                    <strong>{member.name}</strong>
                    <span className="row-action">{checkedMemberIds.includes(member.id) ? "Đã ghi nhận hôm nay" : "Chọn để điểm danh"}</span>
                  </span>
                </button>
              ))}
              {filteredMembers.length === 0 && (
                <div className="empty-state"><Search size={26} /><strong>Không tìm thấy tên</strong><span>Hãy thử nhập một phần tên khác.</span></div>
              )}
            </div>
          </>
        )}

        {view === "confirm" && selected && (
          <div className="center-panel">
            <button className="back-button" type="button" onClick={() => setView("search")}><ChevronLeft size={19} /> Quay lại</button>
            <div className="confirm-photo-wrap"><img src={memberImage(selected.id)} alt={`Ảnh ${selected.name}`} className="confirm-photo" /></div>
            <div className="eyebrow centered"><span /> Xác nhận thông tin <span /></div>
            <h1>Đây có phải là bạn?</h1>
            <p className="lead">Vui lòng kiểm tra kỹ tên trước khi xác nhận.</p>
            <div className="name-ticket"><small>Thành viên</small><strong>{selected.name}</strong><span>BNI Mountain</span></div>
            {error && <p className="error-message">{error}</p>}
            <button className="primary-button" type="button" onClick={confirmAttendance} disabled={submitting}>
              {submitting ? <span className="spinner" /> : <Check size={21} />}
              {submitting ? "Đang ghi nhận..." : isCorrecting ? "Xác nhận thay đổi" : "Xác nhận tôi đã đến"}
            </button>
            <button className="text-button" type="button" onClick={() => setView("search")}>Không phải tôi, chọn lại</button>
          </div>
        )}

        {view === "success" && selected && (
          <div className="center-panel success-panel">
            <div className="success-avatar">
              <img src={memberImage(selected.id)} alt={`Ảnh ${selected.name}`} />
              <span className="success-ring"><Check size={25} strokeWidth={3} /></span>
            </div>
            <div className="eyebrow centered"><span /> Hoàn tất <span /></div>
            <h1>Điểm danh<br />thành công!</h1>
            <p className="lead">Cảm ơn bạn đã có mặt hôm nay.</p>
            <div className="success-ticket"><small>Xin chào</small><strong>{selected.name}</strong><span><Check size={15} /> Đã ghi nhận lúc {checkedAt}</span></div>
            <p className="closing-note">Chúc bạn có một buổi kết nối thật hiệu quả.</p>
            <div className="device-locked"><Check size={16} /> Đã điểm danh hôm nay</div>
            {deviceCheckin?.correctionToken && (
              <button className="text-button" type="button" onClick={startCorrection}>Tôi chọn nhầm, sửa lại</button>
            )}
          </div>
        )}
      </section>

      <footer>BNI MOUNTAIN <span>•</span> Kết nối để cùng phát triển</footer>
    </main>
  );
}
