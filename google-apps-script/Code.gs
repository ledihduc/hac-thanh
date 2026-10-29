const HEADERS = ["Ngày", "Mã thành viên", "Họ và tên", "Thời gian điểm danh", "Cập nhật lúc"];

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("BNI_SYNC_SECRET");
    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, code: "UNAUTHORIZED", error: "Không có quyền truy cập dữ liệu." });
    }

    const attendanceDate = String(payload.attendanceDate || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(attendanceDate)) {
      return jsonResponse({ ok: false, code: "INVALID_DATE", error: "Ngày điểm danh không hợp lệ." });
    }

    lock.waitLock(30000);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = dailySheetName(attendanceDate);
    let sheet = spreadsheet.getSheetByName(sheetName);

    if (payload.action === "list") {
      if (!sheet) return jsonResponse({ ok: true, rows: [] });
      prepareSheet(sheet);
      const rows = readRows(sheet, attendanceDate);
      return jsonResponse({ ok: true, rows: rows });
    }
    if (payload.action !== "checkin") {
      return jsonResponse({ ok: false, code: "INVALID_ACTION", error: "Thao tác không hợp lệ." });
    }

    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      prepareSheet(sheet);
      sortDailySheetsNewestFirst(spreadsheet);
    } else {
      prepareSheet(sheet);
    }
    const rows = readRows(sheet, attendanceDate);

    const memberId = Number(payload.memberId);
    const name = String(payload.name || "");
    if (!memberId || !name) {
      return jsonResponse({ ok: false, code: "INVALID_MEMBER", error: "Thông tin thành viên không hợp lệ." });
    }
    if (rows.some(function (row) { return row.memberId === memberId; })) {
      return jsonResponse({
        ok: false,
        code: "ALREADY_CHECKED_IN",
        error: name + " đã điểm danh hôm nay.",
      });
    }

    const checkedAt = new Date();
    sheet.appendRow([attendanceDate, memberId, name, checkedAt, new Date()]);
    formatSheet(sheet);
    return jsonResponse({ ok: true, checkedAt: checkedAt.toISOString() });
  } catch (error) {
    return jsonResponse({
      ok: false,
      code: "INTERNAL_ERROR",
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function dailySheetName(attendanceDate) {
  const parts = attendanceDate.split("-");
  return parts[2] + "-" + parts[1] + "-" + parts[0];
}

function sortDailySheetsNewestFirst(spreadsheet) {
  const dailySheets = spreadsheet.getSheets()
    .filter(function (sheet) { return /^\d{2}-\d{2}-\d{4}$/.test(sheet.getName()); })
    .sort(function (left, right) {
      return sheetNameTimestamp(right.getName()) - sheetNameTimestamp(left.getName());
    });
  dailySheets.forEach(function (sheet, index) {
    spreadsheet.setActiveSheet(sheet);
    spreadsheet.moveActiveSheet(index + 1);
  });
}

function sheetNameTimestamp(name) {
  const parts = name.split("-").map(Number);
  return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
}

function readRows(sheet, attendanceDate) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  const range = sheet.getRange(2, 1, lastRow - 1, HEADERS.length);
  const values = range.getValues();
  const displayValues = range.getDisplayValues();
  return values
    .filter(function (row, index) {
      return String(displayValues[index][0] || "").trim() === attendanceDate
        || normalizeDate(row[0]) === attendanceDate;
    })
    .map(function (row) {
      const checkedAt = row[3] instanceof Date ? row[3] : new Date(row[3]);
      return {
        memberId: Number(row[1]),
        name: String(row[2] || ""),
        checkedAt: isNaN(checkedAt.getTime()) ? "" : checkedAt.toISOString(),
      };
    })
    .filter(function (row) { return row.memberId && row.name && row.checkedAt; });
}

function normalizeDate(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, "Asia/Ho_Chi_Minh", "yyyy-MM-dd");
  }
  return String(value || "");
}

function prepareSheet(sheet) {
  const current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (current.join("|") !== HEADERS.join("|")) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function formatSheet(sheet) {
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setBackground("#c8102e")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  const rows = Math.max(sheet.getLastRow() - 1, 1);
  sheet.getRange(2, 1, rows, 1).setNumberFormat("yyyy-mm-dd");
  sheet.getRange(2, 4, rows, 2).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  sheet.setColumnWidths(1, 1, 110);
  sheet.setColumnWidths(2, 1, 110);
  sheet.setColumnWidths(3, 1, 220);
  sheet.setColumnWidths(4, 2, 165);
}
