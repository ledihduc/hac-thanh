import { strToU8, zipSync } from "fflate";
import { members } from "./members";

type AttendanceExportRow = {
  memberId: number;
  name: string;
  checkedAt: string;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function inlineCell(reference: string, value: string, style = 0) {
  return `<c r="${reference}" t="inlineStr" s="${style}"><is><t>${escapeXml(value)}</t></is></c>`;
}

function numberCell(reference: string, value: number, style = 0) {
  return `<c r="${reference}" s="${style}"><v>${value}</v></c>`;
}

function excelDateTime(utcTimestamp: string) {
  const instant = new Date(`${utcTimestamp.replace(" ", "T")}Z`);
  return (instant.getTime() + 7 * 60 * 60 * 1000) / 86_400_000 + 25_569;
}

function excelDate(date: string) {
  return new Date(`${date}T00:00:00Z`).getTime() / 86_400_000 + 25_569;
}

export function createAttendanceWorkbook(rows: AttendanceExportRow[], attendanceDate: string) {
  const attendanceByMember = new Map(rows.map((row) => [row.memberId, row]));
  const header = `<row r="1" ht="24" customHeight="1">${[
    inlineCell("A1", "STT", 1),
    inlineCell("B1", "Mã thành viên", 1),
    inlineCell("C1", "Họ và tên", 1),
    inlineCell("D1", "Trạng thái", 1),
    inlineCell("E1", "Ngày", 1),
    inlineCell("F1", "Thời gian điểm danh", 1),
  ].join("")}</row>`;

  const body = members
    .map((member, index) => {
      const rowNumber = index + 2;
      const attendanceRow = attendanceByMember.get(member.id);
      const status = attendanceRow ? "Đã điểm danh" : "Chưa điểm danh";
      return `<row r="${rowNumber}">${numberCell(`A${rowNumber}`, index + 1)}${numberCell(`B${rowNumber}`, member.id)}${inlineCell(`C${rowNumber}`, member.name)}${inlineCell(`D${rowNumber}`, status, attendanceRow ? 3 : 4)}${numberCell(`E${rowNumber}`, excelDate(attendanceDate), 5)}${attendanceRow ? numberCell(`F${rowNumber}`, excelDateTime(attendanceRow.checkedAt), 2) : inlineCell(`F${rowNumber}`, "")}</row>`;
    })
    .join("");

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="8" customWidth="1"/><col min="2" max="2" width="16" customWidth="1"/><col min="3" max="3" width="30" customWidth="1"/><col min="4" max="4" width="19" customWidth="1"/><col min="5" max="5" width="14" customWidth="1"/><col min="6" max="6" width="24" customWidth="1"/></cols><sheetData>${header}${body}</sheetData><autoFilter ref="A1:F${members.length + 1}"/><pageMargins left="0.5" right="0.5" top="0.65" bottom="0.65" header="0.3" footer="0.3"/></worksheet>`;

  const files: Record<string, Uint8Array> = {
    "[Content_Types].xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`),
    "_rels/.rels": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`),
    "xl/workbook.xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Điểm danh ${escapeXml(attendanceDate)}" sheetId="1" r:id="rId1"/></sheets></workbook>`),
    "xl/_rels/workbook.xml.rels": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`),
    "xl/styles.xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="2"><numFmt numFmtId="164" formatCode="dd/mm/yyyy hh:mm"/><numFmt numFmtId="165" formatCode="dd/mm/yyyy"/></numFmts><fonts count="4"><font><sz val="11"/><name val="Arial"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Arial"/></font><font><b/><color rgb="FF247248"/><sz val="11"/><name val="Arial"/></font><font><color rgb="FF77716C"/><sz val="11"/><name val="Arial"/></font></fonts><fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC8102E"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE9F6ED"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF1F0EE"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="6"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="2" fillId="3" borderId="0" xfId="0" applyFill="1" applyFont="1"/><xf numFmtId="0" fontId="3" fillId="4" borderId="0" xfId="0" applyFill="1" applyFont="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`),
    "xl/worksheets/sheet1.xml": strToU8(sheetXml),
  };

  return zipSync(files, { level: 6 });
}
