const ORDER_SOURCE = 'ocop-hac-thanh-live';
const ORDER_SHEET_NAME = 'Trang tính1';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (payload.source !== ORDER_SOURCE) return jsonResponse({ok:false,error:'invalid_source'});
    if (!payload.orderId || !payload.customer || !Array.isArray(payload.items) || !payload.items.length) {
      return jsonResponse({ok:false,error:'invalid_order'});
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(ORDER_SHEET_NAME) || spreadsheet.getSheets()[0];
    const rows = payload.items.map(function(item) {
      return [
        safeText(payload.orderId,40),
        new Date(),
        safeText(payload.customer.name,120),
        safeText(payload.customer.address,300),
        safeText(payload.customer.phone,30),
        safeText(item.brand,80),
        safeText(item.product + (item.code ? ' - Mã ' + item.code : ''),180),
        Math.max(1,Number(item.quantity) || 1),
        Math.max(0,Number(item.unitPrice) || 0),
        safeText(payload.paymentStatus,100)
      ];
    });
    sheet.getRange(sheet.getLastRow() + 1,1,rows.length,10).setValues(rows);
    return jsonResponse({ok:true,orderId:payload.orderId,rows:rows.length});
  } catch (error) {
    return jsonResponse({ok:false,error:String(error && error.message || error)});
  } finally {
    lock.releaseLock();
  }
}

function safeText(value,maxLength) {
  const text = String(value == null ? '' : value).trim().slice(0,maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
