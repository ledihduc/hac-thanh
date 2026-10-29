const SHEET_NAME = "Điểm danh";
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
      return jsonResponse({ ok: false, error: "Không có quyền đồng bộ." });
    }

    const attendanceDate = String(payload.attendanceDate || "");
    const memberId = Number(payload.memberId);
    const name = String(payload.name || "");
    const checkedAt = new Date(payload.checkedAt);
    const previousMemberId = payload.previousMemberId == null ? null : Number(payload.previousMemberId);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(attendanceDate) || !memberId || !name || isNaN(checkedAt.getTime())) {
      return jsonResponse({ ok: false, error: "Dữ liệu điểm danh không hợp lệ." });
    }

    lock.waitLock(30000);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    prepareSheet(sheet);

    const lastRow = sheet.getLastRow();
    const values = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues() : [];
    let targetRow = -1;
    let previousRow = -1;
    values.forEach(function (row, index) {
      const rowNumber = index + 2;
      const rowDate = normalizeDate(row[0]);
      const rowMemberId = Number(row[1]);
      if (rowDate === attendanceDate && rowMemberId === memberId) targetRow = rowNumber;
      if (previousMemberId && rowDate === attendanceDate && rowMemberId === previousMemberId) previousRow = rowNumber;
    });

    const output = [attendanceDate, memberId, name, checkedAt, new Date()];
    if (targetRow > 0) {
      sheet.getRange(targetRow, 1, 1, HEADERS.length).setValues([output]);
      if (previousRow > 0 && previousRow !== targetRow) sheet.deleteRow(previousRow);
    } else if (previousRow > 0) {
      sheet.getRange(previousRow, 1, 1, HEADERS.length).setValues([output]);
    } else {
      sheet.appendRow(output);
    }

    formatSheet(sheet);
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
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
